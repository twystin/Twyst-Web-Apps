'use strict';
twystApp.controller('SettingCtrl', function ($scope, $location, authService, settingService, outletService, toastSvc) {

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
        var user = {
            username: $scope.ref_user.username,
            password: $scope.ref_user.pass1,
            email: $scope.ref_user.email,
            outlet: $scope.ref_user.outlet,
            role: Number($scope.ref_user.role),
            account: getUserId(),
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

    $scope.addInfo = function (user) {
        var user_id = getUserId();
        settingService.addInfo(user, user_id).then(function (data) {
            toastSvc.showToast('success', data.message);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    function getUserId() {
        $scope.auth = authService.getAuthStatus();
        return $scope.auth._id;
    }

    $scope.query = function () {
        var user_id = getUserId();
        settingService.query(user_id).then(function (data) {
            $scope.users = JSON.parse(data.info);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    };

    $scope.click = function () {
        $scope.user = {};
    };

    $scope.getProfileInfo = function () {
        var user_id = getUserId();
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