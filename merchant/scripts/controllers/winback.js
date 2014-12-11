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
controller('WinbackCtrl', function ($http, outletService, authService, OPERATE_HOURS, $scope, $location, $routeParams, winbackService) {
    $scope.winback = {
        outlets: []
    };
    $scope.avail_hours = OPERATE_HOURS;
    $scope.validationArray = [true, true, true, true, true, true, true, true];
    $scope.week = ['monday' ,'tuesday' ,'wednesday' ,'thursday' ,'friday', 'saturday', 'sunday'];
    
    $scope.create = function () {
        $scope.winback.avail_hours = $scope.avail_hours;
        winbackService.create($scope.winback).then(function(data) {
            if(data.status = "success"){
                $location.path("/winback");
            }
        })   
    };

    $scope.update = function () {
        $scope.winback.avail_hours = $scope.avail_hours;
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
            $scope.avail_hours = $scope.winback.avail_hours;
            $scope.winback.outlets = $scope.winback.outlets.map(function (o) {
                return o._id;
            })
        });  
    };

    $scope.timingsValidation = function () {
        var flag = 0;
        for (var i = 0; i < 7; i++){
            flag = 0;
            if ($scope.avail_hours[$scope.week[i]].closed == false && 
                $scope.avail_hours[$scope.week[i]].timings.length > 1){
                for (var j = 0; j < $scope.avail_hours[$scope.week[i]].timings.length-1; j++){
                    for (var k = j + 1 ; k < $scope.avail_hours[$scope.week[i]].timings.length; k++){
                        if ((sendTime(1, i, j) < sendTime(0, i, k)) && (sendTime(0, i, j) > sendTime(1, i, k))){
                            
                            flag=1;
                        }
                    }
                }
            }
        if (flag==1){
            $scope.validationArray[i] = false;
        }
        else{
            $scope.validationArray[i] = true;
        }
        }

    }

    function sendTime(i, w, t){
        //1 for open
        if (i==1){
            return ($scope.avail_hours[$scope.week[w]].timings[t].open.hr * 60 *1 +
            $scope.avail_hours[$scope.week[w]].timings[t].open.min * 1);
        }
        //0 for close
        else if (i==0){
            return ($scope.avail_hours[$scope.week[w]].timings[t].close.hr * 60 *1 +
            $scope.avail_hours[$scope.week[w]].timings[t].close.min * 1);
        }
    }

    $scope.applyToAllDays = function(time) {
        for(var i = 0; i < $scope.week.length; i++) {
            $scope.avail_hours[$scope.week[i]].closed = time.closed;
            var timings = [];
            for(var j = 0; j < time.timings.length; j++) {
                var t = {
                    open: {
                        hr: time.timings[j].open.hr,
                        min: time.timings[j].open.min
                    },
                    close: {
                        hr: time.timings[j].close.hr,
                        min: time.timings[j].close.min
                    }
                };
                timings.push(t);
            }
            $scope.avail_hours[$scope.week[i]].timings = timings;
        }
    }

    $scope.toggleOutlets = function (fruit) {
        if ($scope.program.outlets.indexOf(fruit) === -1) {
            $scope.program.outlets.push(fruit);
        } else {
            $scope.program.outlets.splice($scope.program.outlets.indexOf(fruit), 1);
        }

    };

    $scope.outletQuery = function() {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        outletService.query($scope, $http, $location, user_id);
    };

    $scope.outletQuery = function() {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        outletService.query($scope, $http, $location, user_id);
    };

    $scope.outlet_for = {};
    $scope.$watch('outlet_for._timings', function () {
        if(!$scope.outlet_for._timings || $scope.outlet_for._timings === "NONE") {
            $scope.avail_hours = OPERATE_HOURS;
        }
        else {
            $scope.avail_hours = $scope.outlet_for._timings.business_hours;
        }
    }, true);

    $scope.toggleOutlets = function (fruit) {
        if ($scope.winback.outlets.indexOf(fruit) === -1) {
            $scope.winback.outlets.push(fruit);
        } else {
            $scope.winback.outlets.splice($scope.winback.outlets.indexOf(fruit), 1);
        }

    };
});