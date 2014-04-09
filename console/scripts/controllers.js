function PublicController($scope) {

}

function NotifController($scope, $http) {

	$scope.success = {};
	$scope.error = {};
	$scope.valid = {};
	$scope.message = {};

	function validate() {
		if($scope.phones 
			&& $scope.message.head
			&& $scope.message.body
			&& $scope.valid.date
			&& $scope.hours
			&& $scope.minutes) {

			return true;
		}
		return false;
	}

	$scope.addNotif = function () {

		var obj = {};
		if(validate()) {
			obj.phones = $scope.phones.split(',');
			obj.message = $scope.message;
			obj.scheduled_at = $scope.valid.date.setHours($scope.hours, $scope.minutes ,0);
			sendRequest(obj);
		}
		else {
			$scope.error.message = "Please fill all the fields."
		}
	}

	function sendRequest (obj) {
		console.log(obj)
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
    $scope.toggleMin();

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

/*function AuthController($scope, $http, $location) {
	$scope.message = "";
	$scope.login = function() {
		var request = $http.post('/api/v1/auth/login', {username: $scope.user.name, password: $scope.user.pass});
		return request.then(function(response) {
			var user = eval(response).data.info;
			if (user.role == "root") {
				$location.path('/dashboard');
			} else {
				$scope.message = "You dont have enough privileges";
			}
		}, function(response) {
				$scope.message = "No such user & password exists";
		});
	}
}*/

function DashboardController($scope, $http, $location) {

}

function UsersController($scope, $http, $location, $routeParams) {
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