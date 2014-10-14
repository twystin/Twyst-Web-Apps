'use strict';
twystApp.factory('winbackService', function ($http, $q) {

    var winSvc = {};

    winSvc.create = function(winback) {

        var defer = $q.defer();
        $http.post(
            '/api/v3/winback', winback
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    winSvc.read = function(winback) {

        var defer = $q.defer();
        $http.get(
            '/api/v3/winback'
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    winSvc.readOne = function(id) {

        var defer = $q.defer();
        $http.post(
            '/api/v3/winback/'+ winback
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    return winSvc;
}).
controller('WinbackCtrl', function ($scope, winbackService) {
    $scope.winback = {};
    $scope.winback.offers = [{
        basics: {

        },
        reward_applicability: {

        }
    }];

    $scope.reward_check = [
        {"text": "Discount", value:"discount"},
        {"text": "Flat off", value:"flat"},
        {"text": "Free ", value:"free"},
        {"text": "Buy one get one ", value:"buy_one_get_one"},
        {"text": "Happy hours", value:"happy"},
        {"text": "Reduced price ", value:"reduced"},
        {"text": "Custom ", value:"custom"}
    ];
    $scope.selected_reward = $scope.reward_check[0];


    $scope.day_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday','all days'];

    $scope.time_of_day = ['breakfast', 'brunch', 'lunch', 'evening', 'dinner', 'all day'];
    
    $scope.rewardCheckedDays = ['all days'];
    $scope.rewardCheckedTime = ['all day'];

    $scope.checkinCheckedDays = [];
    $scope.checkinCheckedTime = [];

    $scope.rewardToggleCheckDay = function (fruit) {
        if(fruit === 'all days') {
            if($scope.rewardCheckedDays.indexOf(fruit) >= 0) {
                $scope.rewardCheckedDays.splice($scope.rewardCheckedDays.indexOf(fruit), 1);
            }
            else {
                $scope.rewardCheckedDays = ['all days'];
            }
        }
        else {
            if($scope.rewardCheckedDays.indexOf('all days') >= 0) {
                $scope.rewardCheckedDays.splice($scope.rewardCheckedDays.indexOf('all days'), 1);
            }
            if ($scope.rewardCheckedDays.indexOf(fruit) === -1) {
                $scope.rewardCheckedDays.push(fruit);
            } else {
                $scope.rewardCheckedDays.splice($scope.rewardCheckedDays.indexOf(fruit), 1);
            }
        }
    };

    $scope.rewardToggleCheckTime = function (fruit) {
        if(fruit === 'all day') {
            if($scope.rewardCheckedTime.indexOf(fruit) >= 0) {
                $scope.rewardCheckedTime.splice($scope.rewardCheckedTime.indexOf(fruit), 1);
            }
            else {
                $scope.rewardCheckedTime = ['all day'];
            }
        }
        else {
            if($scope.rewardCheckedTime.indexOf('all day') >= 0) {
                $scope.rewardCheckedTime.splice($scope.rewardCheckedTime.indexOf('all day'), 1);
            }
            if ($scope.rewardCheckedTime.indexOf(fruit) === -1) {
                $scope.rewardCheckedTime.push(fruit);
            } else {
                $scope.rewardCheckedTime.splice($scope.rewardCheckedTime.indexOf(fruit), 1);
            }
        }
    };

    $scope.create = function () {
        $scope.winback.offers = getOffer();
        winbackService.create($scope.winback).then(function(data) {
            console.log(data);
        })   
    };

    $scope.read = function () {
        winbackService.read($scope.winback).then(function(data) {
            console.log(data);
        })   
    };

    $scope.readOne = function (id) {
        winbackService.readOne(id).then(function(data) {
            console.log(data);
        })   
    };

    function getOffer() {
        var offers = [],
            o = $scope.winback.offers[0];
        o.basics.title = $scope.winback.name;
        o.basics.description = $scope.winback.description;
        o.reward_applicability = {};
        o.reward_applicability.time_of_day = $scope.rewardCheckedTime;
        o.reward_applicability.day_of_week = $scope.rewardCheckedDays;
        offers.push(o);
        return offers;
    }
});