angular.module('auth', [])
.factory('authSvc', function ($http, $q){

	var authSvc = {},
		base_url = 'http://twyst.in';

	authSvc.getLoggedInUser = function () {
		var deferred = $q.defer();
		$http.get('/api/v1/auth/login')
		.success(function(success) {
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	};

  	authSvc.register = function (user) {
		var deferred = $q.defer();
		$http.get('/api/v1/auth/register', data)
		.success(function(success) {
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	};

	authSvc.login = function (username, password) {
		var deferred = $q.defer();
		$http.post('/api/v1/auth/login', {
      		username: username,
      		password: password
    	}).success(function(success) {
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	};
  
	authSvc.getOTP = function (phone) {
		var deferred = $q.defer();
		$http.get('/api/v2/otp/' + phone, {
			timeout: 30000,
			cache: false,
			headers: {
				'Accept': 'application/json',
				'Pragma': 'no-cache'
			}
		}).success(function(success) {
		  	deferred.resolve(success);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	authSvc.verifyOTP = function (otp, phone) {
		var deferred = $q.defer();
		$http.post('/api/v2/otp', {
			otp: otp,
			phone: phone,
			device_id: phone
		}).success(function(success) {
		  	deferred.resolve(success);
		}).error(function(error) {
		  	deferred.reject(error);
		});
		return deferred.promise;
	};

  	return authSvc;
});