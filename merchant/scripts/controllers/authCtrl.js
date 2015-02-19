'use strict';

twystApp.controller('AuthCtrl', function ($scope, $route, $http, $location, $routeParams, authService, toastSvc) {
    $scope.state = {};
    $scope.user = {};
    $scope.passwords_same = true;

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    };

    if (authService.isLoggedIn() && authService.getAuthStatus().role <= 4) {
        if($location.$$path) {
            $location.path($location.$$path);
        }
        else {
            $location.path('/dashboard/home');
        }
    };

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
        if($scope.user && $scope.user.name && $scope.user.pass) {
            var username = $scope.user.name.toLowerCase();
            authService.login($http, username, $scope.user.pass)
            .then(function (data) {
                if(data.info.role > 4) {
                    $location.path('/panel');
                }
                else {
                    $location.path('/dashboard/home');
                }
                toastSvc.showToast('success', data.message);
            }, function (err) {
                toastSvc.showToast('error', 'Incorrect Username or Password');
            });
        } else {
            toastSvc.showToast('error', 'Username and Password is required');
        }
    };

    $scope.logout = function () {
        authService.logout($http)
        .then(function (data) {
            $location.path('/');
            toastSvc.showToast('success', data.message);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    $scope.register = function () {
        var user = {
            username: $scope.user.name.toLowerCase(), 
            password: $scope.user.pass1, 
            email: $scope.user.email,
            role: 3
        };
        authService.register($http, user).then(function (data) {
            toastSvc.showToast('success', data.message);
            $location.path('/');
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };
});