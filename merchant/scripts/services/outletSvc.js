'use strict';
twystApp.factory('outletService', function ($rootScope, $q, $http) {
    var outletSvc = {};
    var _outletSvcMessages = {
        status: null,
        data: null
    };
    outletSvc.setOutletSvcMessages = function (status, data) {
        _outletSvcMessages.status = status;
        _outletSvcMessages.data = data;
        outletSvc.broadcastChange();
    };

    outletSvc.getOutletSvcMessages = function () {
        return _outletSvcMessages;
    };

    outletSvc.query = function () {
        var deferred = $q.defer();
        $http.get('/api/v1/outlets')
        .success(function(success) {
            deferred.resolve(success);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    outletSvc.read = function ($scope, $http, $location, outlet_title) {
        $scope.outlet = {};
        var request = $http.get('/api/v1/outlets/' + outlet_title);
        return request.then(function (response) {
            var outlet = JSON.parse(response.data.info)[0];
            $scope.outlet.basics.name = outlet.basics.name;
        }, function (response) {
            $log.warn(response);
        });
    };

    outletSvc.create = function (outlet) {
        var deferred = $q.defer();
        $http.post('/api/v1/outlets', outlet)
        .success(function(success) {
            deferred.resolve(success);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    outletSvc.update = function (outlet) {
        var deferred = $q.defer(),
            outlet_id = outlet._id;
        $http.put('/api/v1/outlets/' + outlet_id, outlet)
        .success(function(success) {
            deferred.resolve(success);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    outletSvc.delete = function (outlet_id) {
        var deferred = $q.defer();
        $http.delete('/api/v1/outlets/' + outlet_id)
        .success(function(success) {
            deferred.resolve(success);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };

    outletSvc.broadcastChange = function () {
        $rootScope.$broadcast('handleChangedOutletSvcMessages');
    };

    return outletSvc;
});