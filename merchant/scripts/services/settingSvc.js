'use strict';
twystApp.factory('settingService', function ($log, $q, $http) {
    var settingSvc = {};
    settingSvc.createUser = function (user) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/auth/register/user',
            method: "POST",
            data: user
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    settingSvc.addInfo = function (user, username) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/auth/users/' + username,
            method: "PUT",
            data: user
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    settingSvc.query = function (user_id) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/getusers/' + user_id,
            method: "GET"
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    settingSvc.getProfileInfo = function (user_id) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/auth/users/' + user_id,
            method: "GET"
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    settingSvc.changePassword = function (pass) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/pass/change',
            method: "PUT",
            data: {
                password: pass
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    settingSvc.delete = function (username) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/auth/users/' + username,
            method: "DELETE"
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    return settingSvc;
});