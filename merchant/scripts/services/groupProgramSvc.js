'use strict';
twystApp.factory('groupProgramService', function ($rootScope, $log, $q, $http) {
    var groupProgramSvc = {};

    groupProgramSvc.create = function ($scope, $http) {
        $http({
            url: '/api/v1/group_program/',
            method: "POST",
            data: $scope.group_program
        }).success(function (data, status) {
            console.log("group program saved");
        }).error(function (data, status) {
            console.log("error");
        });
    };

    groupProgramSvc.fetchOutlets = function($scope, $http){
        $http.get('/api/v3/outlets').success(function(data, status){
            $scope.outlets = data.info;
            console.log("outlets fetched");
        }).error(function(data, status){
            console.log("error");
        })
    }

    groupProgramSvc.fetchGroupProgram = function($scope, $http, $location, group_program_id){
        $http({
            url: '/api/v2/group_program/' + group_program_id,
            method: "GET"
        }).success(function(data, status){
            $scope.group_program = data.info;
            console.log("Group Program Fetched");
        }).error(function(data, status){
            console.log("error");
        })
    }    
    groupProgramSvc.update = function($scope, $http){
        $http({
            url: '/api/v1/group_program/update/',
            method: "PUT",
            data: $scope.group_program
        }).success(function (data, status) {
            console.log("group program edited");
        }).error(function (data, status) {
            console.log("error");
        });
    }
    return groupProgramSvc;
});