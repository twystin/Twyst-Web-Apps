'use strict';
twystConsole.factory('adminUserService', function ($http, $q) {

    var adminUserSvc = {};

    adminUserSvc.getUsers = function (q, userRole, pageNumber, totalCountPerPage) {
        q = q || '';
        userRole = userRole || '';
        var deferred = $q.defer();
        $http.get(
            '/api/v2/allusers?q=' + q + '&role=' + userRole + '&pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return adminUserSvc;
});