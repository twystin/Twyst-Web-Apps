angular.module('auth', ['ngCookies'])
.factory('authSvc', function ($http, $q, $cookieStore){

	var authSvc = {},
		base_url = 'http://twyst.in';

	authSvc.getPhone = function () {
		return $cookieStore.get('phone');
	};

	authSvc.setPhone = function (phone) {
		$cookieStore.put('phone', phone);
	};

	authSvc.setAuthStatus = function (user) {
        $cookieStore.put('username', user.username);
        $cookieStore.put('role', user.role);
    };

    authSvc.removeAuthStatus = function () {
    	$cookieStore.remove('username');
    	$cookieStore.remove('role');
    }

    authSvc.getAuthStatus = function () {
    	var _authStatus = {
    		username: $cookieStore.get('username'),
    		role: $cookieStore.get('role')
    	};
    	return _authStatus;
    }

	authSvc.getLoggedInUser = function () {
		var deferred = $q.defer();
		$http.get('/api/v1/auth/get_logged_in_user')
		.success(function(success) {
			authSvc.setAuthStatus(success.user);
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	};

  	authSvc.register = function (user) {
		var deferred = $q.defer();
		$http.post('/api/v1/auth/register', user)
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
    		authSvc.setAuthStatus(success.info);
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	};

  	authSvc.logout = function () {
  		var deferred = $q.defer();
		$http.get('/api/v1/auth/logout')
		.success(function(success) {
			authSvc.removeAuthStatus();
	      	deferred.resolve(success);
	    }).error(function(error) {
	      	deferred.reject(error);
	    });
	    return deferred.promise;
  	}

  	return authSvc;
});