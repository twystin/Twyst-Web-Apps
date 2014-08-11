outletApp.factory('outletService', function ($http, $q) {
	$scope.outlets = {};
	var outletService = {};
	outletService.getOutlet = function () {
		var deferred = $q.defer;
		deferred.promise.then(function () {
			var request = $http.get('api/v1/outlets' + outlet_id);
			return request.then(function(response){
			var response = JSON.parse(data.info);
		});
			deferred.resolve(response);
		});
		return defer.promise;
	};
	return outletService;
});
