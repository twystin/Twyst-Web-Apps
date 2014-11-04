'use strict';
twystApp.controller('GroupProgramCtrl', ['$http','$scope', 'authService','groupProgramService',
    function ($http, $scope, authService, groupProgramService) {
    if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }
    $scope.auth = authService.getAuthStatus();

    $scope.init = function(){
        $scope.group_program={};
        $scope.group_program.name='';
        $scope.group_program.description='';
        $scope.group_program.image='';
        $scope.group_program.outlets=[];
        $scope.group_program.checkin_discount=[{
            checkin_count:'',
            discount:''
        }];
        $scope.outlets = {            
        };
        groupProgramService.fetchOutlets($scope, $http);
    }

    $scope.newCheckinDiscount = function($event, index){
        if($scope.group_program.checkin_discount.length < 5){
            $scope.group_program.checkin_discount.push({
                checkin_count:'',
                discount:''
            })
        }
    }

    $scope.create = function() {
        groupProgramService.create($scope, $http);
        //groupProgramService.fetchOutlets($scope, $http);
    }

    $scope.update = function(){
        groupProgramService.update($scope, $http);
    }

    $scope.toggleOutlets = function (fruit) {
        if ($scope.group_program.outlets.indexOf(fruit) === -1) {
            $scope.group_program.outlets.push(fruit);
        } else {
            $scope.group_program.outlets.splice($scope.group_program.outlets.indexOf(fruit), 1);
        }
    };
}]);