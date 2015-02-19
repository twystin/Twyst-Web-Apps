angular.module('homeApp', ["ezfb", 'auth', 'ngAnimate', 'toastr', 'ngRoute', 'ngCookies', 'angularMoment'])
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
.controller('OutletCtrl', function($scope, $location, dataSvc, authSvc) {
	authSvc.getLoggedInUser().then(function (res) {
		$scope.user = authSvc.getAuthStatus();
		console.log($scope.user)
	}, function (error) {
		$scope.user = null;
		$location.path('/');
	});

	dataSvc.getOutlet().then(function (data) {
		$scope.data = data.info;
		console.log(data)
	}, function (error) {
		toastSvc.showToast('error', err.message);
	});

	$scope.getCostForTwoText = function (outlet) {
		if(outlet && outlet.attributes && outlet.attributes.cost_for_two.min
			&& outlet.attributes.cost_for_two.max) {
			var costs = ["100", "300", "500", "1000","1500","2000", "2500", "3000", "> 3000"],
			bottom = Number(outlet.attributes.cost_for_two.min) - 1,
			top = Number(outlet.attributes.cost_for_two.max) - 1;
			if (bottom < top) {
				return costs[bottom] + ' to ' + costs[top];
			}
		}
	}

	$scope.highlight = function(c, r, p) {
        p = p || 0;
        if (c >= p && c < r) {
            return 'highlight';
        }
        return '';
    };

	$scope.addhttp = function(url) {
	   	if (!/^(f|ht)tps?:\/\//i.test(url)) {
	      	url = "http://" + url;
	   	}
	   	return url;
	}
})
.controller('ReccoCtrl', function($scope, $location, dataSvc, authSvc) {
	authSvc.getLoggedInUser().then(function (res) {
		$scope.user = authSvc.getAuthStatus();
		console.log($scope.user)
	}, function (error) {
		$scope.user = null;
		$location.path('/');
	});

	dataSvc.getRecco().then(function (data) {
		$scope.recco = data.info;
		console.log(data.info)
	}, function (error) {
		toastSvc.showToast('error', err.message);
	});

	$scope.imageName = function(item) {
        var a = '';
        if(item.basics.icon) {
        	a += item.basics.icon;
        }
        else if(item.basics.is_a) {
        	a += item.basics.is_a;
        }
        return "/common/transparent/" + a + ".png";
    };
})
.controller('RewardCtrl', function($scope, $location, dataSvc, authSvc) {
	authSvc.getLoggedInUser().then(function (res) {
		$scope.user = authSvc.getAuthStatus();
		console.log($scope.user)
	}, function (error) {
		$scope.user = null;
		$location.path('/');
	});

	dataSvc.getRewards().then(function (data) {
		$scope.rewards = data.info;
	}, function (error) {
		toastSvc.showToast('error', err.message);
	});

	$scope.imageName = function(item) {
        var a = '';
        if (item.voucher.basics.type !== 'WINBACK') {
            a = Object.keys(item.voucher.issue_details.issued_for.reward)[0];
        } else {
            a = Object.keys(item.voucher.issue_details.winback.reward)[0];
        }
        return "/common/transparent/" + a + ".png";
    };
})
.controller('TimelineCtrl', function($scope, $location, dataSvc, authSvc) {
	authSvc.getLoggedInUser().then(function (res) {
		$scope.user = authSvc.getAuthStatus();
		console.log($scope.user)
	}, function (error) {
		$scope.user = null;
		$location.path('/');
	});

	dataSvc.getTimeline().then(function (data) {
		$scope.timeline = data.info;
	}, function (error) {
		toastSvc.showToast('error', err.message);
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
})
.factory('dataSvc', function ($q, $http) {
	return {	
		getOutlet: function () {
			var deferred = $q.defer();
			$http.get('/api/v3/outlet_detail?outlet_id=530ef84902bc583c21000004')
			.success(function(success) {
		      	deferred.resolve(success);
		    }).error(function(error) {
		      	deferred.reject(error);
		    });
		    return deferred.promise;
		},
		getTimeline: function () {
			var deferred = $q.defer();
			$http.get('/api/v3/timeline')
			.success(function(success) {
		      	deferred.resolve(success);
		    }).error(function(error) {
		      	deferred.reject(error);
		    });
		    return deferred.promise;
		},
		getRewards: function () {
			var deferred = $q.defer();
			$http.get('/api/v3/rewards')
			.success(function(success) {
		      	deferred.resolve(success);
		    }).error(function(error) {
		      	deferred.reject(error);
		    });
		    return deferred.promise;
		},
		getRecco: function () {
			var deferred = $q.defer();
			$http.get('/api/v3/recco')
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
.directive('backgroundImage', function () {
  return function (scope, element, attrs) {
    attrs.$observe('backgroundImage', function (value) {
		if (value) {
			var url = 'http://s3-us-west-2.amazonaws.com/twyst-outlets/' + value;
			element.css({'background': "url('" + url + "')"});
		}
    });
  };
})
.config(function (ezfbProvider, $routeProvider, $httpProvider){
	ezfbProvider.setInitParams({
		appId: '763534923659747',
		version    : 'v1.0'
	});
});
