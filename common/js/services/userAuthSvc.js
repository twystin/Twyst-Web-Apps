angular.module('userAuth', ['ngCookies'])
.factory('userAuthSvc', function ($http, $q, $cookieStore){

	var userAuthSvc = {};

	userAuthSvc.setAuthStatus = function (user) {
        $cookieStore.put('username', user.username);
        $cookieStore.put('role', user.role);
        userAuthSvc.updateSocialState(user);
    };

    userAuthSvc.updateState = function (state) {
    	$cookieStore.put('state', state);
    }

    userAuthSvc.updateSocialState = function (user) {
    	if(user && user.social_graph) {
    		if(user.social_graph.facebook) {
    			$cookieStore.put('facebook_connect', true);
    		}
    		else {
    			$cookieStore.put('facebook_connect', false);
    		}
    		if(user.social_graph.email) {
    			$cookieStore.put('email', true);
    		}
    		else {
    			$cookieStore.put('email', false);
    		}
    	}
    }

    userAuthSvc.removeAuthStatus = function () {
    	$cookieStore.remove('username');
    	$cookieStore.remove('role');
    	$cookieStore.remove('state');
    	$cookieStore.remove('facebook_connect');
    	$cookieStore.remove('email');
    }

    userAuthSvc.getAuthStatus = function () {
    	var _authStatus = {
    		username: $cookieStore.get('username'),
    		role: $cookieStore.get('role'),
    		state: $cookieStore.get('state'),
    		facebook_connect: $cookieStore.get('facebook_connect'),
    		email: $cookieStore.get('email')
    	};
    	return _authStatus;
    }

	userAuthSvc.getLoggedInUser = function () {
		var deferred = $q.defer();
		$http.get('/api/v1/auth/get_logged_in_user')
		.success(function(success) {
			userAuthSvc.setAuthStatus(success.user);
			userAuthSvc.updateState(2);
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	};

	userAuthSvc.login = function (username, password) {
		var deferred = $q.defer();
		$http.post('/api/v1/auth/login', {
      		username: username,
      		password: password
    	}).success(function(success) {
    		userAuthSvc.updateState(2);
    		userAuthSvc.setAuthStatus(success.user);
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	};

  	userAuthSvc.logout = function () {
  		var deferred = $q.defer();
		$http.get('/api/v1/auth/logout')
		.success(function(success) {
			userAuthSvc.removeAuthStatus();
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	}
  
	userAuthSvc.getOTP = function (phone) {
		var deferred = $q.defer();
		$http.get('/api/v2/otp/' + phone)
		.success(function(success) {
			updateState(1);
		  	deferred.resolve(success);
		}).error(function(error) {
			deferred.reject(error);
		});
		return deferred.promise;
	};

	userAuthSvc.updateSocial = function (data) {
		var deferred = $q.defer();
		$http.post('/api/v1/auth/login', data)
		.success(function(success) {
			updateState(2);
			updateSocialState(success.user);
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
	}

	userAuthSvc.verifyOTP = function (otp, phone) {
		var deferred = $q.defer();
		$http.post('/api/v2/otp', {
			otp: otp,
			phone: phone,
			device_id: phone
		}).success(function(success) {
			updateState(2);
		  	deferred.resolve(success);
		}).error(function(error) {
		  	deferred.reject(error);
		});
		return deferred.promise;
	};

  	return userAuthSvc;
});