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

    winSvc.update = function(winback) {

        var defer = $q.defer();
        $http.put(
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
        $http.get(
            '/api/v3/winback/'+ id
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    return winSvc;
}).
controller('WinbackCtrl', function ($scope, $location, $routeParams, winbackService) {
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
        {"text": "Happy hours", value:"happyhours"},
        {"text": "Reduced price ", value:"reduced"},
        {"text": "Custom ", value:"custom"}
    ];
    $scope.preserve_reward = null;
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

    $scope.correctReward = function (param) {
        $scope.selected_reward = param;
        if(!$scope.winback.offers[0]._id) {
            $scope.offer.reward = {};
        } else {
            if($scope.winback.offers[0].reward) {
                var key = Object.keys($scope.preserve_reward)[0];
                if(param.value === key) {
                    $scope.winback.offers[0].reward = $scope.preserve_reward;
                }
                else {
                    $scope.winback.offers[0].reward = {};
                }
            } else {
                $scope.winback.offers[0].reward = {};
            }
        }
    }

    $scope.create = function () {
        $scope.winback.offers = getOffer();
        winbackService.create($scope.winback).then(function(data) {
            if(data.status = "success"){
                $location.path("/winback");
            }
        })   
    };

    $scope.update = function () {
        $scope.winback.offers = getOffer();
        winbackService.update($scope.winback).then(function(data) {
            if(data.status = "success"){
                $location.path("/winback");
            }
        })   
    };

    $scope.read = function () {
        winbackService.read().then(function(data) {
            $scope.winbacks = data.info;
        });
    };

    $scope.readOne = function () {
        var id = $routeParams.winback_id;
        winbackService.readOne(id).then(function(data) {
            $scope.winback = data.info;
            setOfferAttr($scope.winback.offers);
        });  
    };

    function setOfferAttr (offers) {
        if(offers && offers.length > 0) {
            var o = offers[0];
            if(!o.reward) {
                $scope.selected_reward = $scope.reward_check[0];
            }
            else {
                var l = Object.keys(o.reward)[0];
                var ll = _.find($scope.reward_check, function (reward){return reward.value === l});
                $scope.selected_reward = ll;
                $scope.preserve_reward = o.reward;
            }
            $scope.rewardCheckedTime = o.reward_applicability.time_of_day;
            $scope.rewardCheckedDays = o.reward_applicability.day_of_week;
        }
    }

    function getOffer() {
        var offers = [],
            o = $scope.winback.offers[0];
        o.basics.title = $scope.winback.name;
        o.basics.description = $scope.winback.description;
        o.reward_applicability = {};
        o.reward_applicability.time_of_day = $scope.rewardCheckedTime;
        o.reward_applicability.day_of_week = $scope.rewardCheckedDays;
        if($scope.preserve_reward && !o.reward) {
            o.reward = $scope.preserve_reward;
        }
        offers.push(o);
        return offers;
    }
});