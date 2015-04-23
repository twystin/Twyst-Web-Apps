var twystApp = angular.module('twystApp', ['ionic', 'twyst.cordova.googleanalytics', 'twyst.store', 'twyst.data', 'twyst.preload', 'AngularGM', 'angularMoment'])
    .constant('urlp', 'http://staging.twyst.in')
    .config(function($httpProvider) {
        $httpProvider.interceptors.push(function($rootScope) {
            return {
                request: function(config) {
                    $rootScope.$broadcast('loading:show');
                    return config;
                },
                response: function(response) {
                    $rootScope.$broadcast('loading:hide');
                    return response;
                }
            };
        });
    })
    .config(function($stateProvider, $urlRouterProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                views: {
                    'root': {
                        templateUrl: 'states/main/main.tpl.html',
                        controller: 'MainCtrl'
                    }
                }
            })
            .state('main.out', {
                url: '/out',
                views: {
                    'main': {
                        templateUrl: 'states/main/out/out.tpl.html'
                    }
                }
            })
            .state('main.out.login', {
                url: '/login',
                views: {
                    'out': {
                        templateUrl: 'states/main/out/login/login.tpl.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('main.out.otp', {
                url: '/otp',
                views: {
                    'out': {
                        templateUrl: 'states/main/out/otp/otp.tpl.html',
                        controller: 'LoginCtrl'
                    }
                }
            })
            .state('main.out.social', {
                url: '/social',
                views: {
                    'out': {
                        templateUrl: 'states/main/out/social/social.tpl.html',
                        controller: 'SocialCtrl'
                    }
                }
            })
            .state('main.in', {
                url: '/in',
                views: {
                    'main': {
                        templateUrl: 'states/main/in/in.tpl.html'
                    }
                }
            })
            .state('main.in.found', {
                url: '/found',
                views: {
                    'in': {
                        templateUrl: 'states/main/in/found/found.tpl.html',
                        controller: 'OnInFoundCtrl'
                    }
                }
            })
            .state('main.in.found.home', {
                url: '/home',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/home/home.tpl.html',
                    }
                }
            })
            .state('main.in.found.map', {
                url: '/map',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/map/map.tpl.html',
                        controller: 'MapCtrl'
                    }
                }
            })
            .state('main.in.found.checkin_success', {
                url: '/checkin_success',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/checkin_success.tpl.html',
                        controller: 'CheckinSuccessCtrl'
                    }
                }
            })
            .state('main.in.found.profile', {
                url: '/profile',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/profile.tpl.html',
                        controller: 'SocialCtrl'
                    }
                }
            })
            .state('main.in.found.outlet_details', {
                url: '/outlet_details/:item',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/details/outlet_details.tpl.html',
                        controller: 'OutletDetailsCtrl',
                        resolve: {
                            item: function($stateParams) {
                                return {
                                    item: $stateParams.item
                                };
                            }
                        }
                    }
                }
            })
            .state('main.in.found.reward_details', {
                url: '/reward_details/:item',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/details/reward_details.tpl.html',
                        controller: 'RewardDetailsCtrl',
                        resolve: {
                            item: function($stateParams) {
                                return {
                                    item: $stateParams.item,
                                    type: $stateParams.type
                                };
                            }
                        }
                    }
                }
            })
            .state('main.in.found.feedback', {
                url: '/feedback/:item',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/details/feedback.tpl.html',
                        controller: 'FeedbackCtrl',
                        resolve: {
                            item: function($stateParams) {
                                return {
                                    item: $stateParams.item
                                };
                            }
                        }
                    }
                }
            })
            .state('main.in.found.photos', {
                url: '/photos/:item',
                views: {
                    'found': {
                        templateUrl: 'states/main/in/found/details/photos.tpl.html',
                        controller: 'PhotosCtrl',
                        resolve: {
                            item: function($stateParams) {
                                return {
                                    item: $stateParams.item
                                };
                            }
                        }
                    }
                }
            });
        $urlRouterProvider.otherwise('/main');
    })
    .run(function($ionicPlatform, $rootScope, $ionicLoading, $state, $window, $interval, dataSvc, storageSvc) {
        $ionicPlatform.ready(function() {
            if (window.StatusBar) {
                StatusBar.styleDefault();
            }

            ionic.Platform.isFullScreen = true;
            // Remove the redeemed voucher codes
            storageSvc.set('redeemed', null);

            $rootScope.$on('loading:show', function() {
                $ionicLoading.show({
                    template: '<i class="icon ion-loading-c"></i>'
                });
            });

            $rootScope.$on('loading:hide', function() {
                $ionicLoading.hide();
            });

        });
    });

// TODO:CR:Better place for this?
twystApp.filter('texticle', function() {
    return function(input) {
        var i = 0,
            ret = '';
        for (i = 0; i < input.length - 1; i++) {
            ret = ret + input[i] + ', ';
        }
        ret = ret + input[i];
        return ret;
    };
});
