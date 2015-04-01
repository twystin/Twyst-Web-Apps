'use strict';
twystConsole.factory('adminCouponService', function ($http, $q) {

  var adminCouponSvc = {};

  adminCouponSvc.getOutlets = function() {
    var deferred = $q.defer();

    var request = $http.get('/api/v1/outlet/console/');
    request.then(function(data) {
      deferred.resolve(eval(eval(data).data.info));
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  adminCouponSvc.saveCoupon = function(coupon) {
    var deferred = $q.defer();
    var request = $http.post('/api/v3/coupon', coupon);
    request.then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;    
  }

  adminCouponSvc.getUser = function(phone) {
    var deferred = $q.defer();
    console.log(phone);
    var request = $http.get('/api/v1/auth/phones/' + phone);
    request.then(function(data) {
      deferred.resolve(data);
    }, function(err) {
      deferred.reject(err);
    });

    return deferred.promise;
  }

  return adminCouponSvc;
});
