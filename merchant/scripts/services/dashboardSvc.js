'use strict';
twystApp.factory('dashService', function ($http, $q) {
    var dashSvc = {};

    dashSvc.getDashBoardInfo = function () {
        var defer = $q.defer();
        $http.get(
            '/api/v3/dashboard'
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    dashSvc.getRoi = function () {
        var defer = $q.defer();
        $http.get(
            '/api/v3/roi'
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    return dashSvc;
});