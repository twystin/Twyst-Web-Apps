'use strict';
twystApp.controller('SpecialCtrl', function($scope, $routeParams, $location, authService, specialService, outletService, REWARD_CHECK, WEEK, OPERATE_HOURS) {
	$scope.reward_check = REWARD_CHECK;
	$scope.week = WEEK;
	$scope.outlet_for = {};
	$scope.validationArray = [true, true, true, true, true, true, true, true];
	$scope.special = {
		outlets: [],
		ranges: [{
			count_from: 0,
			count_till: 5,
			reward: {},
			terms: null,
			selected_reward: REWARD_CHECK[0]
		}],
		avail_hours: OPERATE_HOURS
	};

	$scope.create = function () {
		specialService.create($scope.special).then(function (data) {
			$location.path('/special_program');
		}, function (err) {
			console.log(err);
		})
	}

	$scope.update = function () {
		specialService.update($scope.special).then(function (data) {
			$location.path('/special_program');
		}, function (err) {
			console.log(err);
		})
	}

	$scope.read = function () {
		specialService.read().then(function (data) {
			$scope.specials = data.info;
		}, function (err) {
			console.log(err);
		})
	}

	$scope.readOne = function () {
		var special_id = $routeParams.special_id;
		if(special_id) {
			specialService.readOne(special_id).then(function (data) {
				$scope.special = data.info;
			}, function (err) {
				console.log(err);
			})
		}
	}

	$scope.outletQuery = function () {
		outletService.query().then(function (data) {
			$scope.all_outlets = data.info;
		}, function (err) {
			console.log(err);
		})
	}

	$scope.toggleOutlets = function (fruit) {
        if ($scope.special.outlets.indexOf(fruit) === -1) {
            $scope.special.outlets.push(fruit);
        } else {
            $scope.special.outlets.splice($scope.special.outlets.indexOf(fruit), 1);
        }
    };

    $scope.getSelectedState = function(r) {
    	if(_.isEmpty(r.reward)) {
            return REWARD_CHECK[0];
        }
        else {
            var l = Object.keys(r.reward)[0];
            var ll = _.find($scope.reward_check, function (reward){return reward.value === l});
            return ll;
        }
    }

    $scope.addReward = function () {
    	$scope.special.ranges.push({
			count_from: 0,
			count_till: 5,
			reward: {},
			terms: null,
			selected_reward: REWARD_CHECK[0]
		});
    }

    $scope.removeReward = function (index) {
    	$scope.special.ranges.splice(index, 1);
    }

    $scope.newTimings = function($event, index){
        if($scope.special.avail_hours[$scope.week[index]].timings.length < 5) {
            $scope.special.avail_hours[$scope.week[index]].timings.push({open: '', close: ''});        
            $event.preventDefault();    
        }
    };

    $scope.removeTimings = function (day, index) {
        $scope.special.avail_hours[day].timings.splice(index, 1);
    }

    $scope.timingsValidation = function () {
        var flag = 0;
        for (var i = 0; i < 7; i++){
            flag = 0;
            if ($scope.special.avail_hours[$scope.week[i]].closed == false && 
                $scope.special.avail_hours[$scope.week[i]].timings.length > 1){
                for (var j = 0; j < $scope.special.avail_hours[$scope.week[i]].timings.length-1; j++){
                    for (var k = j + 1 ; k < $scope.special.avail_hours[$scope.week[i]].timings.length; k++){
                        if ((sendTime(1, i, j) < sendTime(0, i, k)) && (sendTime(0, i, j) > sendTime(1, i, k))){
                            
                            flag=1;
                        }
                    }
                }
            }
	        if (flag==1){
	            $scope.validationArray[i] = false;
	        }
	        else{
	            $scope.validationArray[i] = true;
	        }
        }
    }

    function sendTime(i, w, t){
        //1 for open
        if (i==1){
            return ($scope.special.avail_hours[$scope.week[w]].timings[t].open.hr * 60 *1 +
            $scope.special.avail_hours[$scope.week[w]].timings[t].open.min * 1);
        }
        //0 for close
        else if (i==0){
            return ($scope.special.avail_hours[$scope.week[w]].timings[t].close.hr * 60 *1 +
            $scope.special.avail_hours[$scope.week[w]].timings[t].close.min * 1);
        }
    }

    $scope.applyToAllDays = function(time) {
        for(var i = 0; i < $scope.week.length; i++) {
            $scope.special.avail_hours[$scope.week[i]].closed = time.closed;
            var timings = [];
            for(var j = 0; j < time.timings.length; j++) {
                var t = {
                    open: {
                        hr: time.timings[j].open.hr,
                        min: time.timings[j].open.min
                    },
                    close: {
                        hr: time.timings[j].close.hr,
                        min: time.timings[j].close.min
                    }
                };
                timings.push(t);
            }
            $scope.special.avail_hours[$scope.week[i]].timings = timings;
        }
    }

    $scope.$watch('outlet_for._timings', function () {
        if(!$scope.outlet_for._timings || $scope.outlet_for._timings === "NONE") {
            $scope.special.avail_hours = OPERATE_HOURS;
        }
        else {
            $scope.special.avail_hours = $scope.outlet_for._timings.business_hours;
        }
    }, true);
})
.factory('specialService', function ($http, $q) {
    var specialSvc = {};

    specialSvc.create = function (data) {
    	var defer = $q.defer();
        $http({
            url: '/api/v1/special/',
            method: "POST",
            data: data
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    specialSvc.update = function (data) {
    	var defer = $q.defer();
        $http({
            url: '/api/v1/special/',
            method: "PUT",
            data: data
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    specialSvc.read = function () {
    	var defer = $q.defer();
        $http({
            url: '/api/v1/special/',
            method: "GET"
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    specialSvc.readOne = function (id) {
    	var defer = $q.defer();
        $http({
            url: '/api/v1/special/' + id,
            method: "GET"
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    return specialSvc;
});