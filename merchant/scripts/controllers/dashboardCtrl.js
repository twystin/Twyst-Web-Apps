'use strict';

twystApp.controller('DashboardCtrl', function ($scope, $location, $http, authService, dashService, analyticsSvc) {
    if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }

    $scope.auth = authService.getAuthStatus();
    dashService.populateDashboardInfo($scope.auth._id);
    $scope.dashboard_info = dashService.getDashboardInfo();

    //TODO: Fix this so it gets called at the right time
    analyticsSvc.populateAnalyticsInfo();
    analyticsSvc.populateCountInfo($scope);
    $scope.analytics_info = analyticsSvc.getAnalyticsInfo();

    $scope.showCreateOutlet = function () {
        return !$scope.dashboard_info.outlet_count;
    };

    $scope.showCreateOffer = function () {
        return !$scope.dashboard_info.offer_count && !!$scope.dashboard_info.outlet_count;
    };

    $scope.showAnalytics = function () {
        console.log($scope.dashboard_info);
        return !!$scope.dashboard_info.offer_count && !!$scope.dashboard_info.outlet_count 
        && !!$scope.dashboard_info.roi && !!$scope.dashboard_info.repeat_rate;
    };
});