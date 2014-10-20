// /**
// *  Module
// *
// * Description
// */
angular.module('login', [])
.factory('loginSvc', function ($http, $q){

	var loginSvc = {};

	loginSvc.login = function (phone) {
		// console.log("phone" + phone);
		var deferred = $q.defer();
		var query = "/api/v1/auth/login";
		$http.post(query, {
      username: phone,
      password: phone
    }).success(function(success) {
      // console.log('SUCCESS ' + success);
      deferred.resolve(success);
    }).error(function(error) {
      // console.log('ERROR ' + error);
      deferred.reject(error);
    });
    return deferred.promise;
  };
  loginSvc.flash = function() {
    
  }
  loginSvc.getOTP = function (phone) {
    console.log(phone);
    var deferred = $q.defer();
    $http.get('/api/v2/otp/' + phone, {
      timeout: 30000,
      cache: false,
      headers: {
        'Accept': 'application/json',
        'Pragma': 'no-cache'
      }
    }).success(function(success) {
      // console.log("SUCCESS " + success);
      deferred.resolve(success);
    }).error(function(error) {
      // console.log("ERROR " + error);
      deferred.reject(error);
    });

    return deferred.promise;
  };

  loginSvc.verify = function (otp, phone) {
    // console.log('VERIFYING ' + otp + ' ' + phone);
    var deferred = $q.defer();
    $http.post('/api/v2/otp', {
      otp: otp,
      phone: phone,
      device_id: phone
    }).success(function(success) {
      // console.log("SUCCESS " + success);
      deferred.resolve(success);
    }).error(function(error) {
      // console.log("ERROR " + error);
      deferred.reject(error);
    });
    return deferred.promise;
  };
  
  return loginSvc;
});

