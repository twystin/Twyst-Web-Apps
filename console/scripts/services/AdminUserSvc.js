'use strict';
twystConsole.factory('adminUserService', function ($http, $q) {

    var adminUserSvc = {};
    adminUserSvc.getUsers = function (q, userRole, pageNumber, totalCountPerPage, sortParam, sortOrder) {
        sortParam = sortParam || "phone";
        sortOrder = sortOrder || 1;
        q = q || '';
        userRole = userRole || '';
        var deferred = $q.defer();
        $http.get(
            '/api/v2/allusers?q=' + q + '&role=' + userRole + '&pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage + '&sortBy=' + sortParam + '&sortOrder=' + sortOrder
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    adminUserSvc.getUser = function (username) {
        var deferred = $q.defer();
        $http.get(
            '/api/v2/alluser/' + username
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });        
        return deferred.promise;
    };

    adminUserSvc.updateUser = function (username, user) {
        var deferred = $q.defer();
        $http.put(
            '/api/v2/alluser/' + username, user
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });        
        return deferred.promise;
    };

    adminUserSvc.getTimeline = function (user_phone) {
        var deferred = $q.defer();
        $http.post(
            '/api/v2/alluser/', user_phone
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });        
        return deferred.promise;
    };

    return adminUserSvc;
});