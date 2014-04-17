'use strict';
twystApp.factory('authService', function ($rootScope, $cookieStore, $log) {
    var authSvc = {},
        _authStatus = {
            logged_in: false,
            errors: false,
            messages: null,
            user: null,
            role: null,
            _id: null,
            remember_me: false
        },
        user = $cookieStore.get('user'),
        _id = $cookieStore.get('_id'),
        role = $cookieStore.get('role');

    if ($cookieStore.get('logged_in') === true) {
        _authStatus.logged_in = true;
        _authStatus.user = $cookieStore.get('user');
        _authStatus._id = $cookieStore.get('_id');
        _authStatus.role = $cookieStore.get('role');
    }
    authSvc.setAuthStatus = function (logged_in, errors, messages, user) {
        _authStatus = {
            logged_in: logged_in,
            errors: errors,
            messages: messages,
            user: user
        };
        authSvc.broadcastChange();
    };
    authSvc.getAuthStatus = function () {
        return _authStatus;
    };
    authSvc.isLoggedIn = function () {
        return $cookieStore.get('logged_in') && $cookieStore.get('user');
    };
    authSvc.login = function ($scope, $http, $location) {
        $http.post('/api/v1/auth/login', {username: $scope.user.name, password: $scope.user.pass})
            .success(function (data) {
                if ($scope.user.remember_me) {
                    _authStatus.remember_me = true;
                }
                _authStatus.logged_in = true;
                _authStatus.user = data.info.username;
                _authStatus._id = data.info._id;
                _authStatus.role = data.info.role;
                $cookieStore.put('logged_in', true);
                $cookieStore.put('user', data.info.username);
                $cookieStore.put('_id', data.info._id);
                $cookieStore.put('role', data.info.role);
                authSvc.broadcastChange();
                
                if(data.info.role > 4) {
                    $location.path('/panel');
                }
                else {
                    $location.path('/dashboard/home');
                }
            }).error(function () {
                authSvc.setAuthStatus(false, true, "Incorrect Username/Password combination", null);
                $location.path('/');
            });
    };
    authSvc.logout = function ($scope, $http, $location) {
        $cookieStore.remove('logged_in');
        $cookieStore.remove('user');
        $cookieStore.remove('_id');
        $cookieStore.remove('role');
        authSvc.setAuthStatus(false, null, null, null);
        $http.get('/api/v1/auth/logout')
            .success(function () {
                _authStatus = {};
                authSvc.broadcastChange();
                $location.path('/');
            })
            .error(function (data, status, header, config) {
                //TODO: Handle the error
            });
    };
    authSvc.register = function ($scope, $http, $location) {
        var request = $http.post('/api/v1/auth/register', {username: $scope.user.name, password: $scope.user.pass1, email: $scope.user.email});
        return request.then(function (response) {
            if (response.data.status === "success") {
                authSvc.setAuthStatus(false, false, "Validation E-mail sent", response.data.info.username);
                $location.path('/');
            } else {
                authSvc.setAuthStatus(false, true, response.data, null);
            }
        }, function (response) {
            authSvc.setAuthStatus(false, true, response.data, null);
        });
    };
    authSvc.createUser = function ($scope, $http) {
        var request = $http.post('/api/v1/auth/register/user', $scope.new_user);
        return request.then(function (response) {
            if (response.data.status === "success") {
                authSvc.setAuthStatus(false, false, "Created a user", response.data.info.username);
            } else {
                authSvc.setAuthStatus(false, true, response.data, null);
            }
        }, function (response) {
            authSvc.setAuthStatus(false, true, response.data, null);
        });
    };
    authSvc.broadcastChange = function () {
        $rootScope.$broadcast('handleChangedAuthStatus');
    };
    authSvc.emailValidationCompleteService = function ($http, $location, $scope, token) {
        var request = $http.put('/api/v1/auth/validate/email/' + token);
        return request.then(function (response) {
            if (response.data.status === "success") {
                authSvc.setAuthStatus(false, false, "E-mail validation complete.", response.data.info.username);
                $location.url('/');
            } else {
                authSvc.setAuthStatus(false, false, "E-mail not validated. Please try again.", response.data.info.username);
                $location.url('/');
            }
        });
    };
    authSvc.ResetCompleteService = function ($http, $location, $scope, token) {
        var request = $http.put('/api/v1/pass/reset/' + token, { password: $scope.user.pass1 });
        return request.then(function (response) {
            if (response.data.status === "success") {
                authSvc.setAuthStatus(false, false, "Password reset is complete. Please login with new password.", response.data.info.username);
                $location.url('/');
            } else {
                authSvc.setAuthStatus(false, false, "Validation failed ", response.data.info.username);
            }

        });
    };
    authSvc.sendResetEmailService = function ($http, $location, $scope, uname) {
        var request = $http.put('/api/v1/pass/forgot/' + uname);
        return request.then(function (response) {
            if (response.data.status === "success") {
                authSvc.setAuthStatus(false, false, "E-mail sent. Please check your e-mail, and follow the link to reset password.", response.data.info.username);
                $location.url('/');
            } else {
                authSvc.setAuthStatus(false, false, "E-mail not sent. ", response.data.info.username);
            }
        });
    };
    return authSvc;
});