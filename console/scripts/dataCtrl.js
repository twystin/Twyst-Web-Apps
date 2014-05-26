'use strict';

function DataCtrl($scope, $timeout, $location, dataService, authService) {

    if (!authService.isLoggedIn()) {
        $location.path('/');
    }


	$scope.all_cities = ['Gurgaon','Delhi','Mumbai','Bangalore'];
	$scope.cities = [];
    $scope.selected_merchants = [];
    $scope.program_analytics = false;

	$scope.all_outlets = [];
	$scope.outlets = [];

	$scope.range = {
		'start': Date.now() - 6 * 24 * 60 * 60 * 1000,
		'end': Date.now()
	};

	$scope.getMerchants = function (cities) {
		dataService.getMerchants(cities).then(function(data) {
    		if(data.status !== "error") {
    			$scope.merchants = data.info;
                $scope.selected_merchants = data.info;
    		}
    		else {
    			$scope.merchants = [];
                $scope.selected_merchants = [];
    		}
    	});
	};

    $scope.toggleMerchants = function (fruit) {
        if ($scope.selected_merchants.indexOf(fruit) === -1) {
            $scope.selected_merchants.push(fruit);
        } else {
            $scope.selected_merchants.splice($scope.selected_merchants.indexOf(fruit), 1);
        }
    };


    $scope.$watch('selected_merchants', function() {
        if($scope.selected_merchants.length === 0) {
          $timeout(function() {
            $scope.selected_merchants = $scope.selected_merchants.concat($scope.merchants)
          },0);
        };

        if($scope.selected_merchants.length > 0 && $scope.cities.length > 0) {
            getOutlets($scope.selected_merchants, $scope.cities);
        };
    }, true);

    $scope.toggleCity = function (fruit) {
        if ($scope.cities.indexOf(fruit) === -1) {
            $scope.cities.push(fruit);
        } else {
            $scope.cities.splice($scope.cities.indexOf(fruit), 1);
        }
    };

    $scope.$watch('cities', function() {
        if($scope.cities.length === 0) {
          $timeout(function() {
            $scope.cities = $scope.cities.concat($scope.all_cities);  
          },0);
        };
        if($scope.selected_merchants.length > 0 && $scope.cities.length > 0) {
            getOutlets($scope.selected_merchants, $scope.cities);
        };       
    }, true);

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
    };

    $scope.toggleOutlet = function (fruit) {
        if ($scope.outlets.indexOf(fruit) === -1) {
            $scope.outlets.push(fruit);
        } else {
            $scope.outlets.splice($scope.outlets.indexOf(fruit), 1);
        }
    };

    $scope.$watch('outlets', function () {
        if($scope.outlets.length === 0) {
          $timeout(function() {
            $scope.outlets = $scope.outlets.concat($scope.all_outlets);  
          },0);
        };

        if($scope.outlets.length > 0) {
            getPrograms($scope.outlets);
            getAnonData($scope.outlets);
        }
    }, true);

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
    };

    function getPrograms(outlets) {
        
    	dataService.getPrograms(outlets).then(function(data) {
    		if(data.status !== "error") {
    			$scope.programs = data.info;
    		}
    		else {
    			$scope.programs = [];
    		}
    	});
    };

    $scope.$watch('selected_program', function () {
    	
    	if($scope.selected_program) {

    		getData($scope.selected_program, $scope.range);
    	}
        else {
            if($scope.outlets.length > 0) {
                getAnonData($scope.outlets);
            }
        }
    }, true);

    $scope.$watch('range.start', function() {
        if($scope.selected_program) {

            getData($scope.selected_program, $scope.range);
        }
        else {
            if($scope.outlets.length > 0) {
                getAnonData($scope.outlets);
            }
        }
    }, true);

    $scope.$watch('range.end', function() {
        if($scope.selected_program) {

            getData($scope.selected_program, $scope.range);
        }
        else {
            if($scope.outlets.length > 0) {
                getAnonData($scope.outlets);
            }
        }
    }, true);

    function getData(program, range) {
        $scope.program_analytics = true;
        var start = new Date(range.start).setHours(0, 0, 1);
        var end = new Date(range.end).setHours(23, 59, 59);

    	dataService.getData(program, start, end).then(function(data) {
    		if(data.status !== "error") {
    			$scope.data = data;
    		}
    		else {
    			$scope.data = data;
    		}
    	});
    }

    function getAnonData(outlets) {
        $scope.program_analytics = false;
        var start = new Date($scope.range.start).setHours(0, 0, 1);
        var end = new Date($scope.range.end).setHours(23, 59, 59);

        dataService.getAnonData(outlets, start, end).then(function(data) {
            console.log(data)
            if(data.status !== "error") {
                $scope.data = data;
            }
            else {
                $scope.data = data;
            }
        });
    }
};