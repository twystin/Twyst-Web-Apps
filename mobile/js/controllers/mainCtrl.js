'use strict';
var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");
function MainCtrl($scope, $window, $http, $log, $timeout) {
    $scope.errors = [];
    $scope.data = {};
    var CLIENT_VERSION = 1,
        API_VERSION = 1,
        storage = $window.localStorage;

    $scope.network_available = function () {
        var networkState = $window.navigator.network.connection.type;

        if (networkState === Connection.NONE ||  networkState === Connection.UNKNOWN) {
            return false;
        }
        return true;
    };

    $scope.local_data_available = function () {
        return !!storage.getItem('twystData');
    };

    $scope.gotLocation = function (position) {
        $scope.latitude = position.coords.latitude;
        $scope.longitude = position.coords.longitude;
        $scope.accuracy = position.coords.accuracy;
    };
    $scope.didntGetLocation = function(error) {
        $log.warn("Couldn't get the users position");
    };
    $scope.getPosition = function () {
        navigator.geolocation.getCurrentPosition($scope.gotLocation, $scope.didntGetLocation, {enableHighAccuracy : false, maximumAge : 3000, timeout : 60000, frequency: 5000});
    };
    $scope.send_user_location = function () {
        $scope.getPosition();
        $http.post('http://dogfood.twyst.in/api/v1/user/home', {latitude: $scope.latitude, longitude: $scope.longitude})
            .success(function (data) {
                $log.info("Set users position");
                //TODO
            }).error(function (data) {
                $log.warn("Couldnt set users position");
                //TODO
            });
    };
    $scope.is_user_in_twyst_city = function () {
        // TODO: Replace with a call to check users city
        return true;
    };

    $scope.init = function () {
        $timeout(function () {
            if ($scope.network_available() !== true) {
                console.log("got here");
                if ($scope.local_data_available() !== true) {
                    $scope.errors.push({
                        'status' : 'error',
                        'message' : 'Sorry! You are not connected to the network, and you don\'t have any information stored locally.',
                        'info'  : 'Network not availalbe. Local storage empty.',
                        'level': 'END'
                    });
                } else {
                    $scope.data = storage.getItem('twystData');
                }
            } else {
                $http.get('http://dogfood.twyst.in/api/v1/clientversion')
                    .success(function (data) {
                        var info = JSON.parse(data.info);
                        var client_version = info.client;
                        var API_version = info.api;
                        if (Number(CLIENT_VERSION) < Number(client_version) ||
                            Number(API_VERSION) < Number(API_version)) {
                            $scope.errors.push({
                                'status' : 'error',
                                'message' : 'You have an older version of the client. Please download the latest version.',
                                'info'  : 'Client not compatible.',
                                'level' : 'END'
                            });
                        } else {
                            if ($scope.is_user_in_twyst_city() !== true) {
                                $scope.errors.push({
                                    'status' : 'error',
                                    'message' : 'You are not in a location where Twyst has launched. We are available only in Gurgaon as of now.',
                                    'info'  : 'Not in client city.',
                                    'level' : 'CONTINUE'
                                });
                            }
                        }
                    }).error(function () {
                        //TODO
                    });
            }
        }, 1000);
    };

    $scope.getRecommendations = function() {
        $http.get('http://localhost:3000/api/v1/recommendations')
            .success(function(data) {
                console.log(data);
                $scope.recommendations = data.info;
            })
            .error(function(data) {
                console.log(data);
            })
    }

    $scope.scan = function() {
        console.log("Called scan");
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                alert("We got a barcode\n" +
                    "Result: " + result.text + "\n" +
                    "Format: " + result.format + "\n" +
                    "Cancelled: " + result.cancelled);
            })
    };

    $scope.getPhoneNumber = function() {
        telephoneNumber.get(function(result) {
            alert("result= " + result);
            console.log("result = " + result);
        }, function() {
            console.log("error");
        });
    }

    $scope.sendSMS = function() {
        var intent = "INTENT"; //leave empty for sending sms using default intent
        var success = function () { alert('Message sent successfully'); };
        var error = function (e) { alert('Message Failed:' + e); };
        sms.send('9779456097', 'test', intent, success, error);
    };

    $scope.checkVersionCompatibility = function () {
        $http.get('http://dogfood.twyst.in/api/v1/clientversion')
            .success(function (data) {
                var info = JSON.parse(data.info);
                var client_version = info.client;
                var API_version = info.api;
                var status = info.status;
                if (Number(CLIENT_VERSION) <
                    Number(client_version) ||
                    Number(API_VERSION) < Number(API_version)) {
                    alert("You need to upgrade your client");
                } else {
                    alert("Your client is up to date");
                }
            }).error(function (data) {
                console.log(JSON.stringify(data));
                alert(JSON.stringify(data));
            });
    };

    $scope.checkConnection = function() {
        var networkState = $window.navigator.network.connection.type;

        var states = {};
        states[Connection.UNKNOWN]  = 'Unknown connection';
        states[Connection.ETHERNET] = 'Ethernet connection';
        states[Connection.WIFI]     = 'WiFi connection';
        states[Connection.CELL_2G]  = 'Cell 2G connection';
        states[Connection.CELL_3G]  = 'Cell 3G connection';
        states[Connection.CELL_4G]  = 'Cell 4G connection';
        states[Connection.NONE]     = 'No network connection';

        alert('Connection type: ' + states[networkState]);
    };

    $scope.putLocalStore = function() {
        storage.setItem($scope.key, $scope.value);
    }

    $scope.deleteLocalStore = function() {
        storage.removeItem($scope.remove);
    }

    $scope.getLocalStore = function() {
        $scope.found = storage.getItem($scope.find);
    }

    $scope.login = function () {
        console.log('in login function');
        if ($scope.user_data) {
            $http.get('http://dogfood.twyst.in/api/v1/auth/facebook/callback')
                .success(function (data, status, headers, config) {
                    console.log("logged in");
                    $scope.send_user_location();
                    $http.get('http://dogfood.twyst.in/api/v1/analytics/getvoucherdata')
                        .success(function(data) { console.log(data);})
                        .error(function(data,status) { console.log(data); });
                }).error(function (data, status, headers, config) {
                    console.log("couldnt log in");
                });
        }
    };

    $scope.window_ref = null;

    $scope.fblogin = function () {
        $scope.window_ref = $window.open('http://dogfood.twyst.in/api/v1/auth/facebook', '_blank', 'location=yes');
        $scope.window_ref.addEventListener('loadstop', $scope.iabLoadStop);
        $scope.window_ref.addEventListener('exit', $scope.iabClose);
    };

    $scope.iabLoadStop = function (event) {
        if (event.url.search(/code=/) != -1) {
            $http.get('http://dogfood.twyst.in/api/v1/auth/get_logged_in_user')
                .success(function (data) {
                    console.log("succeeded");
                    console.log(JSON.stringify(data));
                    $scope.user_data = data;
                    $scope.login();
                    //$scope.window_ref.close();
                }).error(function (data) {
                    console.log(data);
                    //$scope.window_ref.close();
                });
        }
    };

    $scope.iabClose = function(event) {
        $scope.window_ref.removeEventListener('loadstop', $scope.iabLoadStop);
        $scope.window_ref.removeEventListener('exit', $scope.iabClose);
    };
}