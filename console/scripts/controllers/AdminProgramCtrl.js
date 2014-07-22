function AdminProgramCtrl($scope, $http, $location, $modal, authService, adminProgramService) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    function init () {
        $scope.currentPage = 1;
        $scope.totalCountPerPage = 10;
        $scope.totalPrograms = 10;
        $scope.maxSize = 10;
        $scope.programs = [];
    }

    init();
    
    $scope.$watch('currentPage', function() {
        $scope.getPrograms();
    });

    $scope.$watch('searchTerm', function() {
        init();
        $scope.getPrograms();
    });

    $scope.getPrograms = function () {
    	adminProgramService.getPrograms(
            $scope.searchTerm,
            $scope.currentPage,
            $scope.totalCountPerPage).then(function (data) {

            $scope.programs = data.info.PROGRAMS || [];
            $scope.totalPrograms = data.info.totalCount;
        })
    }

    $scope.initChange = function (program, status) {
    	var data = {
    		'program': program,
    		'status': status
    	};
    	var modalInstance = $modal.open({
            templateUrl : './templates/programs/change_status_modal.html',
            controller  : 'ProgramStatusChangeCtrl',
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

function ProgramStatusChangeCtrl($scope, $route, $modalInstance, data, adminProgramService) {

	$scope.program = data.program;
	$scope.status = data.status;

	$scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.changeStatus = function () {
    	$scope.program.status = $scope.status.toLowerCase();
    	adminProgramService.changeStatus($scope.program).then(function (data) {
    		$route.reload();
    		$scope.cancel();
    	})
    }
}