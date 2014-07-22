function AdminOutletCtrl($scope, $http, $modal, $location, authService, adminOutletService) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    function init () {
        $scope.currentPage = 1;
        $scope.totalCountPerPage = 10;
        $scope.totalOutlets = 10;
        $scope.maxSize = 10;
        $scope.outlets = [];
    }

    init();

    $scope.$watch('currentPage', function() {
        $scope.getOutlets();
    });

    $scope.$watch('searchTerm', function() {
        init();
        $scope.getOutlets();
    });

    $scope.getOutlets = function () {
    	adminOutletService.getOutlets(
            $scope.searchTerm,
            $scope.currentPage,
            $scope.totalCountPerPage).then(function (data) {

            $scope.outlets = data.info.OUTLETS || [];
            $scope.totalOutlets = data.info.totalCount;
        })
    }

    $scope.initChange = function (outlet, status) {
    	var data = {
    		'outlet': outlet,
    		'status': status
    	};
    	var modalInstance = $modal.open({
            templateUrl : './templates/outlets/change_status_modal.html',
            controller  : 'OutletStatusChangeCtrl',
            backdrop    : 'static',
            keyboard    : true,
            scope: $scope,
            resolve: {
              data: function(){
                return data;
              }
            }
        });
    }

}

function OutletStatusChangeCtrl($scope, $route, $modalInstance, data, adminOutletService) {

	$scope.outlet = data.outlet;
	$scope.status = data.status;

	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.changeStatus = function () {
    	$scope.outlet.outlet_meta.status = $scope.status.toLowerCase();
    	adminOutletService.changeStatus($scope.outlet).then(function (data) {
    		//$route.reload();
            $scope.getOutlets();
    		$scope.cancel();
    	})
    }
}