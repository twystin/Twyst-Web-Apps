twystApp.controller('groupProgramUpdateCtrl', 
	function ($scope, $routeParams, authService, outletService, groupProgService) {
			
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

	    $scope.removeCD = function (index) {
        	$scope.group_program.checkin_discount.splice(index, 1);
    	};

    	$scope.newCheckinDiscount = function($event, index){
	        if($scope.group_program.checkin_discount.length < 5){
	            $scope.group_program.checkin_discount.push({
	                checkin_count:'',
	                discount:''
	            })
	        }
	    }
});
