/**
* twyst.data Module
*
* Description
*/
angular.module('twyst.data', []).
factory('dataSvc', function($http, $q) {
	var dataSvc = {};

	var prepareData = function(data) {

		var d = {};
		d.data = {};

        //console.log("DATA " + JSON.stringify(data.info));

        d.data.nearby = data.info.NEAR.info || [];
        d.data.checkins = data.info.CHECKINS.info || [];
	    d.data.rewards = data.info.VOUCHERS.info || [];
        d.data.reccos = data.info.RECCO.info || [];
        d.data.faves = data.info.FAVOURITES.info || [];
        dataSvc.data = d.data; 
		return d;
	};

	dataSvc.getUserDataInfo = function(latitude, longitude) {
		var deferred = $q.defer();
        //console.log("URL REQUEST" + 'http://twyst.in/api/v2/data/' + latitude + '/' + longitude)
        $http.get('http://localhost:3000/api/v2/data/' + latitude + '/' + longitude + '/', {
            timeout: 60000,
            cache: false,
            headers: {
                'Accept': 'application/json',
                'Pragma': 'no-cache'
            }
        }).success(function(data) {
        	deferred.resolve(prepareData(data));
        }).error(function(error) {
        	deferred.reject(error);
        });

		return deferred.promise;
	};

	//TODO: Remove this, this isnt sending any useful info.
	/*
	dataSvc.getUserSessionInfo = function() {
		var deferred = $q.defer();
        $http.get('http://twyst.in/api/v2/constants', {
            timeout: 30000,
            cache: false,
            headers: {
                'Accept': 'application/json',
                'Pragma': 'no-cache'
            }
        }).success(function(data) {
        	deferred.resolve(data);
        }).error(function(error){
        	deferred.reject(error);
        });

        return deferred.promise;
	};
	*/

	dataSvc.getLoggedInUser = function() {
		var deferred = $q.defer();
		$http.get('http://twyst.in/api/v1/auth/get_logged_in_user', {
            timeout: 30000,
            cache: false,
            headers: {
                'Accept': 'application/json',
                'Pragma': 'no-cache'
            }			
		}).success(function(data) {
			deferred.resolve(data);
		}).error(function(error) {
			console.log('ERROR FROM SERVER' + error);
			deferred.reject(error);
		});

		return deferred.promise;
	};

	return dataSvc;
});