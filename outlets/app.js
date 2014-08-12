
var outletApp = angular.module('outletApp',["ngRoute",'ui.bootstrap','ngCookies','d3onut']);

outletApp.controller('OutletCtrl', function($scope, $routeParams, outletService) {
	($scope.getOutlet = function() {
		var outlet_id = $routeParams.outlet_id;
		outletService.getOutlet(outlet_id).then(function(data) {
			$scope.outlet = data.OUTLET;
			$scope.rewards = data.REWARDS;
		})
	})();

	$scope.getCostForTwoText = function (outlet) {
        if(outlet.attributes.cost_for_two.min
            && outlet.attributes.cost_for_two.max) {
            var costs = ["100", "300", "500", "1000","1500","2000", "2500", "3000", "> 3000"],
                bottom = Number(outlet.attributes.cost_for_two.min) - 1,
                top = Number(outlet.attributes.cost_for_two.max) - 1;

            if (bottom < top) {
                return [costs[bottom], costs[top]];
            }
        }   
    };
}).factory('outletService', function ($http, $q) {
	var outletService = {};
	outletService.getOutlet = function (outlet_id) {
		var deferred = $q.defer();

        $http({
            url: '/api/v1/publicview/outlets/' + outlet_id,
            method: 'GET'
        }).success(function (data) {
            deferred.resolve(data.info);
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
