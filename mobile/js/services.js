var CLIENT_VERSION = 1,
    API_VERSION = 1;
//var telephoneNumber = cordova.require("cordova/plugin/telephonenumber");

twystClient.factory('constSvc', function() {
    var constSvc = {};
    constSvc.service_url = 'http://dogfood.twyst.in';
    return constSvc;
});

twystClient.factory('dataSvc', function ($rootScope, $window, $http, $log, $timeout, $interval, sessionSvc, constSvc) {
    var dataSvc = {};
    var storage = $window.localStorage;
    dataSvc.status = {};
    dataSvc.status.nearby = false;
    dataSvc.status.checkins = false;
    dataSvc.status.rewards = false;
    dataSvc.status.reccos = false;

    dataSvc.data = {};
    dataSvc.data.position = {};
    dataSvc.data.nearby = {};
    dataSvc.data.checkins = {};
    dataSvc.data.rewards = {};
    dataSvc.data.reccos = {};
    dataSvc.data.mystuff = null;

    dataSvc.errors = [];

    dataSvc.getdata = function() {
        return JSON.parse(storage.getItem('twystData'));
    };

    dataSvc.setMyStuff = function () {
        var i;
        var mystuff = {};
        var oname = "";
        for (i = 0; i < dataSvc.data.rewards.length; i = i + 1) {
            oname = dataSvc.data.rewards[i].issue_details.issued_at.basics.name;
            mystuff[oname] = mystuff[oname] || {};
            mystuff[oname].vouchers = mystuff[oname].vouchers || [];
            mystuff[oname].vouchers.push(
                {
                    code:dataSvc.data.rewards[i].basics.code,
                    status:dataSvc.data.rewards[i].basics.status
                }
            );
            mystuff[oname].details = dataSvc.data.rewards[i].issue_details.issued_at;
        }

        for (i = 0; i < dataSvc.data.checkins.length; i = i + 1) {
            oname = dataSvc.data.checkins[i].outlet.basics.name;
            mystuff[oname] = mystuff[oname] || {};
            mystuff[oname].checkins = mystuff[oname].checkins || 0;
            mystuff[oname].checkins += dataSvc.data.checkins[i].count;
            mystuff[oname].details = dataSvc.data.checkins[i].outlet;
        }

        if (dataSvc.data.faves && dataSvc.data.faves.length !== 0) {
            for (i = 0; i < dataSvc.data.faves.length; i = i + 1) {
                if (dataSvc.data.faves[i].outlets) {
                    console.log(dataSvc.data.faves[i]);
                    oname = dataSvc.data.faves[i].outlets.basics.name;
                    mystuff[oname] = mystuff[oname] || {};
                    mystuff[oname].fave = true;
                    mystuff[oname].offers = dataSvc.data.faves[i].offers;
                    mystuff[oname].details = dataSvc.data.faves[i].outlets;
                } else {
                    // outlets is null
                }
                //console.log(JSON.stringify(dataSvc.data.faves[i]));
            }
        }
        dataSvc.data.mystuff =  _.values(mystuff);
        storage.setItem('twystData', JSON.stringify(dataSvc.data));
    };

    dataSvc.run = function () {
        $timeout(dataSvc.refresh, 500);
        $interval(dataSvc.refresh, 30000);
    };

    dataSvc.refresh = function () {
        if (!_.isEmpty(dataSvc.data.checkins) && !_.isEmpty(dataSvc.data.vouchers)) {
            dataSvc.setMyStuff();
        }
        // if network
        if (sessionSvc.status.network) {
            console.log("REFRESHING SVC");
            $http.get(constSvc.service_url + '/api/v1/recommendations')
                .success(function (data, status, header, config) {
                    console.log("REFRESHING RECCOS");
                    dataSvc.status.reccos = true;
                    dataSvc.data.reccos = data.info;
                    storage.setItem('twystData', JSON.stringify(dataSvc.data));

                    $http.get(constSvc.service_url + '/api/v1/near/' + sessionSvc.data.position.latitude + '/' + sessionSvc.data.position.longitude)
                        .success(function (data, status, header, config) {
                            dataSvc.status.nearby = true;
                            dataSvc.data.nearby = JSON.parse(data.info);
                            //console.log("NEARBY" + JSON.stringify(dataSvc.data.nearby));
                            $rootScope.$broadcast('dataUpdated');
                            storage.setItem('twystData', JSON.stringify(dataSvc.data));

                            if (sessionSvc.status.user) {
                                $http.get(constSvc.service_url + '/api/v1/mycheckins')
                                    .success(function(data, status, header, config) {
                                        dataSvc.status.checkins = true;
                                        dataSvc.data.checkins = JSON.parse(data.info);
                                        $http.get(constSvc.service_url + '/api/v1/myvouchers')
                                            .success(function(data, status, header, config) {
                                                dataSvc.status.rewards = true;
                                                dataSvc.data.rewards = JSON.parse(data.info);
                                                $http.get(constSvc.service_url + '/api/v1/favourites')
                                                    .success(function(data,status,header,config) {
                                                        dataSvc.status.faves = true;
                                                        dataSvc.data.faves = JSON.parse(data.info);
                                                        dataSvc.setMyStuff();
                                                        storage.setItem('twystData', JSON.stringify(dataSvc.data));
                                                        $rootScope.$broadcast('dataUpdated');
                                                    })
                                                    .error(function(data) {
                                                        $log.warn("COULDNT GET FAVES");
                                                        dataSvc.status.faves = false;
                                                        dataSvc.data.faves = {};
                                                        dataSvc.errors.push("Couldnt get faves");
                                                    });
                                            }).error(function(data, status, header, config) {
                                                $log.warn("COULDNT GET REWARDS");
                                                dataSvc.status.rewards = false;
                                                dataSvc.data.rewards = {};
                                                dataSvc.errors.push("Couldnt get rewards");
                                            });
                                    }).error(function(data, status, header, config) {
                                        $log.warn("COULDNT GET CHECKINS");
                                        dataSvc.status.checkins = false;
                                        dataSvc.data.checkins = {};
                                        dataSvc.errors.push("Couldnt get checkins");
                                    });
                            }
                        }).error(function (data, status, header, config) {
                            $log.warn("COULDNT GET NEARBY")
                            dataSvc.status.nearby = false;
                            dataSvc.data.nearby = {};
                            dataSvc.errors.push("Couldnt get nearby");
                        });
                }).error(function(data, status, header, config) {
                    $log.warn("COULDNT GET RECCOS")
                    dataSvc.status.reccos = false;
                    dataSvc.data.reccos = {};
                    dataSvc.errors.push("Couldnt get reccos");
                });
        }
    };

    return dataSvc;
});

twystClient.factory('sessionSvc', function ($window, $rootScope, $http, $q, $log, $timeout, $interval, constSvc) {
    var sessionSvc = {},
        networkState = null;

    sessionSvc.status = {};
    sessionSvc.data = {};
    sessionSvc.status.network = true;
    sessionSvc.status.user = false;
    sessionSvc.status.version = true;
    sessionSvc.errors = [];

    sessionSvc.getSMSProviderInfo = function () {
        var deferred = $q.defer();
        $http.get(constSvc.service_url + '/api/v1/sms/provider')
            .success(function (data) {
                sessionSvc.status.smsprovider = true;
                sessionSvc.data.smsprovider = data.info;
                console.log("SMS PROVIDER=====>:" + JSON.stringify(data.info));
                $rootScope.$broadcast('sessionUpdated');
                deferred.resolve(data);
            }).error(function (data) {
                sessionSvc.status.smsprovider = false;
                sessionSvc.data.smsprovider = null;
                $rootScope.$broadcast('sessionUpdated');
                console.log("SMS PROVIDER ERROR:" + data);
                deferred.reject(data);
            });
        return deferred.promise;
    };

    sessionSvc.getPhoneNumber = function () {
        var deferred = $q.defer();
        /*telephoneNumber.get(function (result) {
            sessionSvc.status.phone = true;
            sessionSvc.data.phone = result;
            console.log("PHONE NUMBER:" + result);
            deferred.resolve(result);
        }, function (error) {
            sessionSvc.status.phone = false;
            sessionSvc.data.phone = null;
            console.log("PHONE NUMBER ERROR:" + error);
            deferred.reject(error);
        });*/
        return deferred.promise;
    };

    sessionSvc.getLoggedInUser = function () {
        var deferred = $q.defer();
        $http.get(constSvc.service_url + '/api/v1/auth/get_logged_in_user')
            .success(function (data) {
                sessionSvc.data.user = data;
                sessionSvc.status.user = true;
                $rootScope.$broadcast('sessionUpdated');
                console.log("USER:" + data);
                deferred.resolve(data);
            }).error(function (data) {
                console.log("USER ERROR:" + data);
                sessionSvc.data.user = null;
                sessionSvc.status.user = false;
                $rootScope.$broadcast('sessionUpdated');
                deferred.reject(data);
            });
        return deferred.promise;
    };

    sessionSvc.getVersion = function () {
        var deferred = $q.defer();
        $http.get(constSvc.service_url + '/api/v1/clientversion')
            .success(function (data) {
                var v = JSON.parse(data.info);
                if (Number(CLIENT_VERSION) < Number(v.client) ||
                    Number(API_VERSION) < Number(v.api)) {
                    console.log("NOT COMPATIBLE");
                    sessionSvc.status.version = false;
                } else {
                    console.log("COMPATIBLE");
                    sessionSvc.status.version = true;
                }
                sessionSvc.data.version = JSON.parse(data.info);
                $rootScope.$broadcast('sessionUpdated');
                deferred.resolve(data);
            }).error(function (data) {
                console.log("VERSION ERROR:" + data);
                sessionSvc.data.version = null;
                sessionSvc.status.version = false;
                $rootScope.$broadcast('sessionUpdated');
                deferred.reject(data);
            });
        return deferred.promise;
    };

    sessionSvc.getNetwork = function() {
        var deferred = $q.defer();
        sessionSvc.status.network = true;
        $rootScope.$broadcast('sessionUpdated');
        deferred.resolve();
        return deferred.promise;
    };
    sessionSvc.getPosition = function() {
        var deferred = $q.defer();
        $window.navigator.geolocation.getCurrentPosition(function (position) {
            sessionSvc.status.position = true;
            sessionSvc.data.position =  {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy
            };
            $rootScope.$broadcast('sessionUpdated');
            deferred.resolve(position);
        }, function (error) {
            $log.warn("COULDN'T GET POSITION" + JSON.stringify(error));
            sessionSvc.status.position = false;
            sessionSvc.data.position = {};
            deferred.reject(error);
        }, {enableHighAccuracy : false, maximumAge : 3000, timeout : 60000, frequency: 5000});

        return deferred.promise;
    };

    sessionSvc.run = function () {
        // One time, 5 seconds after startup
        $timeout(function() {
            sessionSvc.getLoggedInUser();
            sessionSvc.getSMSProviderInfo();
            sessionSvc.getPhoneNumber();
            sessionSvc.getVersion();
            sessionSvc.getNetwork();
            sessionSvc.getPosition();
        }, 1000);

        // Every 3 seconds
        $interval(function () {
            sessionSvc.getNetwork();
            sessionSvc.getPosition();
        }, 3000);
    };

    var window_ref = null;
    sessionSvc.fblogin = function () {
        window_ref = $window.open(constSvc.service_url + '/api/v1/auth/facebook', '_blank');
        window_ref.addEventListener('loadstop', iabLoadStop);
        window_ref.addEventListener('exit', iabClose);
    };

    var iabLoadStop = function (event) {
        if (event.url.search(/code=/) !== -1) {
            $log.warn("GETTING LOGGED IN USER");
            $http.get(constSvc.service_url + '/api/v1/auth/get_logged_in_user')
                .success(function (data) {
                    sessionSvc.data.user = data;
                    login();
                    window_ref.close();
                }).error(function (data) {
                    console.log(data);
                    window_ref.close();
                });
        }
    };

    var iabClose = function (event) {
        window_ref.removeEventListener('loadstop',iabLoadStop);
        window_ref.removeEventListener('exit',iabClose);
    };

    var login = function () {
        console.log('in login function');
        if (sessionSvc.data.user) {
            $http.get(constSvc.service_url + '/api/v1/auth/facebook/callback')
                .success(function (data, status, headers, config) {
                    sessionSvc.status.user = true;
                    $rootScope.$broadcast('sessionUpdated');
                    console.log('logged in')
                }).error(function (data, status, headers, config) {
                    sessionSvc.status.user = false;
                    console.log("couldnt log in");
                });
        }
    };
    return sessionSvc;
});