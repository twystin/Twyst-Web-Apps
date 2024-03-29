'use strict';
twystApp.factory('programService', function ($rootScope, $log, $q, $http) {
    var programSvc = {},
        _programSvcMessages = {
            status: null,
            data: null
        },
        setProgramSvcMessages = function (status, data) {
            _programSvcMessages.status = status;
            _programSvcMessages.data = data;
            programSvc.broadcastChange();
        };
    programSvc.getProgramSvcMessages = function () {
        return _programSvcMessages;
    };

    programSvc.getRewards = function (program_id) {
        var defer = $q.defer();
        $http({
            url: '/api/v3/reward_details/' + program_id,
            method: "GET"
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };

    programSvc.query = function () {
        var deferred = $q.defer();
        $http.get('/api/v1/programs')
        .success(function(success) {
            deferred.resolve(success);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    
    programSvc.onlyPrograms = function ($scope, $http, $location, user_id) {
        $http.get('/api/v1/programs/only/' + user_id).success(function (data) {
            $scope.programs = JSON.parse(data.info);
        });
    };
    programSvc.read = function ($scope, $http, $location, program_id) {
        $scope.participating_outlets = [];
        $http.get('/api/v1/programs/view/' + program_id)
        .success(function(data) {
            if(data.info.length > 0) {
                $scope.program = data.info[0];
                if($scope.program.outlets.length > 0) {
                    for (var i = 0; i < $scope.program.outlets.length; i++) {
                        $scope.participating_outlets.push($scope.program.outlets[i]._id);
                    }
                }
            }
        }).error(function (data) {
            console.log(data);
        });
        
    };
    programSvc.create = function ($scope, $http, $location) {
        $http({
            url: '/api/v1/programs',
            method: "POST",
            data: $scope.program
        }).success(function (data, status) {
            setProgramSvcMessages(status, data);
            $location.path("/offers");
        }).error(function (data, status) {
            setProgramSvcMessages(status, data);
        });
    };
    programSvc.update = function ($scope, $http, $location, program_title) {
        $http({
            url: '/api/v1/programs/' + program_title,
            method: "PUT",
            data: $scope.program
        }).success(function (data, status) {
            setProgramSvcMessages(status, data);
        }).error(function (data, status) {
            setProgramSvcMessages(status, data);
        });
    };
    programSvc.delete = function ($scope, $http, $location, program_id, $route, $modalInstance) {
        $http({
            url: '/api/v1/programs/' + program_id,
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
    programSvc.broadcastChange = function () {
        $rootScope.$broadcast('handleChangedProgramSvcMessages');
    };
    return programSvc;
});