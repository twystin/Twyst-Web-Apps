twystConsole.controller('AdminQrCtrl', function($scope, $http, $modal, $location, authService, adminQrService) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    function init () {
        $scope.currentPage = 1;
        $scope.totalCountPerPage = 50;
        $scope.totalQrs = 10;
        $scope.maxSize = 10;
        $scope.qrs = [];
    }

    init();

    $scope.$watch('currentPage', function() {
        $scope.getQrs();
    });

    $scope.$watch('searchTerm', function() {
        init();
        $scope.getQrs();
    });

    $scope.getQrs = function () {
    	adminQrService.getQrs(
            $scope.searchTerm,
            $scope.currentPage,
            $scope.totalCountPerPage).then(function (data) {

            $scope.qrs = data.info.QRS || [];
            $scope.totalQrs = data.info.totalCount;
        })
    }

    $scope.initChange = function (qr) {
    	var modalInstance = $modal.open({
            templateUrl : './templates/qr/change_validity_modal.html',
            controller  : 'QrValidityChangeCtrl',
            backdrop    : 'static',
            keyboard    : true,
            scope: $scope,
            resolve: {
              qr: function(){
                return qr;
              }
            }
        });
    }

})
.controller('QrValidityChangeCtrl', function($scope, $route, $modalInstance, qr, adminQrService) {

	$scope.qr = qr;

	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.changeValidity = function (qr) {
    	adminQrService.changeValidity(qr).then(function (data) {
    		//$route.reload();
            $scope.getQrs();
    		$scope.cancel();
    	})
    }
});