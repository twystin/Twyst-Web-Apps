angular.module('login', ['auth', 'ngAnimate', 'toastr', 'ngRoute', 'ngCookies'])
.controller('AuthCtrl', function($scope, $location, authSvc, toastSvc) {
	$scope.user = null;

	authSvc.getLoggedInUser().then(function (res) {
		$scope.user = authSvc.getAuthStatus();
		if(authSvc.getPhone()) {
			$location.path('/vouchers');
			//toastSvc.showToast('success', 'Logged-In successfully');
		}
		else {
			authSvc.logout().then(function (data) {
				$location.path('/');
			});
		}
	}, function (error) {
		$scope.user = null;
	});

	$scope.getOtp = function () {
		if(isMobileNumber($scope.phone)) {
			authSvc.setPhone($scope.phone);
			requestOtp($scope.phone);
		}
		else {
			toastSvc.showToast('error', 'Please enter a valid phone number');
		}
	};

	$scope.verify = function () {
		var phone = authSvc.getPhone();
		console.log(phone);
		if(phone && isValidOtp($scope.otp)) {
			verifyOtp($scope.otp, phone);
		}
		else {
			toastSvc.showToast('error', 'Please enter a valid verification code');
		}
	};

	function isValidOtp(otp) {
        if(otp 
        	&& (otp.length === 4)) {
            return true;
        };
        return false;
    }

	function verifyOtp(otp, phone) {
		authSvc.verifyOTP(otp, phone).then(function (data) {
			login(phone);
			//toastSvc.showToast('success', data.message);
		}, function (err) {
			toastSvc.showToast('error', err.message);
		});
	}

	function login(phone) {
		authSvc.login(phone, phone).then(function (data) {
			$location.path('/vouchers');
			//toastSvc.showToast('success', data.message);
		}, function (err) {
			toastSvc.showToast('error', err.message);
		});
	}

	function requestOtp(phone) {
		authSvc.getOTP(phone).then(function (data) {
			$location.path('/otp');
			//toastSvc.showToast('success', data.message);
		}, function (err) {
			toastSvc.showToast('error', err.message);
		});
	}

	function isMobileNumber(phone) {
        if(phone 
        	&& (phone.length === 10)
        	&& isNumber(phone) 
        	&& isValidFirstDigit(phone)) {
            return true;
        };
        return false;
    }

    function isValidFirstDigit(phone) {
    	if(phone[0] === '7'
    		|| phone[0] === '8'
    		|| phone[0] === '9') {
    		return true;
    	}
    	return false;
    }

    function isNumber(str) {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(str);
    }
})
.controller('VoucherCtrl', function($scope, $location, dataSvc, authSvc) {
	authSvc.getLoggedInUser().then(function (res) {
		$scope.user = authSvc.getAuthStatus();
	}, function (error) {
		$scope.user = null;
		$location.path('/');
	});

	dataSvc.getVouchers().then(function (data) {
		console.log(data);
		$scope.active_vouchers = data.info.vouchers.ACTIVE;
	}, function (error) {
		console.log(error);
	});

	$scope.getMobileOperatingSystem = function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) {
          return 'iOS';

        }
        else if( userAgent.match( /Android/i ) ) {
          return 'Android';
        }
        else {
          return 'unknown';
        }
    }

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
.config(function ($routeProvider) {
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
    //$httpProvider.interceptors.push(interceptor);
});

// var interceptor = function ($q, $location) {
//     return {
//         // request: function (config) {
//         //     return config;
//         // },

//         // response: function (result) {
//         //     return result;
//         // },

//         responseError: function (rejection) {
//             if (rejection.status == 403) {
//                 $location.url('/');
//             }
//             else if(rejection.status == 401) {
//             	$location.url('/');
//             }

//             return $q.reject(rejection);
//         }
//     }
// };