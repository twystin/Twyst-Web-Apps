'use strict';
twystApp.factory('groupProgService', function ($http, $q) {
  var groupProgService = {};
  groupProgService.create = function (group_program) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/group_program/',
            method: "POST",
            data: group_program
        }).success(function (data, status) {
            deferred.resolve(data.info);
        }).error(function (data, status) {
            deferred.resolve(data);
        });
        return deferred.promise;
    };

    groupProgService.fetchOutlets = function(){
        var deferred = $q.defer();
        $http.get('/api/v3/outlets').success(function(data, status){
            deferred.resolve(data.info);
        }).error(function(data, status){
            deferred.resolve(data);
        });
        return deferred.promise;
    }

    groupProgService.fetchGroupProgram = function(group_program_id){
        var deferred = $q.defer();
        $http({
            url: '/api/v2/group_program/' + group_program_id,
            method: "GET"
        }).success(function(data, status){
            deferred.resolve(data.info);
        }).error(function(data, status){
            deferred.resolve(data);
        });
        return deferred.promise;
    }    
    groupProgService.update = function(group_program){
        var deferred = $q.defer();
        $http({
            url: '/api/v1/group_program/update/',
            method: "PUT",
            data: group_program
        }).success(function (data, status) {
            deferred.resolve(data.info);
        }).error(function (data, status) {
            deferred.resolve(data);
        });
        return deferred.promise;
    }
  return groupProgService;
});