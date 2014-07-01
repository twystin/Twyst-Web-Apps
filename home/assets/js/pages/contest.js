var twystContact = angular.module('twystContest', []);

twystContact.controller('ContestCtrl', function($scope, $http) {

    $scope.user = {};
    $scope.filled = {
        'name': true,
        'message': true,
        'email': true,
        'phone': true
    };

    $scope.enterContest = function () {
        initFilled();
        if(validateData()) {
            postData();
        }
    }

    function validateData () {
        if(!$scope.user.name) {
            $scope.filled.name = false;
            return false;
        }
        if(!isValidPhone()) {
            $scope.filled.phone = false;
            return false;
        }
        if(!isValidEmail()) {
            $scope.filled.email = false;
            return false;
        }
        if(!$scope.user.message) {
            $scope.filled.message = false;
            return false;
        }
        return true;
    }

    function isValidPhone () {
        if(!$scope.user.phone
            || isNaN($scope.user.phone)
            || $scope.user.phone.length !== 10) {
            
            return false;
        }
        return true;
    }

    function isValidEmail () {
        return $scope.contestForm.email.$valid;
    }

    function initFilled () {
        $scope.filled = {
            'name': true,
            'message': true,
            'email': true,
            'phone': true
        };
    }

    function postData() {        

        $http.post('/api/v1/beta/users', {   
            name  : $scope.user.name,
            message         : $scope.user.message,
            phone        : $scope.user.phone,
            email               : $scope.user.email
        }).success(function (data, status, header, config) {
            $scope.user = {};
            $scope.user.thank_you = true;
            $scope.user.error = false;
        })
        .error(function (data, status, header, config) {
            $scope.user.error = true;
            $scope.user.thank_you = false;
        });
    };
    
});