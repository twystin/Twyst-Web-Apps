twystConsole.controller('AdminUserCtrl', function($scope, $location, $routeParams, authService, adminUserService, toastSvc) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    $scope.roles = ['1', '2', '3', '4', '5', '7', 'All'];

    function init () {
        $scope.currentPage = 1;
        $scope.totalCountPerPage = 50;
        $scope.totalUsers = 10;
        $scope.maxSize = 10;
        $scope.users = [];
        $scope.sort_order = -1;
        $scope.sort_param = "created_at";
    }

    init();

    $scope.$watch('currentPage', function() {
        $scope.getUsers();
    });

    $scope.$watch('userRole', function() {
        $scope.getUsers();
    });

    $scope.$watch('searchTerm', function() {
        init();
        $scope.getUsers();
    });

    $scope.getUsers = function () {
    	adminUserService.getUsers(
            $scope.searchTerm,
            $scope.userRole,
            $scope.currentPage,
            $scope.totalCountPerPage,
            $scope.sort_param,
            $scope.sort_order).then(function (data) {

            $scope.users = data.info.USERS || [];
            $scope.totalUsers = data.info.totalCount;
        })
    }

    $scope.getSorted = function (sortParam) {
        $scope.sort_param = sortParam;
        $scope.sort_order === 1 ? ($scope.sort_order = -1) : ($scope.sort_order = 1);
        $scope.getUsers();
    }

    $scope.getUser = function () {
        var username = $routeParams.username;
        adminUserService.getUser(username).then(function (data) {
            $scope.user = data.info;
            console.log($scope.user)
        }, function (err) {

        })
    }

    $scope.updateUser = function () {
        var username = $scope.user.username;
        adminUserService.updateUser(username, $scope.user).then(function (data) {
            toastSvc.showToast('success', data.message);
        }, function (err) {
            toastSvc.showToast('error', err.message);
        })
    }

    $scope.getTimeline = function () {
        $scope.info = {};
        var user = {
            phone: $scope.phone
        };
        adminUserService.getTimeline(user).then(function (data) {
            $scope.info = data.info;
        }, function (err) {
            console.log(err)
            toastSvc.showToast('error', err.message);
        });
    }
});