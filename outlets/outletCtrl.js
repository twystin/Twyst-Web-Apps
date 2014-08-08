outletApp.controller('OutletCtrl',['$scope', 'outletService', function($scope, outletService) {
	$scope.getOutlet = function() {
		outletService.getOutlet().then(function(data) {
			$scope.outlet = data.info;
		})
	}

}]);