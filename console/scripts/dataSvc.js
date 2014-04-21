'use strict';
twystConsole.factory('dataService', function ($http, $q) {

    var dataSvc = {};

    dataSvc.getMerchants = function (cities) {

        var deferred = $q.defer();

        $http.get(
            '/api/v2/merchants'
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    dataSvc.getOutlets = function (merchant, cities) {

        var deferred = $q.defer();

        $http.get(
            '/api/v2/outlets/city/' + merchant + '/' + cities
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    dataSvc.getPrograms = function (outlets) {

        var deferred = $q.defer();

        $http.get(
            '/api/v2/admin/programs/' + outlets
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    dataSvc.getData = function (program, start, end) {
        
        var deferred = $q.defer();

        $http.get(
            '/api/v2/admin/data/'+ program + '/' + start + '/' + end
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return dataSvc;
});