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

    outletSvc.create = function ($scope, $http) {
        $http({
            url: '/api/v1/outlets',
            method: "POST",
            data: $scope.outlet
        }).success(function (data, status) {
            $scope.outlet_created = true;
            $log.warn($scope.outlet);
            outletSvc.setOutletSvcMessages(status, data);
        }).error(function (data, status) {
            outletSvc.setOutletSvcMessages(status, data);
            $scope.tabs[0].active = true;
        });
    };

    outletSvc.update = function ($scope, $http, $location, outlet_id) {
        $http({
            url: '/api/v1/outlets/' + outlet_id,
            method: "PUT",
            data: $scope.outlet
        }).success(function (data, status) {
            outletSvc.setOutletSvcMessages(status, data.message);
            $location.path('/outlets/');
        }).error(function (data, status) {
            outletSvc.setOutletSvcMessages(status, data);
            $scope.tabs[0].active = true;
        });
    };

    outletSvc.delete = function ($scope, $http, $location, outlet_title, $route, $modalInstance) {
        $http({
            url: '/api/v1/outlets/' + outlet_title,
            method: "DELETE"
        }).success(function (data) {
            $log.warn(data);
            $route.reload();
            $modalInstance.dismiss('cancel');
        }).error(function (data, status) {
            $log.warn(data);
            $scope.status = status;
            $scope.message = data.message;
        });
    };

    outletSvc.broadcastChange = function () {
        $rootScope.$broadcast('handleChangedOutletSvcMessages');
    };

    return outletSvc;
});