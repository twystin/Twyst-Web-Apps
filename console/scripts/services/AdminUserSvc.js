'use strict';
twystConsole.factory('adminUserService', function ($http, $q) {

    var adminUserSvc = {};

    adminUserSvc.getUsers = function (q, pageNumber, totalCountPerPage) {
        q = q || '';
        var deferred = $q.defer();
        $http.get(
            '/api/v2/allusers?q=' + q + '&pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return adminUserSvc;
});