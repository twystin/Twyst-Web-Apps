'use strict';

function DataCtrl($scope, $timeout, dataService) {


	$scope.all_cities = ['Gurgaon','Delhi','Mumbai','Bangalore'];
	$scope.cities = [];

	$scope.all_outlets = [];
	$scope.outlets = [];

	$scope.range = {
		'start': Date.now() - 7 * 24 * 60 * 60 * 1000,
		'end': Date.now()
	};

	$scope.getMerchants = function () {
		dataService.getMerchants().then(function(data) {
    		if(data.status !== "error") {
    			$scope.merchants = data.info;
    		}
    		else {
    			$scope.merchants = [];
    		}
    	});
	};

	$scope.toggleCity = function (fruit) {
        if ($scope.cities.indexOf(fruit) === -1) {
            $scope.cities.push(fruit);
        } else {
            $scope.cities.splice($scope.cities.indexOf(fruit), 1);
        }
    };

    $scope.toggleOutlet = function (fruit) {
        if ($scope.outlets.indexOf(fruit) === -1) {
            $scope.outlets.push(fruit);
        } else {
            $scope.outlets.splice($scope.outlet.indexOf(fruit), 1);
        }
    };

    $scope.$watch('cities', function() {
    	if($scope.cities.length === 0) {
          $timeout(function() {
            $scope.cities = $scope.cities.concat($scope.all_cities);  
          },0);
        }
        if($scope.selected_merchant && $scope.cities.length > 0) {
        	getOutlets($scope.selected_merchant, $scope.cities);
        }
    	
    }, true);

    $scope.$watch('selected_merchant', function () {
    	if($scope.selected_merchant && $scope.cities.length > 0) {
        	getOutlets($scope.selected_merchant, $scope.cities);
        }
    })

    function getOutlets(merchant, cities) {
    	dataService.getOutlets(merchant, cities).then(function(data) {
    		if(data.status !== "error") {
    			$scope.all_outlets = data.info;
    			$scope.outlets = getID(data.info);
    		}
    		else {
    			$scope.outlets = [];
    			$scope.all_outlets = [];
    		}
    	});
    }

    function getID(outlets) {

    	var id = [];
    	var outlets = outlets || [];
    	if(outlets.length < 1) {
    		return id;
    	};
    	
    	angular.forEach(outlets, function(outlet){
    		id.push(outlet._id);
    	});

    	return id;
    }

    $scope.$watch('cities + outlets + range.start + range.end', function () {
    	
    	if($scope.cities.length > 0 
    		&& $scope.outlets.length > 0
    		&& $scope.range.start
    		&& $scope.range.end) {

    		getData();
    	}
    }, true);

    function getData() {
    	var post_data = {
    		outlets : $scope.outlets,
    		range : {}
    	}

    	post_data.range.start = new Date($scope.range.start).setHours(0,0,1);
		post_data.range.end = new Date($scope.range.end).setHours(23,59,59);
		
    	dataService.getData(post_data).then(function(data) {
    		if(data.status && data.status !== "error") {
    			
    		}
    		else {
    			
    		}
    		console.log(data)
    	});
    }
};