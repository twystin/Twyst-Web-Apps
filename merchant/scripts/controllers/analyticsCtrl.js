'use strict';

twystApp.controller('AnalyticsCtrl', function ($scope, $http, $location, authService, outletService, programService, analyticsSvc) {
    $scope.auth = authService.getAuthStatus();
    analyticsSvc.populateAnalyticsInfo();
    analyticsSvc.populateCountInfo($scope);
    $scope.dashboard_info = analyticsSvc.getAnalyticsInfo();
    

    $scope.$watch('program_id', function () {
        if($scope.program_id) {
            $scope.getSummaryCheckins();
            $scope.getSummaryVouchers();
        }
    });

    //TODO: These two functions are for showing the voucher data on the reports page. Remove
    $scope.outletQuery = function () {
        outletService.query().then(function (data) {
            $scope.outlets = data.info;
            $scope.all_outlets = data.info;
        }, function (err) {
            console.log(err);
        });
    };

    $scope.getVouchers = function () {
        if ($scope.outlet_id !== undefined) {
            analyticsSvc.getVouchers($scope, $http, $location, $scope.outlet_id);
        }
    };

    $scope.onlyPrograms = function () {
        programService.query().then(function (data) {
            $scope.programs = data.info;
        }, function (err) {
            console.log(err);
        });
    };

    $scope.getSummaryCheckins = function () {
        analyticsSvc.getSummaryCheckins($scope, $http, $location);
    };

    $scope.getSummaryVouchers = function () {
        analyticsSvc.getSummaryVouchers($scope, $http, $location);
    };
});

