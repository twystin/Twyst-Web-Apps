'use strict';
twystConsole.factory('adminOutletService', function ($http, $q) {

    var adminOutletSvc = {};
    adminOutletSvc.getOutlets = function (q, pageNumber, totalCountPerPage) {
        q = q || '';
        var deferred = $q.defer();
        $http.get(
            '/api/v2/alloutlets?q=' + q + '&pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage 
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    adminOutletSvc.changeStatus = function (outlet) {
        var deferred = $q.defer();
        $http({
            'method': 'post',
            'url': '/api/v2/changestatus/outlet',
            'data': {outlet: outlet}
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    adminOutletSvc.changeFeatured = function (data) {
        var deferred = $q.defer();
        $http({
            'method': 'post',
            'url': '/api/v2/changefeatured/outlet',
            'data': data
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return adminOutletSvc;
});