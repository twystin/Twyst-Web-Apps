angular.module('twyst.data', ['twyst.store']).
factory('dataSvc', function($http, $q, $rootScope, $window, $ionicLoading, $timeout, urlp, storageSvc, logSvc) {
    var dataSvc = {};

    var getNetworkStatus = function() {
        return true;
    };

    var fetchLocation = function() {
        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i>'
        });
        var deferred = $q.defer();

        $timeout(function() {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position) {
                    $ionicLoading.hide();
                    $rootScope.$broadcast("got_location");
                    dataSvc.position = position;
                    deferred.resolve(position);
                }, function(error) {
                    logSvc.event('Location', 'Location error', 'Location error', '1');

                    $ionicLoading.hide();
                    $rootScope.$broadcast("no_location");
                    deferred.reject(null);
                }, {
                    enableHighAccuracy: false,
                    // maximumAge: 1200000,
                    timeout: 10 * 1000,
                    // frequency: 5000
                });
            } else {
                logSvc.event('Location', 'Location error', 'Location error', '1');
                $ionicLoading.hide();
                $rootScope.$broadcast("no_location");
                deferred.reject(null);
            }
        }, 500);


        return deferred.promise;
    };

    dataSvc.showNetworkError = function() {
        logSvc.event('Network', 'Network error', 'Network error', '1');

        if (!$rootScope.network_error_shown) {
            $window.alert("Please enable data or connect to wi-fi to get the full Twyst experience.");
            $rootScope.network_error_shown = true;
            $timeout(function() {
                $rootScope.network_error_shown = false;
            }, 1000 * 10);
        }
    };

    dataSvc.set_checkin_data = function(data) {
        dataSvc.checkin_data = data;
    }

    dataSvc.registerGCM = function(id) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.post(urlp + '/api/v3/user/gcm', {
                    'id' : id
                })
                .success(function(data) {
                    deferred.resolve(data);
                }).error(function(error) {
                    deferred.reject(error);
                });
        } else {
            deferred.reject("network_error");
        }
        return deferred.promise;
    };

    dataSvc.checkin = function(code) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.post(urlp + '/api/v3/checkin/qr', {
                    code: code
                })
                .success(function(data) {
                    deferred.resolve(data);
                }).error(function(error) {
                    deferred.reject(error);
                });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.searchReccos = function(query) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.get(urlp + '/api/v3/recco?q=' + query, {
                timeout: 60000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            }).success(function(data) {
                dataSvc.reccos = data;
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.getReccos = function(end) {
        var deferred = $q.defer();
        var request = function(req) {
            // console.log("RECCOS REQ" + req);
            $http.get(req, {
                timeout: 60000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            }).success(function(data) {
                dataSvc.reccos = data;
                storageSvc.set('reccos', data.info.reccos);
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
        };

        if (getNetworkStatus()) {
            fetchLocation().then(function(position) {
                request(urlp + '/api/v3/recco?start=1' + '&end=' + end + '&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude);
            }, function(error) {
                request(urlp + '/api/v3/recco?start=1' + '&end=' + end);
            });
        } else {
            deferred.reject("network_error");
        }
        return deferred.promise;
    };

    dataSvc.getRewards = function(end) {
        var deferred = $q.defer();

        var request = function(req) {
            // console.log("REWARDS REQ" + req);
            $http.get(req, {
                timeout: 60000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            }).success(function(data) {
                dataSvc.rewards = data;
                storageSvc.set('rewards', data.info.vouchers);
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
        };

        if (getNetworkStatus()) {
            fetchLocation().then(function(position) {
                request(urlp + '/api/v3/rewards?start=1' + '&end=' + end + '&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude);
            }, function(error) {
                request(urlp + '/api/v3/rewards?start=1' + '&end=' + end);
            });

        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.getNearby = function(dist) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            fetchLocation().then(function(position) {
                $http.get(urlp + '/api/v3/near?lat=' + position.coords.latitude + '&lon=' + position.coords.longitude + '&distance=' + dist, {
                    timeout: 60000,
                    cache: false,
                    headers: {
                        'Accept': 'application/json',
                        'Pragma': 'no-cache'
                    }
                }).success(function(data) {
                    dataSvc.nearby = data;
                    storageSvc.set('nearby', data.info.near);
                    deferred.resolve(data);
                }).error(function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.getDetail = function(outlet_id) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            fetchLocation().then(function(position) {

                $http.get(urlp + '/api/v3/outlet_detail?outlet_id=' + outlet_id + '&lat=' + position.coords.latitude + '&lon=' + position.coords.longitude, {
                    timeout: 60000,
                    cache: false,
                    headers: {
                        'Accept': 'application/json',
                        'Pragma': 'no-cache'
                    }
                }).success(function(data) {
                    dataSvc[outlet_id] = data;
                    storageSvc.set(outlet_id, data.info);

                    deferred.resolve(data);
                }).error(function(error) {
                    deferred.reject(error);
                });
            }, function(error) {
                $http.get(urlp + '/api/v3/outlet_detail?outlet_id=' + outlet_id, {
                    timeout: 60000,
                    cache: false,
                    headers: {
                        'Accept': 'application/json',
                        'Pragma': 'no-cache'
                    }
                }).success(function(data) {
                    dataSvc[outlet_id] = data;
                    storageSvc.set(outlet_id, data.info);

                    deferred.resolve(data);
                }).error(function(error) {
                    deferred.reject(error);
                });
            });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.getTimeline = function(end) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.get(urlp + '/api/v3/timeline?start=1' + '&end=' + end, {
                timeout: 60000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            }).success(function(data) {
                dataSvc.activity = data;
                storageSvc.set('activity', data);
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.suggest = function(fb) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            var query = urlp + "/api/v3/sendfeedback";
            $http.post(query, {
                feedbackMessage: fb,
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");
        }
        return deferred.promise;
    };

    dataSvc.getUserName = function() {
        var deferred = $q.defer();
        dataSvc.userLoggedIn().then(function(data) {
            if (data.user &&
                data.user.social_graph) {
                if (data.user.social_graph.facebook) {
                    deferred.resolve(data.user.social_graph.facebook.first_name);
                } else if (data.user.social_graph.email) {
                    deferred.resolve(data.user.social_graph.email.email);
                } else {
                    deferred.resolve(null);
                }
            } else {
                deferred.resolve(null);
            }
        }, function(err) {
            deferred.reject(err);
        });
        return deferred.promise;
    }

    dataSvc.userLoggedIn = function() {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.get(urlp + '/api/v1/auth/get_logged_in_user', {
                timeout: 30000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            }).success(function(data) {
                deferred.resolve(data);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");
        }
        return deferred.promise;
    };

    dataSvc.redeem = function(code, used_at) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            var query = urlp + "/api/v3/redeem/app";
            $http.post(query, {
                code: code + "",
                used_at: used_at + ""
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    }


    dataSvc.login = function(phone) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            var query = urlp + "/api/v1/auth/login";
            $http.post(query, {
                username: phone + "",
                password: phone + ""
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.getOTP = function(phone) {
        // console.log(phone);
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.get(urlp + '/api/v2/otp/' + phone, {
                timeout: 30000,
                cache: false,
                headers: {
                    'Accept': 'application/json',
                    'Pragma': 'no-cache'
                }
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");

        }

        return deferred.promise;
    };

    dataSvc.verify = function(otp, phone) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.post(urlp + '/api/v2/otp', {
                otp: otp + "",
                phone: phone + "",
                device_id: phone + ""
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");

        }
        return deferred.promise;
    };

    dataSvc.follow = function(item) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.post(urlp + '/api/v3/follow', {
                outlet: item
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");
        }
        return deferred.promise;
    };

    dataSvc.unfollow = function(item) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.post(urlp + '/api/v3/unfollow', {
                outlet: item
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");
        }
        return deferred.promise;
    };

    dataSvc.feedback = function(feedback) {
        var deferred = $q.defer();
        if (getNetworkStatus()) {
            $http.post(urlp + '/api/v3/feedback', {
                outlet: feedback.outlet,
                comment: feedback.comment,
                type: feedback.type,
                photo: feedback.photo,
                photo_type: feedback.photo_type
            }).success(function(success) {
                deferred.resolve(success);
            }).error(function(error) {
                deferred.reject(error);
            });
        } else {
            deferred.reject("network_error");
        }
        return deferred.promise;
    };

    return dataSvc;
});
