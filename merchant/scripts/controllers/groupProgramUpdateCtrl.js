twystApp.controller('groupProgramUpdateCtrl', 
	function ($scope, $routeParams, $timeout, $http, $modal, $parse, $route, $location, authService, outletService, groupProgramService, proSupService, imageService, typeaheadService) {
			
		if (!authService.isLoggedIn()) {
	        $location.path('/');
	    }

	    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
	        $location.path('/panel');
	    }
	    $scope.group_program = {};

	    $scope.init = function(){
	    	var group_program_id = $routeParams.group_program_id;
	    	groupProgramService.fetchGroupProgram($scope, $http, $location, group_program_id);
	    	groupProgramService.fetchOutlets($scope, $http);
	    }

	    $scope.update = function (){
	    	$scope.group_program
	        var group_program_id = $routeParams.group_program_id;
	        groupProgramService.update($scope, $http, $location, group_program_id);
	    };

		$scope.toggleOutlets = function (fruit) {
	        if ($scope.group_program.outlets.indexOf(fruit) === -1) {
	            $scope.group_program.outlets.push(fruit);
	        } else {
	            $scope.group_program.outlets.splice($scope.group_program.outlets.indexOf(fruit), 1);
	        }
	    };
});
