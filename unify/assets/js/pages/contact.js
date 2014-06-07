var twystContact = angular.module('twystContact', []);

twystContact.controller('ContactCtrl', function($scope, $http) {

    $scope.contactUs = false;
    $scope.merchant = {};
    $scope.user = {};

    $scope.getInTouch = function(){
        if ($scope.contactUs == false) {
            $scope.contactUs = true;
            $scope.merchant = {};
            $scope.merchant.thank_you = false;
            $scope.merchant.error = false;
        }else{
            $scope.contactUs = false;
            $scope.merchant = {};
            $scope.merchant.thank_you = false;
            $scope.merchant.error = false;
        }
    };


    $scope.addMerchant = function () {
        if ($scope.merchant.establishment_name &&
                $scope.merchant.person_name &&
                $scope.merchant.phone_number &&
                $scope.merchant.city) {
            
            $scope.merchant.fill = false;

            $http.post('/api/v1/beta/merchants',
                {   establishment_name  : $scope.merchant.establishment_name,
                    person_name         : $scope.merchant.person_name,
                    phone_number        : $scope.merchant.phone_number,
                    city                : $scope.merchant.city,
                    email               : $scope.merchant.email
                })
                .success(function (data, status, header, config) {
                    $scope.merchant = {};
                    $scope.merchant.thank_you = true;
                    $scope.merchant.error = false;
                    $scope.contactUs = false;
                })
                .error(function (data, status, header, config) {
                    $scope.merchant.error = true;
                    $scope.merchant.thank_you = false;
                    $scope.contactUs = false;
                });
        }
        else {
            $scope.merchant.fill = true;
            $scope.merchant.thank_you = false;
            $scope.merchant.error = false;
        }
    };

    $scope.addUser = function () {
        if ($scope.user.name &&
            $scope.user.message &&
            $scope.user.email) {
            
            $scope.user.fill = false;

            $http.post('/api/v1/beta/users',
                {   name  : $scope.user.name,
                    message         : $scope.user.message,
                    phone        : $scope.user.phone,
                    email               : $scope.user.email
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
            $scope.user.fill = true;
            $scope.user.thank_you = false;
            $scope.user.error = false;
        }
    };
    
});