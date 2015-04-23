twystApp.directive('imageonload', function($rootScope, $window) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            element.bind('load', function() {
                $rootScope.img.loaded = true;
                // console.log("CALLED IMGLOADED ");
                // $window.alert("IMAGE LOADED");
            });
        }
    };
});

twystApp.controller('OutletDetailsCtrl', function($scope, $timeout, urlp, $ionicLoading, $window, $rootScope, dataSvc, storageSvc, item, $state, $ionicTabsDelegate, logSvc) {
    logSvc.page("Outlet Details");

    $scope.item = null;
    $scope.infolist = [];
    $rootScope.img = {};
    $rootScope.img.loaded = false;
    $scope.rewards = $scope.rewards || {
        count: 5
    };


    $scope.highlighted = $scope.highlighted || {};
    $scope.highlighted.value = $scope.highlighted.value || 200;

    $scope.limitRewards = function() {
        var i = 0;
        var c = $scope.item.checkin_count;
        console.log(c);
        var r = $scope.item.reward_tree.rewards;
        console.log(r);
        $scope.limitedRewards = [];
        for (i = 0; i < r.length; i++) {
            if (c < r[i].count) {
                $scope.limitedRewards.push(r[i]);
            }
        }
        return $scope.limitedRewards;
    }

    $scope.highlight = function(c, r, p) {
        p = p || 0;
        if (c >= p && c < r) {
            return 'highlight';
        }
        return '';
    };

    $rootScope.following = $rootScope.following || {};
    $scope.followed = false;
    $scope.follow = function(item) {
        $window.navigator.notification.confirm(
            'By following this outlet you will get improved recommendations and notifications from this outlet.', // message
            function(index) {
                if (index == 1) {
                    dataSvc.follow(item.outlet_details._id).then(function(success) {
                        $rootScope.following[item.outlet_details._id] = true;
                        $scope.followed = true;
                        item.total_follow = item.total_follow + 1;
                    }, function(error) {
                        if (error === 'network_error') {
                            dataSvc.showNetworkError();
                        } else {
                             $ionicLoading.hide();
                            // $window.navigator.notification.alert(error,
                            //     function() {}, "ERROR", "OK");
                        }
                    });                    
                }
            }, // callback
            'Follow outlet', // title
            ['OK', 'Cancel'] // buttonName
        );


    };

    $scope.unfollow = function(item) {
        dataSvc.unfollow(item.outlet_details._id).then(function(success) {
            $rootScope.following[item.outlet_details._id] = false;
            $scope.followed = false;
            item.total_follow = item.total_follow - 1;
        }, function(error) {
            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                 $ionicLoading.hide();
                // $window.navigator.notification.alert(error,
                //     function() {}, "ERROR", "OK");
            }
        });
    };

    $scope.showLoading = function() {
        $scope.loadingIndicator = $ionicLoading.show({
            content: 'Loading!',
            animation: 'fade-in',
            showBackdrop: false,
            maxWidth: 200,
            showDelay: 500
        });

        $timeout(function() {
            $scope.loadingIndicator.hide();
        }, 1000);
    };


    $scope.item = storageSvc.get(item.item) || null;

    if (dataSvc[item.item]) {
        $scope.item = dataSvc[item.item].info;
    }

    // Not an either or... get from storage, then from detail and then from http

    dataSvc.getDetail(item.item).then(function(data) {
        $scope.item = data.info;
        console.log("DETAIL " + JSON.stringify(data));
    }, function(error) {
        if (error === 'network_error') {
            dataSvc.showNetworkError();
        } else {
             $ionicLoading.hide();
            // $window.navigator.notification.alert(error,
            //     function() {}, "ERROR", "OK");
        }
    });


    $scope.showRewardDetails = function(item) {
        console.log("REWARD " + JSON.stringify(item));
        $state.go('main.in.found.reward_details', {
            item: item._id,
        }, {
            inherit: false
        });
    };


    $scope.photos = function(item) {
        $state.go('main.in.found.photos', {
            item: item.outlet_details._id
        }, {
            inherit: false
        });
    };

    $scope.feedback = function(item) {
        $state.go('main.in.found.feedback', {
            item: item.outlet_details._id
        }, {
            inherit: false
        });
    };

    $scope.goTab = function(index) {
        $ionicTabsDelegate.select(index);
    };

});
