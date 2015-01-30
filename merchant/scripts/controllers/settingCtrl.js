'use strict';

twystApp.controller('SettingCtrl', function ($scope, $http, $location, $window, $routeParams, authService, settingService, outletService, $log, toastSvc) {

    $scope.ref_passwords_same = true;
    $scope.user = {};
    $scope.ref_user = {};
   
    $scope.tabs = [
        {active: true, name: 'info', title: 'Your Info'},
        {active: false, name: 'create', title: 'Create user'},
        {active: false, name: 'edit', title: 'Manage user'},
        {active: false, name: 'password', title: 'Change password'},
        {active: false, name: 'deactivate', title: 'Deactivate account'}
    ];

    if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }

    $scope.createUser = function () {
        settingService.createUser(getRefUser()).then(function (data) {
            toastSvc.showToast('success', data.message);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    function getRefUser() {
        $scope.auth = authService.getAuthStatus();
        var user = {
            username: $scope.ref_user.username,
            password: $scope.ref_user.pass1,
            email: $scope.ref_user.email,
            outlet: $scope.ref_user.outlet,
            role: Number($scope.ref_user.role),
            account: $scope.auth._id,
            validated: {
                role_validated: true,
                email_validated: {
                    status: true,
                    token: null
                }
            }
        };
        return user;
    }

    $scope.checkRefPassword = function () {
        $scope.ref_passwords_same = ($scope.ref_user.pass1 === $scope.ref_user.pass2);
    };

    $scope.addInfo = function (user) {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        settingService.addInfo($scope, $http, $location, user, user_id);
    };

    $scope.query = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        settingService.query(user_id).then(function (data) {
            $scope.users = JSON.parse(data.info);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    $scope.editUser = function (user) {
        $scope.ref_user = user;
        $scope.tabs[1].active = true;
    };

    $scope.edit = function () {
        var username = $routeParams.username,
            request = $http.get('/api/v1/auth/users/' + username);
        return request.then(function (response) {
            var user = JSON.parse(response.data.info)[0];
            $scope.user.name = user.username;
        }, function (response) {
            $log.warn(response);
        });
    };

    $scope.click = function () {
        $scope.user = {};
    };

    $scope.updateUser = function (user) {
        settingService.update($scope, $http, $location, user);
    };

    $scope.getProfileInfo = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        settingService.getProfileInfo(user_id).then(function (data) {
            $scope.user = JSON.parse(data.info)[0];
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    $scope.changePassword = function (user) {
        var pass = $scope.user.pass1;
        settingService.changePassword(pass).then(function (data) {
            toastSvc.showToast('success', data.message);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    $scope.delete = function (user) {
       $scope.users = _($scope.users).reject(function(el) {return el === user });
        settingService.delete(user.username).then(function (data) {
            toastSvc.showToast('success', data.message);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    $scope.outletQuery = function() {
        outletService.query().then(function (data) {
            $scope.outlets = data.info;
            $scope.all_outlets = data.info;
        }, function (err) {
            console.log(err);
        })
    };
});