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

    dataSvc.getData = function (post_data) {

        var deferred = $q.defer();

        $http.post(
            '/api/v2/outlets/data', post_data
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return dataSvc;
});