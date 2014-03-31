'use strict';

twystClient.controller('SignInCtrl', function($scope, $location, sessionSvc, constSvc) {
    $scope.fblogin = function() {
        sessionSvc.fblogin();
        $location.path('/')
    };
});

twystClient.controller('SideMenuCtrl', function ($scope, $timeout, $rootScope, sessionSvc, constSvc) {
    $scope.info = {};
    $timeout(function () {
        $scope.info.status = sessionSvc.status;
        $scope.info.data = sessionSvc.data;
    }, 1000);
    $scope.$on('sessionUpdated', function () {
        $scope.info.status = sessionSvc.status;
        $scope.info.data = sessionSvc.data;
    });
});

twystClient.controller('DataCtrl', function($scope, $rootScope, $http, dataSvc, sessionSvc, constSvc) {
    $scope.savedFave = false;
    $scope.data = dataSvc.getdata();
    $scope.status = dataSvc.status;
    $scope.errors = dataSvc.errors;
    $scope.saveAlert = "";

    $scope.empty = function(which) {
        return _.isEmpty($scope.data[which]);
    };

    $scope.$on('dataUpdated', function () {
        $scope.data = dataSvc.getdata();
        $scope.status = dataSvc.status;
        $scope.errors = _.uniq(dataSvc.errors);
    });

    $scope.saveFave = function(o) {
        var data = {};
        if (sessionSvc.status.network) {
            if (sessionSvc.status.user) {
                data.outlets = o._id;
                data.account = sessionSvc.data.user.user._id;
                console.log("DATA ===>" + JSON.stringify(data));

                $http.post(constSvc.service_url + '/api/v1/favourites', data)
                    .success(function(data) {
                        $scope.savedFave = true;
                        $scope.saveAlert = "Saved to your My Twysts";
                    }).error(function (data) {
                        $scope.savedFave = false;
                        console.log("ERROR SAVING ===>" + JSON.stringify(data));
                        $scope.saveAlert = "Couldn't save to  your favourites, please try again.";
                    });
            } else {
                $scope.saveAlert = "You need to be signed in to save.";
                console.log($scope.saveAlert);

            }
        } else {
            $scope.saveAlert = "You need to be connected to save.";
            console.log($scope.saveAlert);

        }
    };

    $scope.distance = function (outlet) {
        if (!outlet || _.isEmpty(sessionSvc.data.position)) {
            return null;
        }
        var p1 = {latitude: outlet.contact.location.coords.latitude, longitude: outlet.contact.location.coords.longitude};
        var p2 = {latitude: sessionSvc.data.position.latitude, longitude: sessionSvc.data.position.longitude};
        return $rootScope.distance(p1,p2);
    };

    $scope.checkins = function(outlet) {
        var i;
        for (i = 0; i < $scope.data.checkins.length; i = i + 1) {
            if ($scope.data.checkins[i].outlet.basics.name === outlet.basics.name) {
                return $scope.data.checkins[i].count;
            }
        }
        return 0;
    };

    $scope.isFave = function(outlet) {
        var i;
        if ($scope.data.mystuff) {
            for (i = 0; i < $scope.data.mystuff.length; i++) {
                if ($scope.data.mystuff[i].details.basics.name === outlet.basics.name) {
                    return $scope.data.mystuff[i].fave;
                }
            }
        }

    };

    $scope.rewards = function(outlet) {
        var i;
        var count = 0;
        for (i = 0; i < $scope.data.rewards.length; i = i + 1) {
            if ($scope.data.rewards[i].issue_details.issued_at.basics.name === outlet.basics.name) {
                count = count + 1;
            }
        }
        return count;
    };
    $scope.getTags = function(tags) {
        if (!tags) {
            return [];
        } else if (tags.length === 0) {
            return [];
        } else if (tags.length === 1) {
            return [tags[0].substr(0,5)];
        } else if (tags.length === 2) {
            return [tags[0].substr(0,5), tags[1].substr(0,5)];
        } else if (tags.length >= 3) {
            return [tags[0].substr(0,7), tags[1].substr(0,7), tags[2].substr(0,7)];
        } else {
            return [];
        }
    };
});

twystClient.controller('HeaderCtrl', function ($scope, $http, $timeout, $log, $rootScope, sessionSvc, dataSvc, constSvc) {
    $scope.show_alert = $scope.show_alert || true;
    $scope.alert_ncr = {};
    $scope.alert_ncr.show = false;
    $scope.header = {};
    $scope.header.status = sessionSvc.status;
    console.log($scope.header.status);
    $scope.header.status.version = true;
    $scope.header.data = sessionSvc.data;

    $scope.kya_aap_ncr_mein_hain = function () {
        var lat_lower = 28.09905;
        var lat_upper = 28.97912;
        var long_upper = 77.55404;
        var long_lower = 76.79255;
        var latitude, longitude = '';

        if ($scope.header.status.position === true) {
            latitude = $scope.header.data.position.latitude;
            longitude = $scope.header.data.position.longitude;
            if (latitude >= lat_lower && latitude <= lat_upper && longitude <= long_upper && longitude >= long_lower) {
                $scope.alert_ncr.show = false;
                $scope.alert_ncr.message = "User in NCR";
                $scope.alert_ncr.color = "success";
            } else {
                $scope.alert_ncr.show = true;
                $scope.alert_ncr.message = "Twyst is currently available only in NCR.";
                $scope.alert_ncr.color = "warning";
            }
        }
    };

    $scope.$on('sessionUpdated', function() {
        $scope.header.status = sessionSvc.status;
        $scope.header.data = sessionSvc.data;
        $scope.kya_aap_ncr_mein_hain();
    });

    $scope.refreshing = "loop";
    $scope.onRefresh = function() {
        $scope.refreshing = "looping";
        $timeout(function () {
            console.log("REFRESHING");
            $scope.$apply(dataSvc.refresh);
            $scope.refreshing = "loop";
        },1000);
    };
    $scope.toggleMenu = function() {
        $scope.sideMenuController.toggleLeft();
    };

    $scope.alert = {};
    $scope.alert.color = $scope.alert.color || '';
    $scope.alert.message = $scope.alert.message || '';
    $scope.alert.show = $scope.alert.show || false;

    $scope.removeAlert = function() {
        $scope.alert.show = false;
    }

    $scope.addPhone = function(phone) {
        var updated_user = sessionSvc.data.user.user;
        updated_user.phone = phone;
        $http.put(constSvc.service_url + '/api/v1/auth/users/' + updated_user._id, updated_user)
            .success(function(data) {
                $log.warn(data.info);
                $scope.alert = {
                    color : 'success',
                    message : 'Successfully updated phone number',
                    show : 'true'
                };
            }).error(function(data) {
                $log.warn(data);
                $scope.alert = {
                    color : 'warning',
                    message : 'Couldnt update phone number',
                    show : 'true'
                };
            });
    };

    $scope.needPhone = function() {
        if (sessionSvc.status.network === true && sessionSvc.status.user === true) {
            return !(sessionSvc.data.phone || sessionSvc.data.user.user.phone);
        }
        return false;
    };
});

twystClient.controller('NearDetailCtrl', function ($routeParams, $scope, dataSvc, constSvc) {
    $scope.data = dataSvc.getdata();
    $scope.status = dataSvc.status;
    $scope.errors = dataSvc.errors;
    $scope.$on('dataUpdated', function () {
        $scope.data = dataSvc.getdata();
        $scope.status = dataSvc.status;
        $scope.errors = _.uniq(dataSvc.errors);
    });

    $scope.near = $scope.data.nearby[$routeParams.id];
    console.log(JSON.stringify($scope.near));
});

twystClient.controller('ReccoDetailCtrl', function ($routeParams, $scope, dataSvc, constSvc) {
    $scope.data = dataSvc.getdata();
    $scope.status = dataSvc.status;
    $scope.errors = dataSvc.errors;
    $scope.$on('dataUpdated', function () {
        $scope.data = dataSvc.getdata();
        $scope.status = dataSvc.status;
        $scope.errors = _.uniq(dataSvc.errors);
    });

    $scope.recco = $scope.data.reccos[$routeParams.id];
});

twystClient.controller('HomeCtrl', function ($rootScope, $scope, $timeout, $location, $window, $http, constSvc) {
    $scope.selectedTag = $scope.selectedTag || "";

    $scope.showDetail = function(recommendation) {
        $location.path('/recco/' + recommendation);
    };

    $scope.addFilter = function(event) {
        event.preventDefault();
        $scope.selectedTag = $scope.selectedTag + " " + this.tag;
        console.log($scope.selectedTag);
    };

    $scope.clearFilters = function(event) {
        event.preventDefault();
        $scope.selectedTag = "";
    };

    $scope.shareRecco = function(r) {
        $window.plugins.socialsharing.share(r.offer.basics.title + '@' + r.program.outlets[0].basics.name, r.offer.basics.description, null, 'http://www.twyst.in/');
    };

});

twystClient.controller('NearCtrl', function ($scope, $location, $timeout, constSvc) {
    $scope.map_tab = true;
    $scope.show = {};
    $scope.selectedTag = $scope.selectedTag || "";

    $scope.showDetail = function(near) {
        $location.path('/near/' + near);
    };

    $scope.addFilter = function(event) {
        event.preventDefault();
        $scope.selectedTag = $scope.selectedTag + " " + this.tag;
        console.log($scope.selectedTag);
    };

    $scope.clearFilters = function(event) {
        event.preventDefault();
        $scope.selectedTag = "";
    };
    $scope.buttonClass = function(word) {
        return (word === 'near') ? 'success' : 'info';
    };

    $scope.showMap = function() {
        $timeout(function() {
        console.log("INITIALIZING THE MAP");
        //$scope.map.center = [$scope.messages.location.info.latitude, $scope.messages.location.info.longitude];
        }, 3000);
    };

    $scope.showMapView = function() {
        $scope.map_tab = false;

    }

    $scope.showListView = function() {
        $scope.map_tab = true;
    }


    $scope.showOutletDetails = function(outlet) {
        return $scope.show[outlet.basics.name];
    };

    $scope.toggleDetails = function(outlet) {
        $scope.show[outlet.basics.name] = !$scope.show[outlet.basics.name];
    };


});


twystClient.controller('MyCtrl', function ($scope, constSvc) {
    $scope.checkins_tab = true;
    $scope.show = {};
    $scope.selectedTag = $scope.selectedTag || "";

    $scope.addFilter = function(event) {
        event.preventDefault();
        $scope.selectedTag = $scope.selectedTag + " " + this.tag;
        console.log($scope.selectedTag);
    };

    $scope.clearFilters = function(event) {
        event.preventDefault();
        $scope.selectedTag = "";
    };
    $scope.buttonClass = function(word) {
        return (word === 'my') ? 'success' : 'info';
    };

    $scope.showOutletDetails = function(checkin) {
        return $scope.show[checkin.outlet.basics.name];
    };

    $scope.toggleDetails = function(checkin) {
        $log.warn("TOGGLING " + JSON.stringify(checkin));
        $scope.show[checkin.outlet.basics.name] = !$scope.show[checkin.outlet.basics.name];
        console.log(JSON.stringify($scope.show));
    };

});

twystClient.controller('CheckinCtrl', function ($scope, $http, $location, sessionSvc, constSvc) {
    $scope.smscode = $scope.smscode || '';
    $scope.alert = $scope.alert || {
        show: false,
        message: '',
        color: '',
        where: ''
    };
    $scope.session = {};
    $scope.session.status = sessionSvc.status;
    $scope.session.data = sessionSvc.data;

    $scope.$on('sessionUpdated', function() {
        $scope.session.status = sessionSvc.status;
        $scope.session.data = sessionSvc.data;
    });

    $scope.scan = function () {
        console.log("Called scan");
        cordova.plugins.barcodeScanner.scan(
            function (result) {
                $http.post(constSvc.service_url + '/api/v1/qr/checkins', {code:result.text})
                    .success(function(data) {
                        $scope.alert.show = true;
                        $scope.alert.color = 'success';
                        $scope.alert.message = "Success: Saved your checkin!";
                        $scope.alert.where = "qr";
                        console.log("ALERT " + JSON.stringify($scope.alert));
                    }).error(function (data) {
                        $scope.alert.show = true;
                        $scope.alert.color = 'warning';
                        $scope.alert.message = "Error: " + data.message;
                        $scope.alert.where = "qr";
                        console.log("ALERT " + JSON.stringify($scope.alert));
                    });
            });
    };

    $scope.sendSMS = function(smscode) {
        var intent = "INTENT"; //leave empty for sending sms using default intent
        var success = function () {
            $scope.alert.show = true;
            $scope.alert.color = 'success';
            $scope.alert.message = "Success: Saved your checkin!",
            $scope.alert.where = "sms";
        };
        var error = function (e) {
            $scope.alert.show = true;
            $scope.alert.color = 'warning';
            $scope.alert.message = "Error: " + e;
            $scope.alert.where = "sms";
        };
        console.log("CODE ====>" + smscode);
        sms.send($scope.session.data.smsprovider.number, smscode, intent, success, error);
     };



});

twystClient.controller('SettingsCtrl', function ($scope, $http, sessionSvc, constSvc) {
    $scope.messages = $scope.messages || {};
    $scope.messages.version = {};
    $scope.messages.feedback = {};


    $scope.feedback = function(fb) {
        console.log(fb);
        $http.post(constSvc.service_url + '/api/v1/sendfeedback', {feedbackMessage: fb})
            .success(function(data) {
                $scope.messages.feedback.show = true;
                $scope.messages.feedback.text = "Thank you for your feedback!";
                $scope.messages.feedback.color = 'success';
            }).error(function (data) {
                $scope.messages.feedback.show = true;
                $scope.messages.feedback.text = "Sorry, we couldnt save your feedback";
                $scope.messages.feedback.color = 'warning';
            });
    };

    $scope.checkVersion = function() {
        sessionSvc.getVersion().then(function() {
            if (sessionSvc.status.version === true) {
                $scope.messages.version.show = true;
                $scope.messages.version.text = "Your app is up to date";
                $scope.messages.version.color = 'success';
            } else {
                $scope.messages.version.show = false;
                $scope.messages.version.text = "Your Twyst app is out of date. Please upgrade to the latest version.";
                $scope.messages.version.error = 'danger';
            }
        }, function() {
            $scope.messages.version.show = false;
            $scope.messages.version.text = "We couldn't check for updates at this time. Please try again.";
            $scope.messages.version.color = 'warning';
        });
    };
});



