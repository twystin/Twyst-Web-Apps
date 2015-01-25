angular.module('login', ['auth', 'ngAnimate', 'toastr', 'ngRoute', 'ngCookies'])
.controller('AuthCtrl', function($scope, authSvc, toastSvc) {
	$scope.user = null;

	authSvc.getLoggedInUser().then(function (res) {
		$scope.user = authSvc.getAuthStatus();
		console.log($scope.user)
		toastSvc.showToast('success', 'Logged-In successfully');
	}, function (error) {
		$scope.user = null;
	});

	$scope.login = function () {
		var username = $scope.username,
			pass = $scope.pass;
		if(username && pass) {
			authSvc.login(username, pass).then(function (res) {
				toastSvc.showToast('success', 'Logged-In successfully');
			}, function (error) {
				toastSvc.showToast('error', 'Incorrect username or password');
			});
		}
		else {
			toastSvc.showToast('error', 'Enter username and password');
		}
	}
})
.controller('VoucherCtrl', function($scope, dataSvc) {
	dataSvc.getVouchers().then(function (data) {
		console.log(data);
		$scope.active_vouchers = data.info.vouchers.ACTIVE;
	}, function (error) {
		console.log(error);
	});

	$scope.imageName = function(item) {
        var a = '';
        if (item.voucher.basics.type !== 'WINBACK') {
            a = Object.keys(item.voucher.issue_details.issued_for.reward)[0];
        } else {
            a = Object.keys(item.voucher.issue_details.winback.reward)[0];
        }
        return "./rewards/" + a + ".png";
    };
})
.factory('dataSvc', function ($q, $http) {
	return {
		getVouchers: function () {
			var deferred = $q.defer();
			$http.get('/api/v3/rewards')
			.success(function(success) {
		      	deferred.resolve(success);
		    }).error(function(error) {
		      	deferred.reject(error);
		    });
		    return deferred.promise;
		}
	}
})
.factory('toastSvc', function (toastr) {
	return {
		showToast: function (type, message, head) {
			toastr[type](message, 
				head, 
				{
					closeButton: true
				});
		}
	}
})
.config(function ($routeProvider, $httpProvider) {
	$routeProvider.
	when('/', {
		controller: 'AuthCtrl',
		templateUrl: './home.html'
	}).
	when('/otp', {
		controller: 'AuthCtrl',
		templateUrl: './otp.html'
	}).
	when('/vouchers', {
		controller: 'VoucherCtrl',
		templateUrl: './vouchers.html'
	}).
	when('/vouchers/:voucher_id', {
		controller: 'VoucherCtrl',
		templateUrl: './view.html'
	}).
	otherwise({
		redirectTo: '/'
	});
    $httpProvider.interceptors.push(interceptor);
});

var interceptor = function ($q, $location) {
    return {
        // request: function (config) {
        //     return config;
        // },

        // response: function (result) {
        //     return result;
        // },

        responseError: function (rejection) {
            if (rejection.status == 403) {
                $location.url('/');
            }
            else if(rejection.status == 401) {
            	$location.url('/');
            }

            return $q.reject(rejection);
        }
    }
};