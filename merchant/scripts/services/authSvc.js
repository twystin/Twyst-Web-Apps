'use strict';
twystApp.factory('authService', function ($rootScope, $cookieStore, $q) {
    var authSvc = {},
        _authStatus = {
            logged_in: false,
            errors: false,
            messages: null,
            user: null,
            name: null,
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
        _authStatus.name = $cookieStore.get('name');
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
    authSvc.login = function ($http, username, password) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/auth/login',
            method: "POST",
            data: {
                username: username,
                password: password
            }
        }).success(function (data) {
            setCookie(data);
            defer.resolve(data);
        }).error(function (data) {
            authSvc.setAuthStatus(false, true, "Incorrect Username/Password combination", null);
            defer.reject(data);
        });
        return defer.promise;
    };
    authSvc.logout = function ($http) {
        var deferred = $q.defer();
        $http.get('/api/v1/auth/logout')
        .success(function(success) {
            clearCookie();
            deferred.resolve(success);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    function setCookie(data) {
        _authStatus.logged_in = true;
        _authStatus.user = data.info.username;
        _authStatus._id = data.info._id;
        _authStatus.role = data.info.role;
        $cookieStore.put('logged_in', true);
        $cookieStore.put('user', data.info.username);
        $cookieStore.put('_id', data.info._id);
        $cookieStore.put('role', data.info.role);
        authSvc.broadcastChange();
        if(data.info.contact_person) {
            var name = data.info.contact_person.split(" ");
            name = name[0];
            $cookieStore.put('name', name);
            _authStatus.name = name;
        }
    }
    function clearCookie() {
        _authStatus = {};
        authSvc.broadcastChange();
        authSvc.setAuthStatus(false, null, null, null);
        $cookieStore.remove('logged_in');
        $cookieStore.remove('user');
        $cookieStore.remove('name');
        $cookieStore.remove('_id');
        $cookieStore.remove('role');
    }
    authSvc.register = function ($http, user) {
        var deferred = $q.defer();
        $http.post('/api/v1/auth/register/', user)
        .success(function(success) {
            authSvc.setAuthStatus(false, false, "Validation E-mail sent", success.info.username);
            deferred.resolve(success);
        }).error(function(error) {
            deferred.reject(error);
        });
        return deferred.promise;
    };
    authSvc.broadcastChange = function () {
        $rootScope.$broadcast('handleChangedAuthStatus');
    };
    return authSvc;
});