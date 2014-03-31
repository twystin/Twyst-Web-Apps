'use strict';

twystApp.controller('AuthCtrl', function ($scope, $route, $http, $location, $routeParams, authService) {
    $scope.state = {};
    $scope.user = {};
    $scope.passwords_same = true;

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }

    // Private functions
    var update_auth = function () {
        $scope.auth = authService.getAuthStatus();
        if ($scope.auth.logged_in === true) {
            $scope.auth.status = 'in';
        } else {
            $scope.auth.status = 'out';
        }
    };

    $scope.togglePassword = function () {
        $scope.state.reset_password = !$scope.state.reset_password;
    };

    update_auth();
    $scope.$on('handleChangedAuthStatus', function () {
        update_auth();
    });

    $scope.login = function () {
        if ($scope.user.name === undefined) {
            $scope.missing_message = "Username missing";
        } else if ($scope.user.pass === undefined) {
            $scope.missing_message = "Password missing";
        } else {
            authService.login($scope, $http, $location);
        }
    };

    $scope.logout = function () {
        $scope.user = null;
        authService.logout($scope, $http, $location);
    };

    $scope.register = function () {
        authService.register($scope, $http, $location);
    };

    $scope.createUser = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        $scope.new_user = {
            username: $scope.user.name,
            password: $scope.user.pass1,
            email: $scope.user.email,
            role: $scope.user.role,
            account: user_id,
            validated: {
                role_validated: true,
                email_validated: {
                    status: true,
                    token: String
                }
            }
        };
        authService.createUser($scope, $http, $location);
    };

    $scope.checkPassword = function () {
        $scope.passwords_same = ($scope.user.pass1 === $scope.user.pass2);
    };

    $scope.addInfo = function (user) {
        $scope.auth = authService.getAuthStatus();
        var username = $scope.auth.user;
        $http({
            url: '/api/v1/auth/users/' + username,
            method: "PUT",
            data: user
        }).success(function (data, status, headers, config) {
            $scope.message = data.message;
            $location.path('/manage/user');
        }).error(function (data, status, headers, config) {
            $scope.message = data.message;
            $location.path('/manage/user');
        });
    };

    $scope.query = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id,
            request = $http.get('/api/v1/getusers/' + user_id);
        return request.then(function (response) {
            $scope.users = JSON.parse(response.data.info);
        }, function (response) {
            //TODO: Handle error case
        });
    };
    $scope.edit = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id,
            request = $http.get('/api/v1/auth/users/' + user_id);
        return request.then(function (response) {
            var user = JSON.parse(response.data.info)[0];
            $scope.user.name = user.username;
            $scope.user.pass1 = user.password;
            $scope.user.pass2 = user.password;
        }, function (response) {
            //TODO: Handle error case
        });
    };

    $scope.update = function (user) {
        $http({
            url: '/api/v1/auth/users/' + user.name,
            method: "PUT",
            data: user
        }).success(function (data, status, headers, config) {
            $scope.message = data.message;
            $location.path('/users');
        }).error(function (data, status, headers, config) {
            $scope.message = data.message;
            $location.path('/users');
        });
    };

    $scope.changePassword = function (user) {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        $http({
            url: '/api/v1/pass/change/' + user_id,
            method: "PUT",
            data: {password: user.pass1}
        }).success(function (data, status, headers, config) {
            $scope.message = data.message;
            $location.path('/');
        }).error(function (data, status, headers, config) {
            $scope.message = data.message;
        });
    };

    $scope.delete = function (user) {
        $http({
            url: '/api/v1/auth/users/' + user.username,
            method: 'DELETE',
            data: user
        }).success(function(data, status, headers, config) {
            $scope.message = data.message;
            $route.reload();
        }).error(function(data,status,headers,config) {
            $scope.message = data.message;
            $location.path('/users');
        });
    };

    $scope.getResetPasswordEmail = function (user) {
        authService.sendResetEmailService($http, $location, $scope, user.username);
    };

    $scope.resetPassword = function () {
        var token = $routeParams.token;
        authService.ResetCompleteService($http, $location, $scope, token);
    };

    $scope.setEmailValidated = function () {
        var token = $routeParams.token;
        authService.emailValidationCompleteService($http, $location, $scope, token);
    };
});