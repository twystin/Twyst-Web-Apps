'use strict';
twystApp.factory('settingService', function ($log, $q, $http) {
    var settingSvc = {};
    settingSvc.createUser = function ($scope, $http, $location, $window) {
        $log.warn($scope.new_user);
        var request = $http.post('/api/v1/auth/register/user', $scope.new_user);
        return request.then(function () {
            settingSvc.query($scope, $http, $location, $scope.new_user.account);
            $scope.tabs[2].active = true;
        }, function (response) {
            $scope.message = "Error in user creation";
        });
    };
    settingSvc.addInfo = function ($scope, $http, $location, user, username) {
        $http({
            url: '/api/v1/auth/users/' + username,
            method: "PUT",
            data: user
        }).success(function (data) {
            $scope.message = data.message;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };
    settingSvc.query = function ($scope, $http, $location, user_id) {
        var request = $http.get('/api/v1/getusers/' + user_id);
        return request.then(function (response) {
            $scope.users = JSON.parse(response.data.info);
            $log.warn($scope.users);
        }, function (response) {
            //TODO: Handle error case
        });
    };
    settingSvc.getProfileInfo = function ($scope, $http, $location, user_id) {
        $http({
            url: '/api/v1/auth/users/' + user_id,
            method: "GET"
        }).success(function (data) {
            $scope.user = JSON.parse(data.info)[0];
            // $log.warn(data.info);
            // $log.warn($scope.user);
        }).error(function (data, status, headers, config) {
            //TODO: Handle error case
        });
    };
    settingSvc.update = function ($scope, $http, $location, user) {
        $http({
            url: '/api/v1/auth/users/' + user._id,
            method: "PUT",
            data: user
        }).success(function (data) {
            $scope.message = data.message;
            $scope.tabs[2].active = true;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };
    settingSvc.changePassword = function (pass) {
        var deferred = $q.defer();
        $http({
            url: '/api/v1/pass/change',
            method: "PUT",
            data: {
                password: pass
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    settingSvc.delete = function ($scope, $http, $location, user) {
        $http({
            url: '/api/v1/auth/users/' + user.username,
            method: 'DELETE',
            data: user
        }).success(function (data) {
            $scope.message = data.message;
        }).error(function (data) {
            $scope.message = data.message;
        });
    };
    return settingSvc;
});