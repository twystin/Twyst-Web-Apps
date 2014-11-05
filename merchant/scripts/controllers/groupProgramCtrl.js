'use strict';
twystApp.controller('GroupProgramCtrl', ['$http','$scope', 'authService','groupProgService',
    function ($http, $scope, authService, groupProgService) {
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
        groupProgService.fetchOutlets().then(function (data) {
            $scope.outlets = data;
        });
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
        groupProgService.create($scope.group_program).then(function (data){

        });
        //groupProgramService.fetchOutlets($scope, $http);
    }

    $scope.update = function(){
        groupProgService.update($scope.group_program).then(function (data){
            
        });
    }

    $scope.toggleOutlets = function (fruit) {
        if ($scope.group_program.outlets.indexOf(fruit) === -1) {
            $scope.group_program.outlets.push(fruit);
        } else {
            $scope.group_program.outlets.splice($scope.group_program.outlets.indexOf(fruit), 1);
        }
    };
}]);