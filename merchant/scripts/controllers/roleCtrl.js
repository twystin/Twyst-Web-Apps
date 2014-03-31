'use strict';

twystApp.controller('RoleCtrl', function ($scope, $location, authService) {
    
    if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    $scope.permission = true;

    var auth = authService.getAuthStatus();
    var role;
    console.log(auth);
    
    if(auth.role) {
        role = auth.role;
    }

    if(role > 4) {
        $scope.permission = false;
    }
    
});