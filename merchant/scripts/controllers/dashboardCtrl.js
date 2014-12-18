'use strict';

twystApp.controller('DashboardCtrl', function ($scope, $location, authService, dashService) {
    if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }
    $scope.data = {};
    $scope.auth = authService.getAuthStatus();

    dashService.getDashBoardInfo().then(function (data) {
        $scope.data = data.info;
    })

    dashService.getRoi().then(function (data) {
        $scope.roi = data.info;
    })
});