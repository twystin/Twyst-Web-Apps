twystClient.controller('FirstRunCtrl', function($scope, $rootScope, $window) {
    $rootScope.state = 'home';

    /*
    var storage = $window.localStorage;
    $scope.show = 1;
    var data = JSON.parse(storage.getItem('twystData')) || {};

    if (data.first_run !== true) {
        $rootScope.state = 'first_run';
    } else {
        $rootScope.state = 'home';
    }

    $scope.dismiss = function() {
        data.first_run = true;
        storage.setItem('twystData', JSON.stringify(data));
        $rootScope.state = 'home';
    };
    */
});

twystClient.controller('AuthCtrl', function($scope, $window, $rootScope, sessionSvc, logSvc) {
    'use strict';
    $scope.phone = '';
    $scope.auth = sessionSvc.auth;

    $scope.$on('authRelatedEvent', function() {
        $scope.auth = sessionSvc.auth;
    });

    $scope.otplogin = function(phone) {
        console.log(phone);
        sessionSvc.otplogin(phone);
    };

    $scope.otpverify = function(otp) {
        sessionSvc.otpverify(otp, $scope.phone);
    };

    $scope.facebook = function() {
        sessionSvc.facebook();
    };

    /*
    var storage = $window.localStorage;
    var data = JSON.parse(storage.getItem('twystData')) || {};
    $scope.otp = data.otp || {};
    $scope.phone = data.phone || '';
    console.log($scope.otp);

    $scope.otplogin = function(phone) {
        var data = JSON.parse(storage.getItem('twystData')) || {};
        $scope.phone = data.phone = phone;
        $scope.otp = data.otp = {status:'otp_requested'};
        console.log($scope.otp_status);
        storage.setItem('twystData', JSON.stringify(data));
        console.log(data);
        sessionSvc.otplogin(phone);
    };

    $scope.otpverify = function(otp) {
        sessionSvc.otpverify(otp, $scope.phone);
    };

    $scope.$on('otpSent', function () {
        $scope.otp = {status:'otp_requested'};
    });
    //OTP changes end
    */
    $scope.fblogin = function() {
        logSvc.info("Logging into Facebook");
        sessionSvc.fblogin();

        $rootScope.state = 'home';
    };

    $scope.logout = function() {
        logSvc.info("Logging out from Facebook");
        sessionSvc.logout();

        $rootScope.state = 'home';
    };
});

twystClient.controller('DataCtrl', function($scope, $rootScope, $http, dataSvc, sessionSvc, constSvc, placesSvc, logSvc) {
    $scope.savedFave = false;
    $scope.data = dataSvc.getdata();
    $scope.status = dataSvc.status;
    $scope.errors = dataSvc.errors;
    $scope.saveAlert = "";
    $scope.addFilterForTimleine = function(foo) {
        $scope.searchFilter = foo;
    }
    $scope.send_user_location = function() {
        /*$scope.getPosition();
         $http.post('http://dogfood.twyst.in/api/v1/user/home', {latitude: $scope.latitude, longitude: $scope.longitude})
         .success(function (data) {
         $log.info("Set users position");
         //TODO
         }).error(function (data) {
         $log.warn("Couldnt set users position");
         //TODO
         });
         */
    };
    $scope.getdata = function() {
        console.log("TWYST: calling get data");
        $scope.data = dataSvc.getdata();
    };

    $scope.empty = function(which) {
        return _.isEmpty($scope.data[which]);
    };

    $scope.$on('dataUpdated', function() {
        $scope.data = dataSvc.getdata();
        $scope.status = dataSvc.status;
        $scope.errors = _.uniq(dataSvc.errors);
    });

    $scope.deleteFave = function(o, off) {
        logSvc.info("Entered deleteFave");
        var i = 0;
        var fave_id = '';
        var found = false;
        if (sessionSvc.status.network) {
            if (sessionSvc.status.user) {
                if ($scope.data.faves) {
                    for (i = 0; i < $scope.data.faves.length; i++) {
                        if ($scope.data.faves[i].outlets &&
                            $scope.data.faves[i].offers &&
                            $scope.data.faves[i].outlets.basics.name === o.basics.name &&
                            $scope.data.faves[i].offers.basics.title === off.basics.title) {
                            dataSvc.data.faves = _.filter(dataSvc.data.faves, function(item) {
                                return (item._id !== $scope.data.faves[i]._id);
                            });
                            dataSvc.createTimeline();
                            //found = true;
                        }
                    }
                }

                if (dataSvc.temp.faves && dataSvc.temp.faves.length > 0 && !found) {
                    for (i = 0; i < dataSvc.temp.faves.length; i++) {
                        if (dataSvc.temp.faves[i].outlets &&
                            dataSvc.temp.faves[i].offers &&
                            dataSvc.temp.faves[i].outlets.basics.name === o.basics.name &&
                            dataSvc.temp.faves[i].offers.basics.title === off.basics.title) {
                            dataSvc.temp.faves = _.filter(dataSvc.temp.faves, function(item) {
                                return (item._id !== dataSvc.temp.faves[i]._id);
                            });
                            dataSvc.createTimeline();
                            found = true;
                        }
                    }
                }

                $http.delete(constSvc.service_url + '/api/v1/favourites/' + o._id + '/' + off._id)
                    .success(function(data) {
                        $scope.$$phase || $scope.$apply();
                    }).error(function(data) {
                        //
                    });
            } else {
                $scope.saveAlert = "You need to be signed in to delete.";
            }
        } else {
            $scope.saveAlert = "You need to be connected to delete.";
        }
    };

    $scope.saveFave = function(p, t, o, off) {
        logSvc.info("Entered saveFave");
        var data = {};
        if (sessionSvc.status.network) {
            if (sessionSvc.status.user) {
                data.outlets = o._id;
                data.offers = off._id;
                data.program = p._id;
                data.tier = t._id;
                data.account = sessionSvc.data.user._id;
                dataSvc.saveFaveTemp(off, o);

                $http.post(constSvc.service_url + '/api/v1/favourites', data)
                    .success(function(data) {
                        $scope.$$phase || $scope.$apply();
                        $scope.savedFave = true;
                        //$scope.saveAlert = "Saved to your My Twysts";
                    }).error(function(data) {
                        $scope.savedFave = false;
                        $scope.saveAlert = "Couldn't save to  your favourites, please try again.";
                    });
            } else {
                $scope.saveAlert = "You need to be signed in to save.";
            }
        } else {
            $scope.saveAlert = "You need to be connected to save.";
        }
    };

    $scope.places_in_ncr = placesSvc.places;

    $scope.getPlace = function() {
        var place = placesSvc.getPlace();
        if (place) {
            return place.name;
        }
        return "Unknown place";
    };

    $scope.dist = {
        kms: 10
    };
    $scope.distances = [{
        kms: 10
    }, {
        kms: 15
    }, {
        kms: 20
    }, {
        kms: 2000
    }];

    $scope.distanceFilter = function(near) {
        var outlet = near.outlet || near;
        if (!outlet) {
            return false;
        }

        if (!outlet.contact.location.coords) {
            return false;
        }
        var p1 = {
            latitude: outlet.contact.location.coords.latitude,
            longitude: outlet.contact.location.coords.longitude
        };
        var p2 = {
            latitude: sessionSvc.data.position.latitude,
            longitude: sessionSvc.data.position.longitude
        };

        if (Number($rootScope.distance(p1, p2)) > $scope.dist.kms) {
            return false;
        };

        return true;
    };

    $scope.distance = function(near) {
        var outlet = near.outlet || near;
        if (!outlet) {
            return '[error]';
        }
        if (_.isEmpty(sessionSvc.data.position)) {
            return '[finding] ';
        }
        if (!outlet.contact.location.coords) {
            return '[error]';
        }
        var p1 = {
            latitude: outlet.contact.location.coords.latitude,
            longitude: outlet.contact.location.coords.longitude
        };
        var p2 = {
            latitude: sessionSvc.data.position.latitude,
            longitude: sessionSvc.data.position.longitude
        };

        if ($rootScope.distance(p1, p2) === 21) {
            return 'more than 20';
        } else {
            return Number($rootScope.distance(p1, p2));
        }

    };


    $scope.program_checkins = function(program) {
        var i;
        var count = 0;
        var found = false;

        if (!program ||
            !$scope.data.checkins ||
            _.isEmpty($scope.data.checkins) ||
            _.isEmpty(program)) {
            return 0;
        }

        if (dataSvc.temp.checkins) {
            for (i = 0; i < dataSvc.temp.checkins.length; i = i + 1) {
                if (dataSvc.temp.checkins[i].checkin_program &&
                    dataSvc.temp.checkins[i].checkin_program._id &&
                    dataSvc.temp.checkins[i].checkin_program._id === program._id) {
                    count = count + 1;
                    found = true;
                }
            }
        }
        if ($scope.data.checkins && !_.isEmpty($scope.data.checkins)) {
            for (i = 0; i < $scope.data.checkins.length; i = i + 1) {
                if ($scope.data.checkins[i].checkin_program &&
                    $scope.data.checkins[i].checkin_program._id &&
                    $scope.data.checkins[i].checkin_program._id === program._id) {
                    count = count + 1;
                }
            }
        }
        return count || 0;
    };

    $scope.checkins = function(outlet, offer) {
        var i;
        var count = 0;
        var found = false;
        // UPDATING IT TO FIND ONLY OFFERS COUNT
        // OLD CODE BELOW
        if (!offer ||
            !$scope.data.checkins ||
            _.isEmpty($scope.data.checkins) ||
            _.isEmpty(offer)) {
            return 0;
        }

        if (dataSvc.temp.checkins) {
            for (i = 0; i < dataSvc.temp.checkins.length; i = i + 1) {
                if (dataSvc.temp.checkins[i].checkin_for &&
                    dataSvc.temp.checkins[i].checkin_for.basics &&
                    dataSvc.temp.checkins[i].checkin_for.basics.title &&
                    dataSvc.temp.checkins[i].checkin_for.basics.title === offer.basics.title) {
                    count = count + 1;
                    found = true;
                }
            }
        }

        if (!found && $scope.data.checkins && !_.isEmpty($scope.data.checkins)) {
            for (i = 0; i < $scope.data.checkins.length; i = i + 1) {
                if ($scope.data.checkins[i].checkin_for &&
                    $scope.data.checkins[i].checkin_for.basics &&
                    $scope.data.checkins[i].checkin_for.basics.title &&
                    $scope.data.checkins[i].checkin_for.basics.title === offer.basics.title) {
                    count = count + 1;
                }
            }
        }
        return count || 0;
    };

    $scope.isFave = function(outlet, offer) {
        var i;
        var fave = false;

        if (!offer || !outlet || _.isEmpty(offer) || _.isEmpty(outlet) || !offer.basics.title || !outlet.basics.name) {
            return false;
        }

        if (dataSvc.temp.faves && dataSvc.temp.faves.length > 0) {
            for (i = 0; i < dataSvc.temp.faves.length; i++) {
                if (dataSvc.temp &&
                    dataSvc.temp.faves[i] &&
                    dataSvc.temp.faves[i].outlets &&
                    dataSvc.temp.faves[i].outlets.basics &&
                    dataSvc.temp.faves[i].outlets.basics.name &&
                    dataSvc.temp.faves[i].outlets.basics.name === outlet.basics.name &&
                    dataSvc.temp.faves[i].offers &&
                    dataSvc.temp.faves[i].offers.basics &&
                    dataSvc.temp.faves[i].offers.basics.title &&
                    dataSvc.temp.faves[i].offers.basics.title === offer.basics.title) {
                    fave = true;
                }
            }
        }

        if ($scope.data.faves && !fave) {
            for (i = 0; i < $scope.data.faves.length; i++) {
                if ($scope.data.faves[i] &&
                    $scope.data.faves[i] &&
                    $scope.data.faves[i].outlets &&
                    $scope.data.faves[i].outlets.basics &&
                    $scope.data.faves[i].outlets.basics.name &&
                    $scope.data.faves[i].outlets.basics.name === outlet.basics.name &&
                    $scope.data.faves[i].offers &&
                    $scope.data.faves[i].offers.basics &&
                    $scope.data.faves[i].offers.basics.title &&
                    $scope.data.faves[i].offers.basics.title === offer.basics.title) {
                    fave = true;
                }
            }
        }

        return fave;

    };

    $scope.isReward = function(outlet, offer, num, checkin_count) {

        // Handles the case for if the reward row is higher than the checkin count
        /*
        if (num > checkin_count) {
            return 'white';
        }
        */
        var i, j;
        if ($scope.data.rewards && !_.isEmpty($scope.data.rewards)) {
            for (i = 0; i < $scope.data.rewards.length; i = i + 1) {
                if (JSON.stringify($scope.data.rewards[i].issue_details.issued_for) === JSON.stringify(offer)) {
                    if($scope.data.rewards[i].basics.status === 'active') {
                        return 'orange';
                    }
                    else {
                        return 'grey';
                    }
                }
            }
        }
        return 'white';
    };
    // OLD CODE -- CAN BE DELETED
    /*
    $scope.has_reward = function(outlet) {
        var i, j;
        var count = 0;
        if ($scope.data.rewards && !_.isEmpty($scope.data.rewards)) {
            for (i = 0; i < $scope.data.rewards.length; i = i + 1) {
                for (j = 0; j < $scope.data.rewards[i].issue_details.issued_at.length; j++) {
                    if ($scope.data.rewards[i].issue_details.issued_at[j].basics.name === outlet.basics.name) {
                        if ($scope.data.rewards[i].used_details.used_at === undefined) {
                            count = count + 1;
                            $rootScope.item = $rootScope.item || {};
                            $rootScope.item.rewards = $rootScope.item.rewards || {};
                            $rootScope.item.rewards[outlet.basics.name] = $scope.data.rewards[i];                            
                        }
                    }
                }
            }
        }
        return count;
    };
    */

    $scope.should_i_show_a_reward_2 = function(o,p,t,of) {
        var i, j;
        if($scope.data.rewards && !_.isEmpty($scope.data.rewards)) {
            for (i = 0; i < $scope.data.rewards.length; i++) {
                if ($scope.data.rewards[i].issue_details.program._id === p._id &&
                    $scope.data.rewards[i].issue_details.tier._id === t._id && 
                    $scope.data.rewards[i].issue_details.issued_for._id === of._id) 
                {
                    if ($scope.data.rewards[i].basics.status === 'active' &&
                        $scope.data.rewards[i].used_details.used_at === undefined) {
                            return 'orange';
                    } else {
                        return 'grey';
                    }
                }
            }
        }
        return 'white';
    }

    $scope.should_i_show_a_reward = function(o,p,t,of) {
        var i, j;
        if($scope.data.rewards && !_.isEmpty($scope.data.rewards)) {
            for (i = 0; i < $scope.data.rewards.length; i++) {
                if ($scope.data.rewards[i].issue_details.program._id === p._id &&
                    $scope.data.rewards[i].issue_details.tier._id === t._id && 
                    $scope.data.rewards[i].issue_details.issued_for._id === of._id) 
                {
                    if ($scope.data.rewards[i].basics.status === 'active' &&
                        $scope.data.rewards[i].used_details.used_at === undefined &&
                        $scope.data.rewards[i].issue_details.program.status === 'active') {
                            $rootScope.item = $rootScope.item || {};
                            $rootScope.item.rewards = $rootScope.item.rewards || {};
                            $rootScope.item.rewards[o.basics.name] = $scope.data.rewards[i];                            
                            return true;
                    }
                }
            }
        }
        return false;
    }

    $scope.rewards = function(outlet) {
        var i, j;
        var count = 0;
        if ($scope.data.rewards && !_.isEmpty($scope.data.rewards)) {
            for (i = 0; i < $scope.data.rewards.length; i = i + 1) {
                for (j = 0; j < $scope.data.rewards[i].issue_details.issued_at.length; j++) {
                    if ($scope.data.rewards[i].issue_details.issued_at[j].basics.name === outlet.basics.name) {
                        count = count + 1;
                        $rootScope.item = $rootScope.item || {};
                        $rootScope.item.rewards = $rootScope.item.rewards || {};
                        $rootScope.item.rewards[outlet.basics.name] = $scope.data.rewards[i];                            
                    }
                }
            }
        }
        return count;
    };
    $scope.getTags = function(outlet_tags, offer_tags) {
        if (!outlet_tags) {
            if (!offer_tags) {
                return [];
            } else {
                return (_.uniq(offer_tags)).splice(0, 5);
            }
        } else {
            if (!offer_tags) {
                return (_.uniq(outlet_tags)).splice(0, 5);
            } else {
                return (_.uniq(offer_tags.concat(outlet_tags))).splice(0, 5);
            }
        }
    };
});

twystClient.controller('HeaderCtrl', function($scope, $anchorScroll, $window, alertSvc, $location, $http, $timeout, $log, $rootScope, sessionSvc, dataSvc, constSvc, logSvc) {
    $scope.show_alert = $scope.show_alert || true;
    $scope.header = {};
    $scope.header.auth = sessionSvc.auth;
    $scope.header.status = sessionSvc.status;
    $scope.header.status.version = sessionSvc.status.version;
    $scope.header.data = sessionSvc.data;
    $scope.alert_ncr = alertSvc.alert_ncr;

    $rootScope.state = $rootScope.state || 'first_run';
    if (!sessionSvc.status.network ||
        !sessionSvc.status.server_up ||
        !sessionSvc.status.user ||
        !sessionSvc.status.version ||
        !sessionSvc.status.position) {
        $rootScope.alertSet = true;
    } else {
        $rootScope.alertSet = false;
    }

    $scope.handleBack = function() {
        //
    }

    $scope.getDownloadURL = function() {
        window_ref = $window.open(constSvc.service_url + '/r/latest', '_blank');
    };

    $scope.kya_aap_ncr_mein_hain = function() {
        var lat_lower = 28.09905;
        var lat_upper = 28.97912;
        var long_upper = 77.55404;
        var long_lower = 76.79255;
        var latitude, longitude = '';

        if ($scope.header.status.position === true) {
            latitude = $scope.header.data.position.latitude;
            longitude = $scope.header.data.position.longitude;
            if (latitude >= lat_lower && latitude <= lat_upper && longitude <= long_upper && longitude >= long_lower) {
                alertSvc.alert_ncr.show = false;
                alertSvc.alert_ncr.message = "User in NCR";
                alertSvc.alert_ncr.color = "success";
            } else {
                alertSvc.alert_ncr.show = (alertSvc.alert_ncr.show === false) ? false : true;
                alertSvc.alert_ncr.message = "Twyst is currently available only in NCR.";
                alertSvc.alert_ncr.color = "warning";
            }
        }
    };

    $scope.$on('sessionUpdated', function() {
console.log("TWYST: Session was updated in controller");
        $scope.header.auth = sessionSvc.auth;
        $scope.header.status = sessionSvc.status;
        $scope.header.data = sessionSvc.data;
        $scope.kya_aap_ncr_mein_hain();
        if (!sessionSvc.status.network ||
            !sessionSvc.status.server_up ||
            !sessionSvc.status.user ||
            !sessionSvc.status.version ||
            !sessionSvc.status.position) {
            $rootScope.alertSet = true;
        } else {
            $rootScope.alertSet = false;
        }
    });

    $scope.settings = function() {

        $rootScope.state = 'settings'
        //$location.path('/settings');
    };

    $scope.showTab = function(tab_name) {
        $rootScope.state = tab_name;
        logSvc.info("Clicked on tab " + tab_name);
        //this is slowing things down
        if (tab_name === 'timeline') { // also  || tab_name==='near'
            $timeout(function() {
                dataSvc.refresh();
            }, 5000);
        }
    };

    $scope.onRefresh = function() {
        dataSvc.refresh();
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
        var updated_user = sessionSvc.data.user;
        updated_user.phone = phone;
        $http.put(constSvc.service_url + '/api/v1/auth/users/' + updated_user._id, updated_user)
            .success(function(data) {
                $scope.$$phase || $scope.$apply();
                $log.warn(data.info);
                $scope.alert = {
                    color: 'success',
                    message: 'Successfully updated phone number',
                    show: 'true'
                };
            }).error(function(data) {
                $log.warn(data);
                $scope.alert = {
                    color: 'warning',
                    message: 'Couldnt update phone number',
                    show: 'true'
                };
            });
    };
});

twystClient.controller('ItemsCtrl', function($rootScope, $scope, $timeout, $location, $window, $http, dataSvc, constSvc) {
    $scope.selectedTag = $scope.selectedTag || "";
    $scope.place = "home";
    $scope.limit = 10;

    $scope.isNewProgram = function(program) {
        var d = new Date(program.created_at);
        var dt = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        var timelag = (Date.now() - dt) / (1000 * 24 * 60 * 60);
        if (timelag < 15) return true;
        return false;
    };

    $scope.isEndingProgram = function(program) {
        var d = new Date(program.validity.earn_end);
        var dt = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        var timelag = (dt - Date.now()) / (1000 * 24 * 60 * 60);
        if (timelag < 7 && timelag > 0) return true;
        return false;
    };    

    $scope.showReward = function(outlet_name) {
        //$location.path('/rewards/' + $rootScope.item.rewards[outlet_name]._id);
        $rootScope.item.reward = $rootScope.item.rewards[outlet_name]._id;

        $rootScope.state = 'reward_detail';
    };

    $scope.showDetail = function(program, tier, outlet, offer) {
        $rootScope.item = $rootScope.item || {};
        $rootScope.item.program = program;
        $rootScope.item.tier = tier;
        $rootScope.item.outlet = outlet;
        $rootScope.item.offer = offer;

        $rootScope.state = 'detail';
        //$location.path('/details/');
    };

    $scope.addFil = function(foo) {
        $scope.selectedTag = $scope.selectedTag + " " + foo;
    }

    $scope.addFilter = function(event) {
        event.preventDefault();
        $scope.selectedTag = $scope.selectedTag + " " + this.tag;
    };

    $scope.clearFilters = function(event) {
        event.preventDefault();
        $scope.selectedTag = "";
    };

    $scope.shareRecco = function(outlet, offer) {
        console.log("OFFER " + JSON.stringify(offer));
        console.log("OUTLET " + JSON.stringify(outlet));
        var url = constSvc.service_url + '/merchant/#/public/share/' + outlet._id + '/' + offer._id;
        $window.plugins.socialsharing.share(offer.basics.title + '@' + outlet.basics.name, offer.basics.description, null, url);
    };

});

twystClient.controller('HomeItemDetailCtrl', function($scope) {
    $scope.item = {};
    $scope.process = function(recommendation) {
        $scope.item.program = recommendation.program;
        $scope.item.tier = recommendation.relevant_tier;
        $scope.item.outlet = recommendation.outlet;
        $scope.item.offer = recommendation.relevant_tier.offers[0];
        $scope.item.weight = recommendation.normalized_weight;
    };
});

twystClient.controller('NearItemDetailCtrl', function($scope) {
    $scope.item = {};
    $scope.process = function(near) {
        var min = 100;
        var offer = null;
        $scope.item.outlet = near.outlet || null;

        //$scope.item.program = near.programs[0] || null;
        for (var i = 0; i < near.programs.length; i++) {
            if (near.programs[i].status = 'active') {
                $scope.item.program = near.programs[i];
                break;
            }
        }

        var count = c = $scope.program_checkins($scope.item.program);
        if (count === 0) {
            count = 1;
        }
        for (var i = 0; i < near.programs[0].tiers.length; i++) {
            if (near.programs[0].tiers[i].basics.start_value <= count &&
                near.programs[0].tiers[i].basics.end_value >= count) {
                $scope.item.tier = near.programs[0].tiers[i];
            }
        }
        $scope.item.tier = $scope.item.tier || null;
        // Picking the offer from the tier
        for (var i = 0, min = 100, offer = null; i < $scope.item.tier.offers.length; i++) {
            if ($scope.item.tier.offers[i].user_eligibility.criteria.condition === 'on every') {
                if (c - c % $scope.item.tier.offers[i].user_eligibility.criteria.value < min) {
                    min = c - c % $scope.item.tier.offers[i].user_eligibility.criteria.value;
                    offer = $scope.item.tier.offers[i];
                }
            } else if ($scope.item.tier.offers[i].user_eligibility.criteria.condition === 'after') {
                if ($scope.item.tier.offers[i].user_eligibility.criteria.value - c < min) {
                    min = $scope.item.tier.offers[i].user_eligibility.criteria.value - c;
                    offer = $scope.item.tier.offers[i];
                }
            } else if ($scope.item.tier.offers[i].user_eligibility.criteria.condition === 'on only') {
                if ($scope.item.tier.offers[i].user_eligibility.criteria.value - c < min) {
                    if ($scope.item.tier.offers[i].user_eligibility.criteria.value - c >= 0) {
                        min = $scope.item.tier.offers[i].user_eligibility.criteria.value - c;
                        offer = $scope.item.tier.offers[i];
                    }
                }
            } else {
                //DO NOTHING
            }
        }
        $scope.item.offer = offer;
    };

    $scope.valid = function(near) {
        if (near &&
            near.outlet &&
            near.programs &&
            near.programs[0] &&
            near.programs[0].tiers &&
            near.programs[0].tiers[0] &&
            near.programs[0].tiers[0].offers &&
            near.programs[0].tiers[0].offers[0]) {
            return true;
        } else {
            return false;
        }
    };
});

twystClient.controller('DetailsCtrl', function($scope, $rootScope, $http, $window, constSvc) {
    $scope.showReward = function(outlet_name) {
        if ($rootScope && 
            $rootScope.item && 
            $rootScope.item.rewards && 
            $rootScope.item.rewards[outlet_name]) {
                $rootScope.item.reward = $rootScope.item.rewards[outlet_name]._id;
                $rootScope.state = 'reward_detail';    
            }        
    };

    $scope.isNewProgram = function(program) {
        var d = new Date(program.created_at);
        var dt = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        var timelag = (Date.now() - dt) / (1000 * 24 * 60 * 60);
        if (timelag < 15) return true;
        return false;
    };

    $scope.isEndingProgram = function(program) {
        var d = new Date(program.validity.earn_end);
        var dt = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        var timelag = (dt - Date.now()) / (1000 * 24 * 60 * 60);
        if (timelag < 7) return true;
        return false;
    };        

    $scope.shareRecco = function(outlet, offer) {
        console.log("OFFER " + JSON.stringify(offer));
        console.log("OUTLET " + JSON.stringify(outlet));
        var url = constSvc.service_url + '/merchant/#/public/share/' + outlet._id + '/' + offer._id;
        $window.plugins.socialsharing.share(offer.basics.title + '@' + outlet.basics.name, offer.basics.description, null, url);
    };

    $scope.init = function() {
        $scope.item = $rootScope.item;
        if (!$scope.programs) {
            $http.get(constSvc.service_url + '/api/v1/programs/view/' + $scope.item.program._id, {
                timeout: 30000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            })
                .success(function(data) {
                    $scope.$$phase || $scope.$apply();
                    $scope.programs = data.info;
                    $scope.programs[0].tiers = _.sortBy($scope.programs[0].tiers, function(item) {
                        return Number(item.basics.start_value);
                    });
                    $scope.got_programs = true;
                })
                .error(function(data) {
                    $scope.got_programs = false;
                    // couldn't get programs
                });
        }
    };

    $scope.expandReward = function (num) {
        $scope.final_rewards.forEach(function (obj) {
            obj.rewards.forEach(function (baz) {
                if(baz.num === num) {
                    baz.show = !baz.show;
                }
                else {
                    baz.show = false;
                }
            });
        })
    }

    $scope.min = 100;
    $scope.getClass =  function(a,b) {

        if (a === b) {
            return '#FEF3E8';
        }

        if (a > b) {
            return '#EBE1D7';            
        }

        if (a < b) {
            if (b <= $scope.min) {
                $scope.min = b;
                return '#F8a05E'
            } else {
                return '#FEF3E8';
           }
        }
    }
    $scope.reward_details_limit = $scope.reward_details_limit || 5;
    $scope.getRewardDetails = function (baz,r) {
        var rewards = [];
        $scope.final_rewards = [];
        var val = -1, limit = 0;

        var program = $scope.programs[0];
        var obj = {};
        $scope.reward_details_limit = r;
        for(var i = 0; i < program.tiers.length; i++) {
            if(program.tiers[i]) {
                obj = {};
                obj.rewards = [];
                obj.tier = program.tiers[i];
                if(limit < r) {
                    obj.show = true;
                }
                else {
                    obj.show = false;
                }
                for(var lim = program.tiers[i].basics.start_value; lim <= program.tiers[i].basics.end_value; lim++) {
                    if(limit >= r) {
                        break;
                    }
                    for(var j = 0; j < program.tiers[i].offers.length; j++) {
                        reward = {};
                        reward.show = false;
                        if(program.tiers[i].offers[j]) {
                            if(program.tiers[i].offers[j].user_eligibility.criteria.condition === 'on every') {
                                if((lim - program.tiers[i].basics.start_value + 1) % program.tiers[i].offers[j].user_eligibility.criteria.value === 0) {
                                    reward.num = lim;
                                    reward.offer = program.tiers[i].offers[j];
                                    obj.rewards.push(reward);
                                    if(baz <= lim) {
                                        ++limit;   
                                    }
                                }
                            }
                            if(program.tiers[i].offers[j].user_eligibility.criteria.condition === 'on only') {
                                
                                if(lim === Number(program.tiers[i].offers[j].user_eligibility.criteria.value)) {
                                    reward.num = lim;
                                    reward.offer = program.tiers[i].offers[j];
                                    obj.rewards.push(reward);
                                    if(baz <= lim) {
                                        ++limit;   
                                    }
                                }
                            }
                            if(program.tiers[i].offers[j].user_eligibility.criteria.condition === 'after') {
                                if(lim >= Number(program.tiers[i].offers[j].user_eligibility.criteria.value)) {
                                    reward.num = lim;
                                    reward.offer = program.tiers[i].offers[j];
                                    obj.rewards.push(reward);
                                    if(baz <= lim) {
                                        ++limit;   
                                    }
                                }
                            }
                        }
                        if(limit >= r) {
                            break;
                        }
                    }
                }
                $scope.final_rewards.push(obj);
            }
            
        }

        $scope.final_rewards.forEach(function (obj) {
            obj.rewards = _.uniq(obj.rewards, function (reward) {
                return reward.num;
            });

            obj.rewards = _.sortBy(obj.rewards, function (reward) {
                return reward.num;
            });
        });
    }

    $scope.getNext = function(c) {
        var i = 0,
            j = 0,
            val = -1;
        var selected_tier = -1;
        var on_every_next = 1000;
        var after_next = 1000;
        var on_only_next = 1000;
        var programs = $scope.programs;
        var temp_c = 0;
        var in_tier_checkins = 0;

        c = Number(c);
        if (c === 0) {
            temp_c = 1;
        } else {
            temp_c = c;
        }
        for (i = 0; i < programs[0].tiers.length; i++) {
            if (temp_c >= programs[0].tiers[i].basics.start_value && temp_c <= programs[0].tiers[i].basics.end_value) {
                selected_tier = i;
                break;
            }
        }

        if (selected_tier === -1) {
            return -1;
        }

        in_tier_checkins = c - (programs[0].tiers[selected_tier].basics.start_value - 1);

        for (j = 0; j < programs[0].tiers[selected_tier].offers.length; j++) {
            if (programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.condition === 'on every') {
                if (in_tier_checkins % programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value) {
                    on_every_next = Number(c) + Number(programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value - in_tier_checkins % programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value);
                } else {
                    on_every_next = Number(c) + Number(programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value);
                }
            }

            if (programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.condition === 'after') {
                if (c <= programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value) {
                    after_next = programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value;
                } else {
                    after_next = c + 1;
                }
            }

            if (programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.condition === 'on only') {
                if (c <= programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value) {
                    if (programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value < on_only_next) {
                        on_only_next = programs[0].tiers[selected_tier].offers[j].user_eligibility.criteria.value;
                    }
                }
            }
        }

        if (on_every_next < on_only_next && on_every_next < after_next) {
            val = on_every_next;
        }
        if (on_only_next < on_every_next && on_only_next < after_next) {
            val = on_only_next;
        }
        if (after_next < on_only_next && after_next < on_every_next) {
            val = after_next;
        }

        return val;
    };

    $scope.getNext2 = function(c) {
        count = Number(c);
        var rewards = [];
        var val = -1,
            min, max;

        var program = ($scope.programs && $scope.programs[0]) || null;
        if (program !== null) {
            for (var i = 0; i < program.tiers.length; i++) {
                for (var lim = program.tiers[i].basics.start_value; lim <= program.tiers[i].basics.end_value; lim++) {
                    for (var j = 0; j < program.tiers[i].offers.length; j++) {
                        if (program.tiers[i].offers[j].user_eligibility.criteria.condition === 'on every') {
                            if ((lim - program.tiers[i].basics.start_value + 1) % program.tiers[i].offers[j].user_eligibility.criteria.value === 0) {
                                rewards.push(lim + 1);
                            }
                        }
                        if (program.tiers[i].offers[j].user_eligibility.criteria.condition === 'on only') {

                            if (lim === Number(program.tiers[i].offers[j].user_eligibility.criteria.value)) {
                                rewards.push(lim + 1);
                            }
                        }
                        if (program.tiers[i].offers[j].user_eligibility.criteria.condition === 'after') {
                            if (lim >= Number(program.tiers[i].offers[j].user_eligibility.criteria.value)) {
                                rewards.push(lim + 1);
                            }
                        }
                    }
                }
            }
            rewards = _.uniq(rewards);
            rewards = _.sortBy(rewards, function(num) {
                return num;
            });
        }

        for (var i = 0; i < rewards.length; i++) {
            if (rewards[0] > count) {
                val = rewards[0] - count;
                min = 0;
                max = rewards[0];
            } else if (rewards[i] === count) {
                val = rewards[i + 1] - rewards[i];
                min = rewards[i];
                max = rewards[i + 1];
            } else if (rewards[i - 1] < count && rewards[i] > count) {
                val = rewards[i] - count;
                min = rewards[i - 1];
                max = rewards[i];
            }
        };
        return [val, min, max];
    };
});


twystClient.controller('RewardDetailCtrl', function($rootScope, $scope, dataSvc, constSvc, $http) {
    $scope.show_voucher = false;
    $scope.data = dataSvc.getdata();
    $scope.status = dataSvc.status;
    $scope.errors = dataSvc.errors;
    $scope.$on('dataUpdated', function() {
console.log("TWYST: data was updated in the rewards controller");
        $scope.data = dataSvc.getdata();
        $scope.status = dataSvc.status;
        $scope.errors = _.uniq(dataSvc.errors);
    });

    $scope.reward = _.find($scope.data.rewards, function(item) {
        console.log("ITEM " + JSON.stringify(item));
        console.log("ROOT SCOPE REWARD" + JSON.stringify($rootScope.item.reward));
        return item._id === $rootScope.item.reward;
    });

    $scope.redeem = function(code, outlet) {
        $scope.show_voucher = true;
        $http.post(constSvc.service_url + '/api/v1/voucher/app/redeem', {
            code: code,
            outlet_id: outlet
        })
            .success(function(data) {
                $rootScope.redeemed = {};
                $rootScope.redeemed.status = data.status;
                $rootScope.redeemed.message = data.message;
                $rootScope.redeemed.reward = JSON.parse(data.info);
                $rootScope.state = 'redeemed';
                console.log("SUCCESS" + JSON.stringify(data));
            }).error(function(data) {
                $rootScope.redeemed = {};
                $rootScope.redeemed.status = data.status;
                $rootScope.redeemed.message = data.message;
                $rootScope.state = 'redeemed';
                console.log("ERROR" + JSON.stringify(data));
            });
    };
});

twystClient.controller('TimelineCtrl', function($scope, $rootScope, $location, dataSvc) {
    $scope.data = dataSvc.getdata();
    $scope.status = dataSvc.status;
    $scope.errors = dataSvc.errors;
    dataSvc.createTimeline();


    $scope.isEndingSoon = function(reward) {
        var d = new Date(reward.issue_details.program.validity.burn_end);
        var dt = Date.UTC(d.getFullYear(), d.getMonth(), d.getDate());
        var timelag = (dt - Date.now()) / (1000 * 24 * 60 * 60);
        console.log("TIMELAG" +  timelag);
        if (reward.basics.status === 'user redeemed' || reward.basics.status === 'merchant redeemed') {
            return false;
        }
        if (timelag < 7 && timelag > 0) {
            return true;
        } else {
            return false;    
        }
    };   


    $scope.$on('dataUpdated', function() {
        console.log("TWYST: data was updated in the timeline controller");
        $scope.data = dataSvc.getdata();
        $scope.status = dataSvc.status;
        $scope.errors = _.uniq(dataSvc.errors);
    });
    $scope.showDetail = function(reward) {
        $rootScope.item.reward = reward;

        $rootScope.state = 'reward_detail';
        //$location.path('/rewards/' + reward);
    };
    /*
     $scope.getOutletLocationList = function(outlets) {
     var i = 0,s = "";
     for (i = 0; i < outlets.length - 1; i++ ) {
     s = outlets[i].contact.location.locality_1[0] + ", ";
     }
     s += outlets[outlets.length - 1].contact.location.locality_1[0];

     return s;
     }*/
    $scope.showItemDetail = function(program, tier, outlet, offer) {
        $rootScope.item = $rootScope.item || {};
        $rootScope.item.program = program;
        $rootScope.item.tier = tier;
        $rootScope.item.outlet = outlet;
        $rootScope.item.offer = offer;

        $rootScope.state = 'detail';
        //$location.path('/details/');
    };
});

twystClient.controller('CheckinDetailCtrl', function($scope, $rootScope, checkinSvc, dataSvc, rewardifyFilter, dateFilter, $timeout) {
    $scope.checkin = {};
    $scope.detail = $scope.detail || {};
    $scope.alert = $scope.alert || {};

    $scope.shareCheckin = function(c) {
        $window.plugins.socialsharing.share("Checked in", "Checked in", null, null);
    }

    var getNext2 = function(c, p) {
        count = Number(c);
        var rewards = [];
        var val = -1,
            min, max;

        //var program = $scope.programs[0];
        var program = p;

        for (var i = 0; i < program.tiers.length; i++) {
            for (var lim = program.tiers[i].basics.start_value; lim <= program.tiers[i].basics.end_value; lim++) {
                for (var j = 0; j < program.tiers[i].offers.length; j++) {
                    if (program.tiers[i].offers[j].user_eligibility.criteria.condition === 'on every') {
                        if ((lim - program.tiers[i].basics.start_value + 1) % program.tiers[i].offers[j].user_eligibility.criteria.value === 0) {
                            rewards.push(lim + 1);
                        }
                    }
                    if (program.tiers[i].offers[j].user_eligibility.criteria.condition === 'on only') {

                        if (lim === Number(program.tiers[i].offers[j].user_eligibility.criteria.value)) {
                            rewards.push(lim + 1);
                        }
                    }
                    if (program.tiers[i].offers[j].user_eligibility.criteria.condition === 'after') {
                        if (lim >= Number(program.tiers[i].offers[j].user_eligibility.criteria.value)) {
                            rewards.push(lim + 1);
                        }
                    }
                }
            }
        }

        rewards = _.uniq(rewards);
        rewards = _.sortBy(rewards, function(num) {
            return num;
        });

        for (var i = 0; i < rewards.length; i++) {
            if (rewards[0] > count) {
                val = rewards[0] - count;
                min = 0;
                max = rewards[0];
            } else if (rewards[i] === count) {
                val = rewards[i + 1] - rewards[i];
                min = rewards[i];
                max = rewards[i + 1];
            } else if (rewards[i - 1] < count && rewards[i] > count) {
                val = rewards[i] - count;
                min = rewards[i - 1];
                max = rewards[i];
            }
        };
        return [val, min, max];
    };

    $scope.checkin.data = checkinSvc.data;
    $scope.$on('checkind', function() {
        $rootScope.cancelrequests = false;
        $scope.checkin.data = checkinSvc.data;
        if ($scope.checkin.data.status === 'success') {
            $scope.checkin.data.info = JSON.parse($scope.checkin.data.info);
        }
    });

    $scope.empty = function(c) {
        return _.isEmpty(c);
    };

    var formatDate = function(date) {
        return (dateFilter(date, 'dd/MM/yyyy'));
    };

    $scope.init = function(e, count) {
        console.log("E " + JSON.stringify(e));
        console.log("Count " + count);
        console.log("Scope.Data " + JSON.stringify($scope.checkin.data));
        if (!_.isEmpty($scope.checkin.data) && $scope.checkin.data.info.outlet) {
            if ($scope.checkin.data.status === 'success') {
                $scope.detail.sub = "You successfully checked in at " + $scope.checkin.data.info.outlet.basics.name + ", " + $scope.checkin.data.info.outlet.contact.location.locality_1[0];
                $scope.detail.color = 'success';
                $scope.detail.button = "twysts";
                if (getNext2(count, $scope.checkin.data.info.program)[0] <= 1) {
                    $scope.detail.facts = $scope.detail.facts || [];
                    //$scope.detail.facts.push("Get " + rewardifyFilter($scope.checkin.data.info.offer));
                    //$scope.detail.facts.push("Terms " + $scope.checkin.data.info.offer.terms);
                    //$scope.detail.facts.push("The voucher expires on " + formatDate($scope.checkin.data.info.program.validity.burn_end) + ". Be sure to use it before then!");
                    $scope.detail.facts.push("You will soon see your reward details and voucher (for use on your next check-in) in the 'My Twysts' section.");
                    $scope.detail.type = "reward";
                    $scope.detail.sub += " and unlocked a Reward!";
                    $scope.detail.header = "Reward unlocked!";
                    $scope.detail.subcolor = "success";
                    $scope.detail.message = "Your Voucher & Check-in will show up in the 'My Twysts' section soon.";
                } else {
                    $scope.detail.type = "checkin";
                    $scope.detail.header = "Check-in success";
                    $scope.detail.sub = "You successfully checked-in at " + $scope.checkin.data.info.outlet.basics.name + ", " + $scope.checkin.data.info.outlet.contact.location.locality_1[0];
                    $scope.detail.subcolor = "success";
                    $scope.detail.facts = $scope.detail.facts || [];
                    $scope.detail.facts.push("You are " + getNext2(count + 1, $scope.checkin.data.info.program)[0] + " checkins away from a reward.");
                    $scope.detail.message = "Your Check-in will show up in the My Twysts' section soon.";
                }
            } else {
                $scope.detail.header = "Error";
                $scope.detail.color = 'warning';
                $scope.detail.type = "error";
                $scope.detail.sub = "Check-in failed";
                $scope.detail.subcolor = "warning";
                $scope.detail.message = $scope.checkin.data.message;
                $scope.detail.button = "retry";
            }
        } else {
            $scope.detail.header = "Error";
            $scope.detail.color = 'warning';
            $scope.detail.type = "error";
            $scope.detail.sub = "Check-in failed";
            $scope.detail.subcolor = "warning";
            $scope.detail.message = $scope.checkin.data.message;
            $scope.detail.button = "retry";
        }
    };
});

twystClient.controller('CheckinCtrl', function($scope, $rootScope, $location, logSvc, checkinSvc) {
    'use strict';
    $scope.smscode = $scope.smscode || '';
    $scope.checkin = $scope.checkin || {};

    /*
     $scope.$on('checkind', function() {
     $rootScope.state = 'checkin_detail';
     });
     */

    $scope.scan = function() {
        $rootScope.cancelrequests = true;
        logSvc.info("Scanned QR code");
        cordova.plugins.barcodeScanner.scan(
            function(result) {
                checkinSvc.qrCheckin(result);
            });
    };

    $scope.sendSMS = function(smscode) {
        logSvc.info("Send SMS to check-in");
        checkinSvc.smsCheckin(smscode);
        //$location.path('/checkin_detail');

        $rootScope.state = 'home';
    };
});

twystClient.controller('SettingsCtrl', function($scope, $rootScope, $location, $http, $window, sessionSvc, constSvc) {
    $scope.messages = $scope.messages || {};
    $scope.messages.version = {};
    $scope.messages.feedback = {};
    $scope.messages.suggest = {};

    $scope.twyst = function() {
        storage = $window.localStorage;
        var data = JSON.parse(storage.getItem('twystData')) || {};
        data.first_run = false;
        storage.setItem('twystData', JSON.stringify(data));
        $rootScope.state = 'first_run';
    };

    $scope.help = function() {
        var window_ref = $window.open(constSvc.service_url + '/r/help', '_blank');
    };

    $scope.rate = function() {
        $window.location.href = 'market://details?id=com.twyst.app.android';
    };

    $scope.suggest = function(fb) {
        $http.post(constSvc.service_url + '/api/v1/sendfeedback', {
            feedbackMessage: fb
        })
            .success(function(data) {
                $scope.$$phase || $scope.$apply();
                $scope.messages.suggest.show = true;
                $scope.messages.suggest.text = "Thank you for your suggestion!";
                $scope.messages.suggest.color = 'success';
            }).error(function(data) {
                $scope.messages.suggest.show = true;
                $scope.messages.suggest.text = "Sorry, we couldnt save your suggestion";
                $scope.messages.suggest.color = 'warning';
            });
    };

    $scope.feedback = function(fb) {
        $http.post(constSvc.service_url + '/api/v1/sendfeedback', {
            feedbackMessage: fb
        })
            .success(function(data) {
                $scope.$$phase || $scope.$apply();
                $scope.messages.feedback.show = true;
                $scope.messages.feedback.text = "Thank you for your feedback!";
                $scope.messages.feedback.color = 'success';
            }).error(function(data) {
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
                $scope.messages.version.show = true;
                $scope.messages.version.text = "Your Twyst app is out of date. Please upgrade to the latest version.";
                $scope.messages.version.link = constSvc.service_url + '/r/latest';
                $scope.messages.version.error = 'danger';
            }
        }, function() {
            $scope.messages.version.show = false;
            $scope.messages.version.text = "We couldn't check for updates at this time. Please try again.";
            $scope.messages.version.color = 'warning';
        });
    };
});
