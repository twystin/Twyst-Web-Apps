twystApp.directive('backImg', function() {
    return function(scope, element, attrs) {
        var url = attrs.backImg;
        element.css({
            'background-image': 'url(' + url + ')',
            'background-size': 'cover'
        });
    };
});

twystApp.controller('DiscoverCtrl', function($rootScope, $ionicPopup, urlp, $ionicLoading, $ionicTabsDelegate, $scope, $window, $state, $timeout, dataSvc, storageSvc, preloadSvc, logSvc) {
    logSvc.page("Discover");
    $scope.sortClass = function(a, b) {
        if (a === b) {
            return 'energized'
        } else {
            return 'text-gray'
        }
    }

    var dNow = new Date();
    $scope.checkDate = function(item) {
        var d = null;
        if (item.program_summary && item.program_summary.validity.earn_end) {
            d = new Date(item.program_summary.validity.earn_end);
            if (d > dNow) {
                return true;
            } else {
                return false;
            }
        }
        return false;
    }

    $scope.iconSrc = function(item) {
        if (item && item.outlet_summary && item.outlet_summary.basics) {
            if (item.outlet_summary.basics.icon) {
                return "assets/transparent/" + item.outlet_summary.basics.icon + ".png";
            } else if (item.outlet_summary.basics.is_a) {
                return "assets/transparent/" + item.outlet_summary.basics.is_a + ".png";
            } else {
                return "assets/transparent/restaurant.png";
            }
        } else {
            return "assets/transparent/restaurant.png";
        }
    };

    var fillFollowing = function() {
        $rootScope.following = $rootScope.following || {};
        var i = 0;
        for (i = 0; i < $scope.reccos.length; i++) {
            //console.log($scope.reccos[i].is_following);
            $rootScope.following[$scope.reccos[i].outlet_summary._id] = $scope.reccos[i].is_following;
        }
    };

    $scope.onTabSelected = function() {
        $scope.search = {};
        $scope.search.searchText = '';

        //$scope.getReccos();
        $scope.reccos = storageSvc.get('reccos')
    };

    $scope.searchText = "";
    $scope.reccos = storageSvc.get('reccos') || preloadSvc.reccos.info.reccos;
    //$scope.nearby = storageSvc.get('nearby') || [];

    fillFollowing();

    // $scope.more = $scope.more || {
    //     clicked: false
    // };
    $scope.end = 0;

    $scope.location_error_shown = $scope.location_error_shown || true;

    $scope.$on('no_location', function() {
        if (!$scope.location_error_shown) {
            $window.navigator.notification.alert("Please enable location services and give Twyst access to your location to get accurate distances and map information.");
            $scope.location_error_shown = true;
            $timeout(function() {
                $scope.location_error_shown = false;
            }, 1000 * 60);
        } else {
            $timeout(function() {
                $scope.location_error_shown = false;
            }, 1000 * 10);
        }
    });

    $scope.clearSearch = function(searchText) {
        logSvc.event('Search', 'Clear search', 'Click on clear search', '1');

        $scope.search.searchText = '';
        $scope.search.showing = false;
        $scope.reccos = storageSvc.get('reccos')
            // $scope.getReccos();
    };

    $scope.searchReccos = function(searchText) {
        logSvc.event('Search', 'Search clicked', 'Searched for text', '1');
        $scope.search = $scope.search || {};
        $scope.search.showing = true;
        dataSvc.searchReccos(searchText).then(function(data) {
            $scope.reccos = data.info.reccos || [];
            fillFollowing();
            $scope.$broadcast('scroll.refreshComplete');

        }, function(error) {
            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                 $ionicLoading.hide();
                // $window.navigator.notification.alert(error,
                //     function() {
                //         $ionicLoading.hide();
                //     }, "ERROR", "OK");
            }

            $scope.$broadcast('scroll.refreshComplete');
        });
    };

    $scope.refresh = function(searchText) {
        logSvc.event('Refresh', 'Pull to refresh', 'Pull to refresh on discover', '1');

        if ($scope.search && $scope.search.showing) {
            $scope.searchReccos(searchText);
        } else {
            $scope.getReccos();
            $scope.getNearby();
        }
    };

    $scope.getNearby = function(more) {

        dataSvc.getNearby(500).then(function(data) {

            $scope.nearby = data.info.near;
        }, function(error) {

        })
    };

    $scope.getReccos = function(more) {
        // Reset search results
        $scope.search = $scope.search || {};
        $scope.search.showing = false;
        $scope.searchText = "";

        $scope.http = {};
        if (more && $scope.reccos && $scope.reccos.length !== 0) {
            $scope.end = $scope.end + 20;
            // $scope.more.clicked = true;
        } else {
            $scope.end = 20;
        }

        dataSvc.getReccos($scope.end).then(function(data) {
            console.log("RECCO DATA " + JSON.stringify(data));
            $scope.total = data.info.total;
            $scope.reccos = data.info.reccos;
            fillFollowing();
            $scope.$broadcast('scroll.refreshComplete');
            // $scope.more.clicked = false;
        }, function(error) {
            $scope.$broadcast('scroll.refreshComplete');
            // $scope.more.clicked = false;

            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                 $ionicLoading.hide();
                // $window.navigator.notification.alert(error,
                //     function() {
                //         $ionicLoading.hide();
                //     }, "ERROR", "OK");
            }
        });
    };

    $rootScope.following = $rootScope.following || {};
    $scope.follow = function(item) {
        logSvc.event('Follow', 'Follow clicked', 'Follow clicked from Discover', '1');

        $window.navigator.notification.confirm(
            'Stay updated with offer notifications, event updates and more!', // message
            function(index) {
                if (index === 1) {
                    dataSvc.follow(item.outlet_summary._id).then(function(success) {
                        $rootScope.following[item.outlet_summary._id] = true;
                        logSvc.event('Follow', 'Follow success', 'Follow success from Discover', '1');

                    }, function(error) {
                        if (error === 'network_error') {
                            dataSvc.showNetworkError();
                        } else {
                            logSvc.event('Follow', 'Follow error', 'Follow error from Discover', '1');
                             $ionicLoading.hide();
                            // $window.navigator.notification.alert(error,
                            //     function() {
                            //         $ionicLoading.hide();
                            //     }, "ERROR", "OK");
                        }
                    });
                }
            }, // callback
            'Follow outlet', // title
            ['OK', 'Cancel'] // buttonName
        );
    };

    $scope.unfollow = function(item) {
        logSvc.event('Follow', 'Unfollow clicked', 'Unfollow clicked from Discover', '1');

        dataSvc.unfollow(item.outlet_summary._id).then(function(success) {
            $rootScope.following[item.outlet_summary._id] = false;
            logSvc.event('Follow', 'Unfollow success', 'Unfollow success from Discover', '1');

        }, function(error) {
            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                logSvc.event('Follow', 'Unfollow error', 'Unfollow error from Discover', '1');
                 $ionicLoading.hide();
                // $window.navigator.notification.alert(error,
                //     function() {
                //         $ionicLoading.hide();
                //     }, "ERROR", "OK");
            }
        });
    };


    $scope.showOutletDetails = function(item) {
        logSvc.event('Details', 'Outlet details', 'Clicked on show outlet details', '1');

        $state.go('main.in.found.outlet_details', {
            item: item._id
        }, {
            inherit: false
        });
    };

    $scope.getReccos();
    $scope.getNearby();
});

twystApp.controller('RewardsCtrl', function($rootScope, $ionicPopup, $ionicLoading, $scope, $state, dataSvc, storageSvc, $window, urlp, logSvc) {
    logSvc.page("My Rewards");
    $scope.http = {};
    $scope.end = 0;
    $scope.active_rewards = (storageSvc.get('rewards') && storageSvc.get('rewards').ACTIVE) || [];
    $scope.active_count = $scope.active_rewards.length;

    $scope.getRewards = function(more) {
        if (more) {
            $scope.end = $scope.end + 20;
            // $scope.more.clicked = true;

        } else {
            $scope.end = 20;
        }

        dataSvc.getRewards($scope.end).then(function(data) {
            $scope.active_rewards = data.info.vouchers.ACTIVE;
            $scope.active_count = $scope.active_rewards.length;
            $scope.merchant_redeemed = data.info.vouchers.MERCHANT_REDEEMED || [];
            $scope.user_redeemed = data.info.vouchers.USER_REDEEMED || [];
            $scope.used_rewards = $scope.merchant_redeemed.concat($scope.user_redeemed);
            $scope.expired_rewards = data.info.vouchers.EXPIRED;

            $scope.total_count = $scope.active_rewards.length + $scope.expired_rewards.length + $scope.used_rewards.length;

            $scope.$broadcast('scroll.refreshComplete');
            // $scope.more.clicked = false;
        }, function(error) {
            $scope.$broadcast('scroll.refreshComplete');
            $scope.more.clicked = false;

            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                 $ionicLoading.hide();
                // $window.navigator.notification.alert(error,
                //     function() {
                //         $ionicLoading.hide();
                //     }, "ERROR", "OK");
            }
        });
    };

    $scope.getRewards();

    $scope.is_redeemed = function(id) {
        var redeemed = storageSvc.get('redeemed');
        return redeemed && redeemed[id] && redeemed[id].status;
    };

    $scope.remind = function(item) {
        logSvc.event('Remind', 'Remind clicked', 'Remind clicked from My Rewards', '1');

        var startDate = new Date(item.voucher.issue_details.program.validity.burn_end);
        var endDate = new Date(item.voucher.issue_details.program.validity.burn_end);

        var startMoment = moment(startDate);
        var endMoment = moment(endDate);
        startMoment = startMoment.subtract(7, 'd').startOf('d').add(12, 'h');
        endMoment = endMoment.subtract(7, 'd').startOf('d').add(13, 'h');

        var title = "Voucher: " + item.voucher.basics.description + " @ " + item.voucher.issue_details.issued_at[0].basics.name;
        var location = item.voucher.issue_details.issued_at[0].basics.name;
        var notes = "Automatic reminder from Twyst: " + item.voucher.basics.description;

        $window.navigator.notification.confirm(
            'Set reminder for ' + startMoment.format('Do-MMM') + '(7 days before this voucher expires) on your calendar?', // message
            function(index) {
                if (index == 1) {
                    $window.plugins.calendar.createEvent(title, location, notes, startMoment.toDate(), endMoment.toDate(), success, error);
                }
            }, // callback
            'Remind me', // title
            ['OK', 'Cancel'] // buttonName
        );

        var success = function(message) {
            logSvc.event('Remind', 'Reminder success', 'Reminder created from My Rewards', '1');

            $window.alert("Reminder set for " + startMoment.format('Do-MMM'));
        };
        var error = function(message) {
            logSvc.event('Remind', 'Reminder error', 'Reminder error from My Rewards', '1');
             $ionicLoading.hide();
            // $window.navigator.notification.alert("Could not create a reminder " + message,
            //     function() {
            //         $ionicLoading.hide();
            //     }, "ERROR", "OK");
        };

    };


    $scope.showRewardDetails = function(item) {
        logSvc.event('Details', 'Reward details', 'Reward details from My Rewards', '1');

        $state.go('main.in.found.reward_details', {
            item: item.voucher._id,
        }, {
            inherit: false
        });
    };

    $scope.imageName = function(item) {
        var a = '';
        if (item.voucher.basics.type !== 'WINBACK') {
            a = Object.keys(item.voucher.issue_details.issued_for.reward)[0];
        } else {
            a = Object.keys(item.voucher.issue_details.winback.reward)[0];
        }
        return "assets/rewards/" + a + ".png";
    };

    $scope.imageNameUsed = function(item) {
       var a = '';
        if (item.basics.type !== 'WINBACK') {
            a = Object.keys(item.issue_details.issued_for.reward)[0];
        } else {
            console.log(item);
            a = Object.keys(item.issue_details.winback.reward)[0];
        }
        return "assets/rewards/" + a + ".png";

    };


});

twystApp.controller('ActivityCtrl', function($rootScope, $ionicLoading, $scope, $state, dataSvc, storageSvc, $window, logSvc) {
    logSvc.page("Timeline");

    $scope.timeline = (storageSvc.get('activity') && storageSvc.get('activity').info) || [];
    $scope.end = 0;

    $scope.getActivity = function(more) {
        if (more) {
            $scope.end = $scope.end + 20;
            // $scope.more.clicked = true;

        } else {
            $scope.end = 20;
        }

        dataSvc.getTimeline($scope.end).then(function(data) {
            $scope.timeline = data.info;
            $scope.$broadcast('scroll.refreshComplete');
            // $scope.more.clicked = false;
        }, function(error) {
            $scope.$broadcast('scroll.refreshComplete');
            // $scope.more.clicked = false;

            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                 $ionicLoading.hide();
                // $window.navigator.notification.alert(error,
                //     function() {
                //         $ionicLoading.hide();
                //     }, "ERROR", "OK");
            }
        });
    };

    $scope.getActivity();

    $scope.showActivityDetails = function(item) {
        logSvc.event('Details', 'Activity details', 'Activity details from Timeline', '1');

        if (item.message_object_type === "CHECKIN") {
            $state.go('main.in.found.outlet_details', {
                item: item.message_object.outlet_id
            }, {
                inherit: false
            });
        } else if (item.message_object_type === "VOUCHER_UNLOCKED") {
            $state.go('main.in.found.reward_details', {
                item: item.message_object.voucher_id,
            }, {
                inherit: false
            });

        } else if (item.message_object_type === "VOUCHER_USED") {
            $state.go('main.in.found.outlet_details', {
                item: item.message_object.outlet_id
            }, {
                inherit: false
            });
        } else if (item.message_object_type === "NEW_OUTLET") {
            $state.go('main.in.found.outlet_details', {
                item: item.message_object.outlet_id
            }, {
                inherit: false
            });
        } else if (item.message_object_type === "NEW_PROGRAM") {
            $state.go('main.in.found.outlet_details', {
                item: item.message_object.outlet_id
            }, {
                inherit: false
            });
        }
    };
});

twystApp.controller('OnInFoundCtrl', function($rootScope, $ionicPlatform, $scope, $ionicLoading, $ionicTabsDelegate, $ionicNavBarDelegate, $ionicActionSheet, $timeout, $ionicSideMenuDelegate, $state, $http, $window, dataSvc, preloadSvc, storageSvc, logSvc) {
    dataSvc.getUserName().then(function(data) {
        $scope.username = data;
    }, function(error) {
        $scope.username = null;
    });


            $window.onNotification = function(e) {
                switch (e.event) {
                    case 'registered':
                        if (e.regid.length > 0) {
                            console.log("REGISTERED WITH regID = " + e.regid);
                            dataSvc.registerGCM(e.regid).then(function(success) {
                                console.log("TWYST: SUCCESSFULLY REGISTERED FOR PUSH")
                            }, function(error) {
                                console.log("TWYST: ERROR REGISTERING FOR PUSH")

                            })

                        }
                        break;

                    case 'message':
                        // if this flag is set, this notification happened while we were in the foreground.
                        // you might want to play a sound to get the user's attention, throw up a dialog, etc.
                        if (e.foreground) {
                            console.log("TWYST: MESSAGE IN FOREGROUND " + JSON.stringify(e));

                            // on Android soundname is outside the payload.
                            // On Amazon FireOS all custom attributes are contained within payload
                            // var soundfile = e.soundname || e.payload.sound;
                            // if the notification contains a soundname, play it.
                            // var my_media = new Media("/android_asset/www/" + soundfile);
                            // my_media.play();
                        } else { // otherwise we were launched because the user touched a notification in the notification tray.
                            if (e.coldstart) {
                            console.log("TWYST: MESSAGE IN COLDSTART" + JSON.stringify(e));

                            } else {
                            console.log("TWYST: MESSAGE IN WARMSTART" + JSON.stringify(e));
                            }
                        }

                        break;

                    case 'error':
                        console.log("TWYST: GCM ERROR " + JSON.stringify(e));
                        break;

                    default:
                        console.log("TWYST: UNKNOWN EVENT " + JSON.stringify(e));
                        break;
                }
            }

            function successHandler(result) {
                console.log('TWYST: success result = ' + JSON.stringify(result));
            }

            function errorHandler(result) {
                console.log('TWYST: success result = ' + JSON.stringify(result));
            }





    $scope.fblike = function() {
        var window_ref = $window.open('http://www.facebook.com/twystin', '_blank');
    }

    $scope.privacy = function() {
        var window_ref = $window.open('http://twyst.in/legal/Privacy_Policy.pdf', '_system', 'location=yes');
    };

    $scope.tou = function() {
        console.log("PRIVACY");
        var window_ref = $window.open('http://twyst.in/legal/terms_of_use.pdf', '_system', 'location=yes');
    };

    $scope.restore = function() {
        $window.navigator.notification.confirm("Restoring Twyst will remove all data and reset your account. Are you sure?",
            function() {
                storageSvc.clear();
                $window.alert("");
            }, "RESET TWYST", ["OK", "CANCEL"]);
    }

    $scope.manage = function() {
        logSvc.event('Sidebar', 'Sidebar - Profile', 'Sidebar - Profile clicked', '1');

        $state.go('main.in.found.profile');
    }

    $scope.get_in_touch = function() {
        logSvc.event('Sidebar', 'Sidebar - Get in touch', 'Sidebar - Get in touch clicked', '1');

        var onPrompt = function(results) {
            if (results.buttonIndex === 1) {
                dataSvc.suggest(results.input1).then(function() {
                    $window.navigator.notification.alert("",
                        function() {}, "THANK YOU FOR YOUR SUGGESTION", "OK");
                }, function(error) {
                    if (error === 'network_error') {
                        dataSvc.showNetworkError();
                    } else {
                         $ionicLoading.hide();
                        // $window.navigator.notification.alert(error,
                        //     function() {
                        //         $ionicLoading.hide();
                        //     }, "ERROR SENDING YOUR SUGGESTION", "OK");
                    }
                });
            }
        };

        $window.navigator.notification.prompt(
            'Send a message to Twyst!', // message
            onPrompt, // callback to invoke
            'Get in touch', // title
            ['OK', 'Cancel'], // buttonLabels
            '' // defaultText
        );
    }

    $scope.suggest_outlet = function() {
        logSvc.event('Sidebar', 'Sidebar - Suggest', 'Sidebar - Suggest clicked', '1');

        var onPrompt = function(results) {
            if (results.buttonIndex === 1) {
                dataSvc.suggest(results.input1).then(function() {
                    $window.navigator.notification.alert("",
                        function() {}, "THANK YOU FOR YOUR SUGGESTION", "OK");
                }, function(error) {
                    if (error === 'network_error') {
                        dataSvc.showNetworkError();
                    } else {
                         $ionicLoading.hide();
                        // $window.navigator.notification.alert(error,
                        //     function() {
                        //         $ionicLoading.hide();
                        //     }, "ERROR SENDING YOUR SUGGESTION", "OK");
                    }
                })
            }
        };

        $window.navigator.notification.prompt(
            'Suggest an outlet you would like to see on Twyst!', // message
            onPrompt, // callback to invoke
            'Suggest an outlet', // title
            ['OK', 'Cancel'], // buttonLabels
            '' // defaultText
        );
    }

    $scope.getPhone = function(item) {
        if (item &&
            item.contact &&
            item.contact.phones) {
            if (item.contact.phones.mobile.length) {
                if (item.contact.phones.mobile[0].num) {
                    return item.contact.phones.mobile[0].num;
                } else {
                    return item.contact.phones.landline;
                }
            } else if (item.contact.phones.landline.length) {
                return item.contact.phones.landline;
            } else {
                return null;
            }
        } else {
            return null;
        }
    };


    $scope.checkin = function() {
        logSvc.event('Checkin', 'Checkin clicked', 'Checkin clicked', '1');

        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> CHECKING YOU IN'
        });

        $window.navigator.notification.alert("Yes? Then tap ‘OK’ and point the camera at the QR code to scan. Ordering in? Ask your server to check you in.",
            function() {
                // TEST HOOK
                //$state.go('main.in.found.checkin_success'); // placeholder

                cordova.plugins.barcodeScanner.scan(
                    function(result) {
                        logSvc.event('Checkin', 'Checkin success', 'Checkin success', '1');

                        if (result && result.text) {
                            dataSvc.checkin(result.text).then(function(data) {
                                if (data.status === "error") {
                                    $window.navigator.notification.alert("Error: " + data.message,
                                        function() {
                                            $ionicLoading.hide();
                                        }, "CHECK-IN ERROR", "OK");

                                } else {
                                    dataSvc.set_checkin_data(data);
                                    $state.go('main.in.found.checkin_success'); // placeholder

                                }
                            }, function(err) {
                                logSvc.event('Checkin', 'Checkin error', 'Checkin error', '1');
                                $window.navigator.notification.alert("Error " + err.message,
                                    function() {
                                        $ionicLoading.hide();
                                    }, "CHECK-IN ERROR", "OK");
                            });
                        } else {
                             $ionicLoading.hide();
                            // $window.navigator.notification.alert("Error: Could not scan the QR code",
                            //     function() {
                            //         $ionicLoading.hide();
                            //     }, "CHECK-IN ERROR", "OK");
                        }
                    },
                    function(error) {
                        logSvc.event('Checkin', 'Checkin error', 'Checkin error', '1');
                        $window.navigator.notification.alert("Error " + JSON.stringify(err),
                            function() {
                                $ionicLoading.hide();
                            }, "CHECK-IN ERROR", "OK");
                    }
                );
            }, "ARE YOU AT THE RESTAURANT?", "OK");
        $ionicLoading.hide();
    };

    $scope.showMenu = function() {
        $ionicSideMenuDelegate.toggleLeft();
    };



    $scope.showMap = function() {
        $state.go('main.in.found.map');
    };

});
