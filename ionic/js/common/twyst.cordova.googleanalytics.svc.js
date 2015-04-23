/**
* twyst.cordova.googleanalytics Module
*
* Description: A module that uses the Cordova GAPlugin to log analytics; logs to console if GAPlugin is not present.
* Author: Arun Rajappa
* EMail: ar@twyst.in
* Version: 1.0
* Date: 17th Sept 2014
*/
angular.module('twyst.cordova.googleanalytics', [])
.factory('logSvc', function($window, $q) {
  var logSvc = {};
  var logMock = {
    init: function(s,f,c,n) {
      console.log("Mock: " + c + " " + n);
      s(true);
    },
    trackEvent: function(s,f,a,l,v) {
      console.log("Mock: " + a + " " + l + " " + v);
      s(true);
    },
    trackPage: function(s,f,u) {
      console.log("Mock: " + u);
      s(true);
    }
  };

  logSvc.initialized = false;

  logSvc.init = function() {
    var deferred = $q.defer();
    logSvc.logger = logMock;

    logSvc.logger.init(function(result) {
      logSvc.initialized = true;
      deferred.resolve(result);
    }, function(error) {
      logSvc.initialized = false;
      deferred.reject(error);
    }, "UA-54317262-1", 10);
    return deferred.promise;
  };

  // logSvc.event('Click', 'Next button', 'Click on next button', '1');
  logSvc.event = function(category, eventAction, eventLabel, eventValue) {
    var deferred = $q.defer();
    var log = function() {
      console.log("Logging: Category " + category + ", Event Action " + eventAction, ", Event Label " + eventLabel + ", Event Value " + eventValue);
      logSvc.logger.trackEvent(function(success) {
        deferred.resolve(success);
      }, function(error) {
        deferred.reject(error);
      },
      category,
      eventAction,
      eventLabel,
      eventValue);
    };

    if (logSvc.initialized) {
      log();
    } else {
      var promise = logSvc.init();
      promise.then(function(result) {
        log();
      }, function(error) {
        deferred.reject(error);
      });
    }
    return deferred.promise;
  };

  logSvc.page = function(url) {
    var deferred = $q.defer();
    var log = function() {
      console.log("Logging: Page " + url);
      logSvc.logger.trackPage(function(success) {
        deferred.resolve(success);
      }, function(error) {
        deferred.reject(error);
      },
      url);
    };

    if (logSvc.initialized) {
      log();
    } else {
      var promise = logSvc.init();
      promise.then(function(result) {
        log();
      }, function(error) {
        deferred.reject(error);
      });
    }
    return deferred.promise;
  };

  return logSvc;
});
