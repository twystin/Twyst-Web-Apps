var CLIENT_VERSION = 2,
    API_VERSION = 1;

twystClient.factory('constSvc', function() {
    'use strict';
    var constSvc = {};
    constSvc.service_url = 'http://twyst.in';
    constSvc.debug = false;
    constSvc.send_logs = false;
    return constSvc;
});

twystClient.factory('alertSvc', function() {
    'use strict';
    var alertSvc = {};
    alertSvc.alert_ncr = {};
    alertSvc.alert_ncr.show = alertSvc.alert_ncr.show || null;
    return alertSvc;
});

twystClient.factory('logSvc', function($http, $log, uuid4, sessionSvc, constSvc, $rootScope) {
    'use strict';
    var logSvc = {},
        num = 1,
        session = uuid4.generate(),
        msg = '',
        send_message = {},
        user = function() {
            return sessionSvc.data.user || null;
        },
        position = function() {
            return sessionSvc.data.position || null;
        },
        log = function(level, message) {
            if (user()) {
                if (position()) {
                    msg = level + ":SESSION:" + session + ":PATH:" + num + ":USER:" + user()._id + message + ":POS: (" + position.latitude + "," + position.longitude + ")";
                    send_message.level = level;
                    send_message.session = session;
                    send_message.path = num;
                    send_message.user = user()._id;
                    send_message.pos = position();
                    send_message.message = message;
                } else {
                    msg = level + ":SESSION:" + session + ":PATH:" + num + ":USER:" + user()._id + message + ":POS: (NULL,NULL)";
                    send_message.level = level;
                    send_message.session = session;
                    send_message.path = num;
                    send_message.user = user()._id;
                    send_message.pos = "empty";
                    send_message.message = message;
                }
            } else {
                if (position()) {
                    msg = level + ":SESSION:" + session + ":PATH:" + num + ":USER:[EMPTY]" + message + ":POS: (" + position.latitude + "," + position.longitude + ")";
                    send_message.level = level;
                    send_message.session = session;
                    send_message.path = num;
                    send_message.user = "empty";
                    send_message.pos = position();
                    send_message.message = message;
                } else {
                    msg = level + ":SESSION:" + session + ":PATH:" + num + ":USER:[EMPTY]" + message + ":POS: (NULL,NULL)";
                    send_message.level = level;
                    send_message.session = session;
                    send_message.path = num;
                    send_message.user = "empty";
                    send_message.pos = "empty";
                    send_message.message = message;
                }
            }
            if (constSvc.debug) {
                $log.warn(msg);
            }

            if (constSvc.send_logs) {
                $http.post(constSvc.service_url + '/api/v1/log', send_message)
                    .success(function(data) {
                        ////$rootScope.$$phase || $rootScope.$apply();
                        // saved log
                    })
                    .error(function(data) {
                        // couldnt save log
                    });
            }
            num = num + 1;
        };

    logSvc.info = function(message) {
        log("INFO", message);
    };

    logSvc.warn = function(message) {
        log("WARN", message);
    };

    logSvc.error = function(message) {
        log("ERROR", message);
    };

    return logSvc;

});

twystClient.factory('placesSvc', function(sessionSvc) {
    'use strict';
    var placesSvc = {};
    placesSvc.places = [{
        name: 'Rajouri Garden',
        boundaries: {
            long_left: 77.11640,
            long_right: 77.12904,
            lat_lower: 28.64163,
            lat_upper: 28.65473
        }
    }, {
        name: 'Connaught Place',
        boundaries: {
            long_left: 77.20609,
            long_right: 77.22875,
            lat_lower: 28.62178,
            lat_upper: 28.64118
        }
    }, {
        name: 'Khan Market & Surroundings',
        boundaries: {
            long_left: 77.21106,
            long_right: 77.24015,
            lat_lower: 28.58871,
            lat_upper: 28.61041
        }
    }, {
        name: 'Saket',
        boundaries: {
            long_left: 77.21246,
            long_right: 77.22443,
            lat_lower: 28.52509,
            lat_upper: 28.53447
        }
    }, {
        name: 'Hauz Khas Village',
        boundaries: {
            long_left: 77.18827,
            long_right: 77.20117,
            lat_lower: 28.55166,
            lat_upper: 28.55867
        }
    }, {
        name: 'Greater Kailash, Lajpat Nagar, Nehru Place',
        boundaries: {
            long_left: 77.22597,
            long_right: 77.25918,
            lat_lower: 28.54243,
            lat_upper: 28.57040
        }
    }, {
        name: 'DLF Cyber City & Cyber Hub',
        boundaries: {
            long_left: 77.086333,
            long_right: 77.092963,
            lat_lower: 28.487915,
            lat_upper: 28.498646
        }
    }, {
        name: 'Ambience Mall',
        boundaries: {
            long_left: 77.095817,
            long_right: 77.100195,
            lat_lower: 28.500701,
            lat_upper: 28.506019
        }
    }, {
        name: 'MG Road and around',
        boundaries: {
            long_left: 77.070529,
            long_right: 77.106278,
            lat_lower: 28.477528,
            lat_upper: 28.481790
        }
    }, {
        name: 'Sector 29',
        boundaries: {
            long_left: 77.056603,
            long_right: 77.074049,
            lat_lower: 28.456703,
            lat_upper: 28.479045
        }
    }, {
        name: 'DLF Phase 4',
        boundaries: {
            long_left: 77.075336,
            long_right: 77.091601,
            lat_lower: 28.457269,
            lat_upper: 28.470247
        }
    }, {
        name: 'Golf Course Road',
        boundaries: {
            long_left: 77.082868,
            long_right: 77.120204,
            lat_lower: 28.421692,
            lat_upper: 28.462974
        }
    }, {
        name: 'Sector 15,30,31',
        boundaries: {
            long_left: 77.039716,
            long_right: 77.061088,
            lat_lower: 28.452062,
            lat_upper: 28.463456
        }
    }, {
        name: 'Sohna Road',
        boundaries: {
            long_left: 77.026219,
            long_right: 77.054372,
            lat_lower: 28.398893,
            lat_upper: 28.449316
        }
    }];

    placesSvc.getPlace = function() {
        return _.find(placesSvc.places, function(item) {
            if (sessionSvc.data.position.latitude < item.boundaries.lat_upper &&
                sessionSvc.data.position.latitude > item.boundaries.lat_lower &&
                sessionSvc.data.position.longitude > item.boundaries.long_left &&
                sessionSvc.data.position.longitude < item.boundaries.long_right) {
                return true;
            }
        });
    };

    return placesSvc;
});

twystClient.factory('checkinSvc', function(constSvc, sessionSvc, dataSvc, $rootScope, $http) {
    'use strict';
    var checkinSvc = {};
    checkinSvc.data = {};

    checkinSvc.qrCheckin = function(result) {
        checkinSvc.data = {};
        $rootScope.state = 'checkin_detail';
        $http.post(constSvc.service_url + '/api/v1/qr/checkins', {
            code: result.text
        })
            .success(function(data) {
                checkinSvc.data = data;
                console.log("CHECKIN SVC DATA" + JSON.stringify(data));
                if (data.status === 'error') {
                    $rootScope.$broadcast('checkind');
                } else {
                    dataSvc.temp.checkins.push(JSON.parse(data.info));
                }
                $rootScope.$broadcast('checkind');
                ////$rootScope.$$phase || $rootScope.$apply();
            }).error(function(data) {
                checkinSvc.data = data;
                $rootScope.$broadcast('checkind');
            });
    };

    return checkinSvc;
});

twystClient.factory('dataSvc', function($rootScope, $window, $http, $log, $timeout, $interval, uuid4, sessionSvc, constSvc) {
    'use strict';
    var dataSvc = {},
        storage = $window.localStorage;

    dataSvc.status = {};
    dataSvc.status.nearby = false;
    dataSvc.status.checkins = false;
    dataSvc.status.rewards = false;
    dataSvc.status.reccos = false;
    dataSvc.status.reccos2 = false;
    dataSvc.status.refreshing = false;

    dataSvc.data = {};
    dataSvc.data.position = {};
    dataSvc.data.nearby = {};
    dataSvc.data.checkins = {};
    dataSvc.data.rewards = {};
    dataSvc.data.reccos = {};
    dataSvc.data.reccos2 = {};
    dataSvc.data.mystuff = null;

    dataSvc.errors = [];
    dataSvc.temp = {};
    dataSvc.temp.faves = [];
    dataSvc.temp.checkins = [];

    dataSvc.getdata = function() {
        return JSON.parse(storage.getItem('twystData')) || {};
    };

    //dataSvc.data = dataSvc.getdata();

    dataSvc.saveFaveTemp = function(off, o) {
        dataSvc.temp.faves.push({
            _id: uuid4.generate(),
            offers: off,
            outlets: o,
            created_date: Date.now()
        });
        dataSvc.createTimeline();
    };

    dataSvc.deleteFaveTemp = function(fave_id) {
        //if (!dataSvc.data.faves) {
        // do nothing
        //} else {
        dataSvc.data.faves = _.filter(dataSvc.data.faves, function(item) {
            return (item._id !== fave_id);
        });
        dataSvc.temp.faves = _.filter(dataSvc.temp.faves, function(item) {
            return (item._id !== fave_id);
        });
        dataSvc.createTimeline();
        //}
    };

    dataSvc.createTimeline = function() {
        ///console.log("GOT TO CREATE TIMELINE");
        var timeline = [];
        var i = 0;

        if (dataSvc.data.rewards && !_.isEmpty(dataSvc.data.rewards)) {
            for (i = 0; i < dataSvc.data.rewards.length; i = i + 1) {
                var entry = {};
                var entry_redemption = {};
                entry.type = "reward";
                console.log("REWARD " + JSON.stringify(dataSvc.data.rewards[i]));
                entry.details = dataSvc.data.rewards[i];
                entry.date = dataSvc.data.rewards[i].issue_details.issue_date;
                timeline.push(entry);

                // NEW CODE TO ADD REDEMPTION TO TIMELINE
                if (dataSvc.data.rewards[i].basics.status === 'user redeemed' || dataSvc.data.rewards[i].basics.status === 'merchant redeemed') {
                    entry_redemption.type = "redemption";
                    entry_redemption.details = dataSvc.data.rewards[i];
                    entry_redemption.date = dataSvc.data.rewards[i].used_details.used_time;
                    timeline.push(entry_redemption);
                }
            }
        }
        //console.log("CHECKINS" + JSON.stringify(dataSvc.data.checkins));
        if (dataSvc.data.checkins && !_.isEmpty(dataSvc.data.checkins)) {
            for (i = 0; i < dataSvc.data.checkins.length; i = i + 1) {
                var entry = {};
                entry.type = "checkin";
                entry.details = dataSvc.data.checkins[i];
                entry.date = dataSvc.data.checkins[i].checkin_date;
                timeline.push(entry);
            }
        }

        /*

         if (dataSvc.temp.checkins && !_.isEmpty(dataSvc.temp.checkins)) {
         for (i = 0; i < dataSvc.temp.checkins.length; i = i + 1) {
         var entry = {};
         entry.type = "checkin";
         entry.details = dataSvc.temp.checkins[i];
         entry.date = dataSvc.temp.checkins[i].checkin_date;
         timeline.push(entry);
         }
         }
         */

        if (dataSvc.data.faves && !_.isEmpty(dataSvc.data.faves)) {

            for (i = 0; i < dataSvc.data.faves.length; i = i + 1) {
                var entry = {};
                entry.type = "favourite";
                entry.details = dataSvc.data.faves[i];
                entry.date = dataSvc.data.faves[i].created_date;
                timeline.push(entry);
            }
        }

        if (dataSvc.temp.faves && !_.isEmpty(dataSvc.temp.faves)) {

            for (i = 0; i < dataSvc.temp.faves.length; i = i + 1) {
                var entry = {};
                entry.type = "favourite";
                entry.details = dataSvc.temp.faves[i];
                entry.date = dataSvc.temp.faves[i].created_date;
                timeline.push(entry);
            }
        }
        //console.log("TIMELINE" + JSON.stringify(timeline));

        dataSvc.data.timeline = _.sortBy(timeline, function(item) {
            return item.date;
        }).reverse();
        storage.setItem('twystData', JSON.stringify(dataSvc.data));
        $rootScope.$broadcast('dataUpdated');
    };


    dataSvc.run = function() {
        console.log("TWYST:Running an update!!!");
        dataSvc.refresh();
        //$interval(function() {
        //    console.log("TWYST: Calling data refresh")
        //    dataSvc.refresh()
        //}, 90000);
       
    };

    dataSvc.refresh = function() {
        dataSvc.data = dataSvc.getdata();
        dataSvc.status.refreshing = true;
        $rootScope.$broadcast('dataUpdated');
        console.log("ZZZ NETWORK STATUS " + sessionSvc.status.network);
        var latitude, longitude;
        if(sessionSvc.data.position && sessionSvc.data.position.latitude) {
            latitude = sessionSvc.data.position.latitude;
        }
        else {
            latitude = 28.4669448;
            sessionSvc.data = sessionSvc.data || {};
            sessionSvc.data.position = sessionSvc.data.position || {};
            sessionSvc.data.position.latitude = sessionSvc.data.position.latitude || latitude;
        }
        if(sessionSvc.data.position && sessionSvc.data.position.longitude) {            
            longitude = sessionSvc.data.position.longitude;
        }   
        else {
            longitude = 77.06652;
            sessionSvc.data = sessionSvc.data || {};
            sessionSvc.data.position = sessionSvc.data.position || {};
            sessionSvc.data.position.longitude = sessionSvc.data.position.longitude || longitude;            
        }
        if (sessionSvc.status.network) {
            $http.get(constSvc.service_url + '/api/v2/data/' + latitude + '/' + longitude, {
                timeout: 30000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            })
                .success(function(data) {
                    console.log("DATA IS " + JSON.stringify(data));
                    if (data && data.info) {
                        if (data.info.NEAR && data.info.NEAR.info) {
                            dataSvc.data.nearby = data.info.NEAR.info;    
                        } else {
                            dataSvc.data.nearby = [];
                        }

                        if (data.info.CHECKINS && data.info.CHECKINS.info) {
                            dataSvc.data.checkins = data.info.CHECKINS.info;    
                        } else {
                            dataSvc.data.checkins = [];
                        }

                        if (data.info.VOUCHERS && data.info.VOUCHERS.info) {
                            dataSvc.data.rewards = data.info.VOUCHERS.info;    
                        } else {
                            dataSvc.data.rewards = [];
                        }         

                        if (data.info.RECCO && data.info.RECCO.info) {
                            dataSvc.data.reccos2 = data.info.RECCO.info;    
                        } else {
                            dataSvc.data.reccos2 = [];
                        }           

                        if (data.info.FAVOURITES && data.info.FAVOURITES.info) {
                            dataSvc.data.faves = data.info.FAVOURITES.info;    
                        } else {
                            dataSvc.data.faves = [];
                        }                                                    

                    } else {
                        dataSvc.data.nearby = [];
                        dataSvc.data.checkins = [];
                        dataSvc.data.rewards = [];
                        dataSvc.data.reccos2 = [];
                        dataSvc.data.faves = [];                        
                    }

                    dataSvc.status.nearby = true;
                    dataSvc.status.checkins = true;
                    dataSvc.status.rewards = true;
                    dataSvc.status.reccos2 = true;
                    dataSvc.status.faves = true;
                    storage.setItem('twystData', JSON.stringify(dataSvc.data));
                    $rootScope.$broadcast('dataUpdated');

                }).error(function(error) {
                    console.log("GETTING ERROR ON TWYST DATA")
                    console.log(error);
                });
        }
    };

    dataSvc.status.refreshing = false;
    return dataSvc;
});

twystClient.factory('sessionSvc', function($window, $rootScope, $http, $q, $log, $timeout, $interval, constSvc) {
    var sessionSvc = {},
        networkState = null,
        stop = null;

    // New code for OTP
    var storage = $window.localStorage;
    sessionSvc.localData = JSON.parse(storage.getItem('twystData')) || {};
    if (sessionSvc.localData) {
        console.log(sessionSvc.localData);
        if (sessionSvc.localData.auth) {
            sessionSvc.auth = sessionSvc.localData.auth;
        } else {
            sessionSvc.auth = {
                state: 0
            };
        }
    } else {
        sessionSvc.auth = {
            state: 0
        };
    }

    sessionSvc.data = {};
    sessionSvc.status = {};
    sessionSvc.data.version = null;
    sessionSvc.status.server_up = false;
    sessionSvc.status.network = true;
    sessionSvc.status.user = false;
    sessionSvc.status.version = true;
    sessionSvc.errors = [];

    sessionSvc.getLoggedInUser = function() {
        var deferred = $q.defer();
        $http.get(constSvc.service_url + '/api/v1/auth/get_logged_in_user')
            .success(function(data) {
                //$rootScope.$$phase || $rootScope.$apply();
                sessionSvc.data.user = data;
                sessionSvc.status.user = true;
                $rootScope.$broadcast('sessionUpdated');
                deferred.resolve(data);
            }).error(function(data) {
                // log-in the user if OTP creds are there locally

                sessionSvc.data.user = null;
                sessionSvc.status.user = false;
                $rootScope.$broadcast('sessionUpdated');
                deferred.reject(data);
            });
        return deferred.promise;
    };

    sessionSvc.getVersion = function() {
        var deferred = $q.defer();
        $http.get(constSvc.service_url + '/api/v1/clientversion')
            .success(function(data) {
                //$rootScope.$$phase || $rootScope.$apply();
                var v = JSON.parse(data.info);
                sessionSvc.status.server_up = true;
                if (Number(CLIENT_VERSION) < Number(v.client) ||
                    Number(API_VERSION) < Number(v.api)) {
                    console.log("BAD CLIENT");
                    sessionSvc.status.version = false;
                } else {
                    console.log("GOOD CLIENT");
                    sessionSvc.status.version = true;
                }
                sessionSvc.data.version = JSON.parse(data.info);
                $rootScope.$broadcast('sessionUpdated');
                deferred.resolve(data);
            }).error(function(data) {
                sessionSvc.status.server_up = true;
                sessionSvc.data.version = null;
                sessionSvc.status.version = false;
                $rootScope.$broadcast('sessionUpdated');
                deferred.reject(data);
            });
        return deferred.promise;
    };

    sessionSvc.setHomeLocation = function() {
        if (sessionSvc.status && sessionSvc.status.position && sessionSvc.status.user) {
            $http.post(constSvc.service_url + '/api/v1/user/home', sessionSvc.data.position)
                .success(function() {
                    //$rootScope.$$phase || $rootScope.$apply();
                }).error(function() {

                });
        }

    };

    sessionSvc.getNetwork = function(callback) {
        callback(true);
        $rootScope.$broadcast('sessionUpdated');
        sessionSvc.getData(); //get session info when network comes up

    };

    sessionSvc.getPosition = function() {
        var deferred = $q.defer();
        $window.navigator.geolocation.getCurrentPosition(function(position) {
            sessionSvc.status.position = true;
            sessionSvc.data.position = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            };
            $rootScope.$broadcast('sessionUpdated');
            deferred.resolve(position);
        }, function(error) {
            $log.warn("COULDN'T GET POSITION" + JSON.stringify(error));
            sessionSvc.status.position = false;
            sessionSvc.data.position = {};
            deferred.reject(error);
        }, {
            enableHighAccuracy: false,
            maximumAge: 1200000,
            timeout: 1260000,
            frequency: 5000
        });

        return deferred.promise;
    };

    sessionSvc.getData = function() {
        console.log("TWYST: Getting session data!");
        $http.get(constSvc.service_url + '/api/v2/constants')
            .success(function(data) {
                if (data.info.USER) {
                    sessionSvc.data.user = data.info.USER;
                    sessionSvc.status.user = true;
                    sessionSvc.auth.state = 3;
                } else {
                    if (sessionSvc.auth && sessionSvc.auth.phone) {
                        $http.post(constSvc.service_url + '/api/v1/auth/login', {
                            username: sessionSvc.auth.phone,
                            password: sessionSvc.auth.phone
                        })
                            .success(function(data) {
                                sessionSvc.localData.auth = sessionSvc.auth = {
                                    state: 3,
                                    data: data,
                                    phone: sessionSvc.auth.phone
                                };
                                storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                                $rootScope.state = 'home';
                                sessionSvc.getLoggedInUser();
                            }).error(function(err, data) {
                                sessionSvc.status.user = false;
                                sessionSvc.localData.auth = sessionSvc.auth = {
                                    state: 0,
                                    phone: sessionSvc.auth.phone
                                };
                                storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                                $rootScope.$broadcast('sessionUpdated');
                            });
                    } else {
                        sessionSvc.status.user = false;
                        sessionSvc.localData.auth = sessionSvc.auth = {
                            state: 0,
                            phone: sessionSvc.auth.phone
                        };
                        storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                    }
                }

                if (data.info.SMS_PROVIDER) {
                    sessionSvc.status.smsprovider = true;
                    sessionSvc.data.smsprovider = data.info.SMS_PROVIDER;
                }

                if (data.info.VERSION) {
                    var v = data.info.VERSION;
                    if (Number(CLIENT_VERSION) < Number(v.client) ||
                        Number(API_VERSION) < Number(v.api)) {
                        console.log("BAD CLIENT");
                        sessionSvc.status.version = false;
                    } else {
                        console.log("GOOD CLIENT");
                        sessionSvc.status.version = true;
                    }
                } else {
                    sessionSvc.data.version = null;
                    sessionSvc.status.version = false;
                }
                sessionSvc.status.server_up = true;

                $rootScope.$broadcast('sessionUpdated');
                console.log(data);
            }).error(function(error) {
                console.log(error);
            });
    };

    sessionSvc.run = function() {
        console.log("TWYST:Calling session svc run");
        $timeout(function() {
            sessionSvc.getPosition();
        }, 5000);

        sessionSvc.getNetwork(function (networkState) {
            if(networkState) {
                sessionSvc.getData();
                sessionSvc.setHomeLocation();
            }
        });

        $interval(function() {
            sessionSvc.getPosition();
        }, 300000);
        $interval(function() {
            sessionSvc.getNetwork(function (networkState) {
                // Nothing to do here
            });
        }, 5000);
    };

    var window_ref = null;

    sessionSvc.otplogin = function(phone) {
        $http.post(constSvc.service_url + '/api/v1/auth/login', {
            username: phone,
            password: phone
        })
            .success(function(data) {
                console.log("CAME HERE TO SUCCEED IN LOGGING IN");
                sessionSvc.localData.auth = sessionSvc.auth = {
                    state: 3,
                    data: data,
                    phone: sessionSvc.auth.phone
                };
                storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                $rootScope.state = 'home';
                sessionSvc.getLoggedInUser();
            }).error(function(err, data) {
                console.log("CAME HERE TO CALL OTP");
                $http.get(constSvc.service_url + '/api/v2/otp/' + phone, {
                    timeout: 30000,
                    cache: false,
                    headers: {
                        'Accept': 'application/json',
                        'Pragma': 'no-cache'
                    }
                })
                    .success(function(data) {
                        sessionSvc.localData.auth = sessionSvc.auth = {
                            state: 1,
                            data: data,
                            phone: phone
                        };
                        storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                        $rootScope.$broadcast('authRelatedEvent');
                    }).error(function(err) {
                        sessionSvc.localData.auth = sessionSvc.auth = {
                            state: -1,
                            prev: 0,
                            data: err
                        };
                        storage.setItem('twystData', JSON.stringify(sessionSvc.localData));

                        $rootScope.$broadcast('authRelatedEvent');
                    });
            });
    };

    // TODO Handle error cases
    sessionSvc.otpverify = function(otp, phone) {
        $http.post(constSvc.service_url + '/api/v2/otp', {
            otp: otp,
            phone: phone,
            device_id: phone
        })
            .success(function(err, data) {
                $http.post(constSvc.service_url + '/api/v1/auth/login', {
                    username: phone,
                    password: phone
                })
                    .success(function(data) {
                        sessionSvc.getLoggedInUser();
                        sessionSvc.localData.auth = sessionSvc.auth = {
                            state: 3,
                            data: data,
                            phone: phone
                        };
                        storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                        $rootScope.$broadcast('authRelatedEvent');
                        //$rootScope.state = 'home';
                    }).error(function(err) {
                        sessionSvc.status.user = false;
                        sessionSvc.localData.auth = sessionSvc.auth = {
                            state: -1,
                            prev: 1,
                            data: err
                        };
                        storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                        $rootScope.$broadcast('authRelatedEvent');
                    });
            }).error(function(err) {
                sessionSvc.localData.auth = sessionSvc.auth = {
                    state: -1,
                    prev: 1,
                    data: err
                };
                storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                $rootScope.$broadcast('authRelatedEvent');
            });
    }

    sessionSvc.facebook = function() {
        var plugin = new CC.CordovaFacebook();
        plugin.init('763534923659747', 'Twyst', ['basic_info', 'email', 'publish_actions'],
            function(response) {
                plugin.login(function(response) {
                    plugin.info(function(data) {
                        $http.post(constSvc.service_url + '/api/v2/social', {
                            access: {
                                token: response.accessToken,
                                expires: response.expirationDate,
                                permissions: response.permissions
                            },
                            info: data
                        }).success(function(data) {
                            sessionSvc.localData.auth = sessionSvc.auth = {
                                state: 3,
                                data: {
                                    access: {
                                        token: response.accessToken,
                                        expires: response.expirationDate,
                                        permissions: response.permissions
                                    },
                                    info: data
                                }
                            };
                            storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                            $rootScope.$broadcast('authRelatedEvent');
                            $rootScope.state = 'home';
                        }).error(function(err) {
                            sessionSvc.localData.auth = sessionSvc.auth = {
                                state: -1,
                                prev: 2,
                                data: err
                            };
                            storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                            $rootScope.$broadcast('authRelatedEvent');
                        });
                    });
                }, function(err) {
                    sessionSvc.localData.auth = sessionSvc.auth = {
                        state: -1,
                        prev: 2,
                        data: err
                    };
                    storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                    $rootScope.$broadcast('authRelatedEvent');
                });
            }, function(err) {
                sessionSvc.localData.auth = sessionSvc.auth = {
                    state: -1,
                    prev: 2,
                    data: err
                };
                storage.setItem('twystData', JSON.stringify(sessionSvc.localData));
                $rootScope.$broadcast('authRelatedEvent');
            });
    };

    sessionSvc.fblogin = function() {
        window_ref = $window.open(constSvc.service_url + '/api/v1/auth/facebook', '_blank');
        window_ref.addEventListener('loadstop', iabLoadStop);
        window_ref.addEventListener('exit', iabClose);
    };

    sessionSvc.logout = function() {
        $http.get(constSvc.service_url + '/api/v1/auth/logout')
            .success(function() {
                sessionSvc.status.user = false;
                sessionSvc.data.user = null;
            }).error(function() {
                //TODO: Is this code OK?
                sessionSvc.status.user = false;
                sessionSvc.data.user = null;
            });
    };

    var iabLoadStop = function(event) {
        if (event.url.search(/code=/) !== -1) {
            $log.warn("GETTING LOGGED IN USER");
            $http.get(constSvc.service_url + '/api/v1/auth/get_logged_in_user')
                .success(function(data) {
                    //$rootScope.$$phase || $rootScope.$apply();
                    sessionSvc.data.user = data;
                    login();
                    window_ref.close();
                }).error(function(data) {
                    window_ref.close();
                });
        }
    };

    var iabClose = function(event) {
        window_ref.removeEventListener('loadstop', iabLoadStop);
        window_ref.removeEventListener('exit', iabClose);
    };

    var login = function() {
        if (sessionSvc.data.user) {
            $http.get(constSvc.service_url + '/api/v1/auth/facebook/callback')
                .success(function(data, status, headers, config) {
                    //$rootScope.$$phase || $rootScope.$apply();
                    sessionSvc.status.user = true;
                    $rootScope.$broadcast('sessionUpdated');
                }).error(function(data, status, headers, config) {
                    sessionSvc.status.user = false;
                });
        }
    };
    return sessionSvc;
});