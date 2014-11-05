twystApp.controller('groupProgramUpdateCtrl', 
	function ($scope, $routeParams, $timeout, $http, $modal, $parse, $route, $location, authService, outletService, groupProgService, proSupService, imageService, typeaheadService) {
			
		if (!authService.isLoggedIn()) {
	        $location.path('/');
	    }

	    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
	        $location.path('/panel');
	    }
	    $scope.group_program = {};
	    $scope.outlets = {};

	    $scope.init = function(){
	    	var group_program_id = $routeParams.group_program_id;
	    	groupProgService.fetchGroupProgram(group_program_id).then(function (data){
	    		$scope.group_program = data;
	    	});
	    	groupProgService.fetchOutlets().then(function (data){
	    		$scope.outlets = data;
	    	});
	    }

	    $scope.update = function (){
	    	$scope.group_program
	        var group_program_id = $routeParams.group_program_id;
	        groupProgService.update($scope.group_program).then(function (data){
	        	
	        });
	    };

		$scope.toggleOutlets = function (fruit) {
	        if ($scope.group_program.outlets.indexOf(fruit) === -1) {
	            $scope.group_program.outlets.push(fruit);
	        } else {
	            $scope.group_program.outlets.splice($scope.group_program.outlets.indexOf(fruit), 1);
	        }
	    };
});
