'use strict';

twystApp.controller('PublicCtrl', function ($scope, $http, $routeParams) {
    $scope.outlet = function () {
        var outlet_id = $routeParams.outlet,
            request = $http.get('/api/v1/publicview/outlets/' + outlet_id);
        return request.then(function (response) {   
            var outlet = JSON.parse(response.data.info)[0];
            $scope.outlet = outlet;
        }, function (response) {
            //TODO: Handle error case
        });
    };

    $scope.outlets = function () {
        var request = $http.get('/api/v1/public/outlets/all');
        return request.then(function (response) {
            var outlets = JSON.parse(response.data.info);
            $scope.outlets = outlets;
        }, function (response) {
            //TODO: Handle error case
        });
    };

    $scope.getDetails = function () {
        var outlet_id = $routeParams.outlet;
        $http.get('/api/v1/publicview/outlets/' + outlet_id)
        .success(function (data) {
            $scope.outlet = JSON.parse(data.info);
        }).error(function (data) {
            console.log(data);;
        });

        var offer_id = $routeParams.offer;
        $http.get('/api/v1/offers/' + offer_id)
        .success(function (data) {
            $scope.offer = JSON.parse(data.info);
        }).error(function (data) {
            console.log(data);;
        });        
    };
});