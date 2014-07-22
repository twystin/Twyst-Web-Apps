function PublicController($scope, $location, authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

}

function ReccoController($scope, $location, $http, $route, authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    var RECCO_CONFIG = {
		USER_CHECKIN_WEIGHT : 5,
		NUMBER_OF_RECCO : 10,
		CHECKIN_CUTOFF_INTERVAL : 15,
		NORMALIZED_WEIGHT : 100,
		OUTLET_POPULARITY_WEIGHT : 100,
		RELEVANCE_MATCH_WEIGHT : 100,
		DISTANCE_WEIGHT : 100
	};

	$scope.getDefaultValue = function () {
		$scope.recco_config = RECCO_CONFIG;
	}

    $scope.getReccoConfig = function () {
    	$http.get(
            '/api/v2/recco_config'
        ).success(function (data) {
            $scope.recco_config = data.info;
        }).error(function (data) {
    
        });
    }

    $scope.updateReccoConfig = function () {
    	$http.put(
            '/api/v2/recco_config', $scope.recco_config
        ).success(function (data) {
            $route.reload();
        }).error(function (data) {
    
        });
    }

}

function NotifController($scope, $http, $location, authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

	$scope.success = {};
	$scope.error = {};
	$scope.message = {};
	$scope.min_date = new Date();
    $scope.max_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

	function isValid() {
		if(($scope.message.phones
			|| $scope.message.gcms
			)
			&& $scope.message.head
			&& $scope.message.body
			&& $scope.message.date
			&& $scope.message.hours
			&& $scope.message.minutes) {
			if($scope.message.gcms) {
				if($scope.message.server_key) {
					return true;
				}
				return false;
			}
			return true;
		}
		return false;
	}

	$scope.makeEmpty = function(type) {
		$scope.success = {};
		$scope.error = {};
		$scope.message = {};
		$scope.message.type = type;
	}

	$scope.addNotif = function () {

		var obj = {};
		obj.message_type = $scope.message.type;
		if(isValid()) {
			if($scope.message.phones) {
				obj.phones = $scope.message.phones.split(/,|;|\n/);
			}
			if($scope.message.gcms) {
				obj.gcms = $scope.message.gcms.split(/,|;|\n/);
			}
			obj.head = $scope.message.head;
			obj.body = $scope.message.body;
			obj.server_key = $scope.message.server_key;
			obj.scheduled_at = $scope.message.date.setHours($scope.message.hours, $scope.message.minutes ,0);
			sendRequest(obj);
		}
		else {
			$scope.error.message = "Please fill all the fields."
		}
	}

	function sendRequest (obj) {
		$http.post('/api/v2/notifs', {obj:obj}).success(function (data) {
			$scope.success.message = data.message;
		}).error(function (data) {
			$scope.error.message = data.message;
		});
	}
}

function DatePickerCtrl($scope, $timeout) {
	
	$scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    //$scope.toggleMin();

    $scope.open = function() {
        $timeout(function() {
            $scope.opened = true;
        });
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
}

function AuthController($scope, $http, $location, authService) {
	
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

	$scope.auth = {};

	$scope.isLoggedIn = function () {
		if(authService.isLoggedIn()) {
			return true;
		}
		return false;
	}

	$scope.login = function() {
		authService.login($scope, $http, $location);
	}

	$scope.logout = function () {
		authService.logout($scope, $http, $location);
	}
}

function DashboardController($scope, $http, $location, authService) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

}

function UsersController($scope, $http, $location, $routeParams, authService) {
	
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

	$scope.user = {};
	$scope.user.validated = {};
	$scope.users = [];
	$scope.message = "";

	$scope.query = function() {
		var request = $http.get('/api/v1/auth/users');
		return request.then(function(response) {
			$scope.users = eval(eval(response).data.info);
		}, function(response) {

		});
	}	

	$scope.edit = function() {
		var username = $routeParams.username;

		var request = $http.get('/api/v1/auth/users/' + username);
		return request.then(function(response) {
			var user = eval(eval(response).data.info)[0];
			$scope.user.name = user.username;
			$scope.user.email = user.email;
			$scope.user.role = user.role;
			$scope.user.validated = user.validated.role_validated;
			console.log($scope.user);

		}, function(response) {
			console.log(response);
		})
	}

	$scope.update = function(user) {
		$http({
			url: '/api/v1/auth/users/validate/' + user.name,
			method: "PUT",
			data: user
		}).success(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users/view')
		}).error(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users/view')
		});
	}

	$scope.delete = function(user) {
		$http({
			url: '/api/v1/auth/users/' + user.username,
			method: 'DELETE',
			data: user
		}).success(function(data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users/view')
		}).error(function(data,status,headers,config) {
			$scope.message = data.message;
			$location.path('/users/view')			
		})
	}

	$scope.resendValidationEmail = function (username) {
		console.log(username);
		$http({
			url: '/api/v1/resend/validation/' + username,
			method: 'PUT'
		}).success(function(data, status, headers, config) {
			$scope.message = data.message;
		}).error(function(data,status,headers,config) {
			$scope.message = data.message;			
		})	
	}

	$scope.updateOutlet = function(outlet) {
		console.log(outlet.contact.location.coords.longitude);
		$http({
			url: '/api/v1/outlets/' + outlet.basics.name,
			method: "PUT",
			data: outlet
		}).success(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/outlets/')
		}).error(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/outlets/')
		});
	}

	$scope.outletQuery = function() {
		var request = $http.get('/api/v1/outlet/console/');
		return request.then(function(response) {
			$scope.outlets = eval(eval(response).data.info);
		}, function(response) {

		});
	}

	$scope.editOutlet = function() {
		var outlet_id = $routeParams.outlet_id;

		var request = $http.get('/api/v1/outlets/view/' + outlet_id);
		return request.then(function(response) {
			console.log(response);
			var outlet = eval(eval(response).data.info)[0];
			$scope.outlet = outlet;
			console.log($scope.outlet);

		}, function(response) {
			console.log(response);
		})
	}

	$scope.validity = {};

	$scope.addQrs = function () {

		$scope.success = {};
		$scope.error_message = '';

		var outlet_id = $scope.qr_for_outlet;
		var num = $scope.num_of_qrs;
		var validity = $scope.validity;
		validity.start = validity.start.setHours(0,0,1);
		validity.end = validity.end.setHours(23,59,59);
		console.log(validity);
		console.log($scope.validity);
		var max_use_limit;
		
		if($scope.qrType === 'single') {
			max_use_limit = 5;
		}
		else {
			max_use_limit = $scope.max_use_limit;
		}

		$http({
			url: '/api/v1/qr/outlets/',
			method: "POST",
			data: {outlet: outlet_id, num: num, type: $scope.qrType, validity: validity, max_use_limit: max_use_limit}
		}).success(function (data, status, headers, config) {
			$scope.success = data;
			$scope.success.info = $scope.success.info.replace(/"/g, "");
			$scope.error_message = '';
		}).error(function (data, status, headers, config) {
			$scope.success = {};
			$scope.error_message = data.message;
		});

	}
}