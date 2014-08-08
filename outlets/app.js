
var outletApp = angular.module('outletApp',["ngRoute",'ui.bootstrap','ngCookies','d3onut']);

outletApp.controller('OutletCtrl', function($scope, $routeParams, outletService) {
	($scope.getOutlet = function() {
		var outlet_id = $routeParams.outlet_id;
		outletService.getOutlet(outlet_id).then(function(data) {
			$scope.outlet = data;
		})
	})();
}).factory('outletService', function ($http, $q) {
	var outletService = {};
	outletService.getOutlet = function (outlet_id) {
		var deferred = $q.defer();

        $http({
            url: '/api/v1/publicview/outlets/' + outlet_id,
            method: 'GET'
        }).success(function (data) {
            deferred.resolve(JSON.parse(data.info));
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
		};
	return outletService;
}).config(function ($routeProvider, $httpProvider){
	$routeProvider.
	when('/:outlet_id',{
		templateUrl: './templates/outlet_view.html',
		controller: 'OutletCtrl'
	})
})