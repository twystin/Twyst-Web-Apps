angular.module('login', ['auth', 'ngAnimate', 'toastr', 'ngCookies'])
.config(function ($httpProvider) {
    $httpProvider.interceptors.push(interceptor);
})
.controller('myController', function($scope, authSvc, toastSvc) {
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