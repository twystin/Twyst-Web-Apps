'use strict';
twystConsole.factory('adminQrService', function ($http, $q) {

    var adminQrSvc = {};

    adminQrSvc.getQrs = function (outlet_id, q, pageNumber, totalCountPerPage) {
        q = q || '';
        var deferred = $q.defer();
        $http.get(
            '/api/v2/allqrs/'+ outlet_id +'?q=' + q + '&pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });        
        return deferred.promise;
    };

    adminQrSvc.changeValidity = function (data) {
        var deferred = $q.defer();
        $http({
            'method': 'post',
            'url': '/api/v2/changevalidity/qr',
            'data': data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return adminQrSvc;
});