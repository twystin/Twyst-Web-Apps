var twystApp = angular.module('twystApp', []);

twystApp.controller('ContactCtrl', function($scope, $http) {
    $scope.user = {};
    $scope.user.thank_you = false;
    $scope.user.error = false;

    $scope.contact = function () {
        if ($scope.user.name &&
            $scope.user.message &&
            $scope.user.email) {

            $http.post('/api/v1/beta/users',
                {   name  : $scope.user.name,
                    message : $scope.user.message,
                    email : $scope.user.email
                })
                .success(function (data, status, header, config) {
                    $scope.user = {};
                    $scope.user.thank_you = true;
                    $scope.user.error = false;
                })
                .error(function (data, status, header, config) {
                    $scope.user.error = true;
                    $scope.user.thank_you = false;
                });
        }
        else {
            $scope.user.thank_you = false;
            $scope.user.error = false;
        }
    };
    
});