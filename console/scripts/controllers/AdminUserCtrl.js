function AdminUserCtrl($scope, $http, $location, authService, adminUserService) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    function init () {
        $scope.currentPage = 1;
        $scope.totalCountPerPage = 50;
        $scope.totalUsers = 10;
        $scope.maxSize = 10;
        $scope.users = [];
    }

    init();

    $scope.$watch('currentPage', function() {
        $scope.getUsers();
    });

    $scope.$watch('searchTerm', function() {
        init();
        $scope.getUsers();
    });

    $scope.getUsers = function () {
    	adminUserService.getUsers(
            $scope.searchTerm,
            $scope.currentPage,
            $scope.totalCountPerPage).then(function (data) {

            $scope.users = data.info.USERS || [];
            $scope.totalUsers = data.info.totalCount;
        })
    }
}