'use strict';

twystApp.controller('SettingCtrl', function ($scope, $http, $location, $window, $routeParams, authService, settingService, outletService, $log) {

    // Variable declarations
    $scope.passwords_same = true;
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
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        $scope.new_user = {
            username: $scope.ref_user.username,
            password: $scope.ref_user.pass1,
            email: $scope.ref_user.email,
            outlet: $scope.ref_user.outlet,
            role: Number($scope.ref_user.role),
            account: user_id,
            validated: {
                role_validated: true,
                email_validated: {
                    status: true,
                    token: String
                }
            }
        };

        settingService.createUser($scope, $http, $location, $window);
    };

    $scope.checkPassword = function () {
        $scope.passwords_same = ($scope.user.pass1 === $scope.user.pass2);
    };

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
        settingService.query($scope, $http, $location, user_id);
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
        settingService.getProfileInfo($scope, $http, $location, user_id);
    };

    $scope.changePassword = function (user) {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        settingService.changePassword($scope, $http, $location, user, user_id);
    };

    $scope.delete = function (user) {
       $scope.users = _($scope.users).reject(function(el) {return el === user });
        settingService.delete($scope, $http, $location, user);
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