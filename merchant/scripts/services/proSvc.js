'use strict';
twystApp.factory('proSupService', function ($log, $http, $location) {
    var proSupSvc = {};
   
    proSupSvc.saveTier = function ($scope, program_id, $route) {
        $http({
            url: '/api/v1/add/tiers/' + program_id,
            method: "POST",
            data: $scope.tier
        }).success(function (data) {
            $route.reload();
            $scope.message = data.message;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };

    proSupSvc.saveOffer = function ($scope, tier_id, $route) {
        $http({
            url: '/api/v1/add/offers/' + tier_id,
            method: "POST",
            data: $scope.offer
        }).success(function (data) {
            $route.reload();
            $scope.message = data.message;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };

    proSupSvc.updateProgram = function ($scope, program_id, $route) {
        $http({
            url: '/api/v1/programs/' + program_id,
            method: "PUT",
            data: $scope.program
        }).success(function (data) {
            $route.reload();
            $scope.message = data.message;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };

    proSupSvc.updateTier = function ($scope, tier_id, $route) {
        console.log($scope.tier);
        $http({
            url: '/api/v1/tiers/' + tier_id,
            method: "PUT",
            data: $scope.tier
        }).success(function (data) {
            $route.reload();
            $scope.message = data.message;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };

    proSupSvc.updateOffer = function ($scope, offer_id, $route) {
        $http({
            url: '/api/v1/offers/' + offer_id,
            method: "PUT",
            data: $scope.offer
        }).success(function (data) {
            $route.reload();
            $scope.message = data.message;
        }).error(function (data) {
            console.log(data);
            $scope.message = data.message;
        });
    };

    proSupSvc.deleteTier = function ($scope, tier_id, $route, $modalInstance) {
        console.log($scope.tier);
        $http({
            url: '/api/v1/delete/tier/' + tier_id,
            method: "DELETE"
        }).success(function (data) {
            $route.reload();
            $modalInstance.dismiss('cancel');
            $scope.message = data.message;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };

    proSupSvc.deleteOffer = function ($scope, offer_id, $route, $modalInstance) {
        $http({
            url: '/api/v1/delete/offer/' + offer_id,
            method: "DELETE"
        }).success(function (data) {
            $route.reload();
            $modalInstance.dismiss('cancel');
            $scope.message = data.message;
        }).error(function (data) {
            console.log(data);
            $scope.message = data.message;
        });
    };
    
    return proSupSvc;
});