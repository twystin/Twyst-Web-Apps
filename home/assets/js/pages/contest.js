var twystContact = angular.module('twystContest', ['toastr'])
.factory('toastSvc', function (toastr) {
    return {
        showToast: function (type, message, head) {
            toastr[type](message, 
                head, 
                {
                    closeButton: true
                });
        }
    }
})
.controller('ContestCtrl', function($scope, $http, $timeout, $window, toastSvc) {

    $scope.user = {};

    $scope.enterContest = function () {
        if(isAllFilled()) {
            if(isMobileNumber($scope.user.phone)) {
                if(validateEmail($scope.user.email)) {
                    postData();
                }
                else {
                    toastSvc.showToast('error', 'Please provide a valid email id');
                }
            }
            else {
                toastSvc.showToast('error', 'Please provide a valid mobile number');
            }
        }
        else {
            toastSvc.showToast('error', 'Please fill all the fields');
        }
    }

    function isMobileNumber(phone) {
        if(phone 
            && (phone.length === 10)
            && isNumber(phone) 
            && isValidFirstDigit(phone)) {
            return true;
        };
        return false;
    }

    function isValidFirstDigit(phone) {
        if(phone[0] === '7'
            || phone[0] === '8'
            || phone[0] === '9') {
            return true;
        }
        return false;
    }

    function isNumber(str) {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(str);
    }

    function isAllFilled() {
        if($scope.user.name
            && $scope.user.phone
            && $scope.user.email
            && $scope.user.dob
            && $scope.user.message) {
            return true;
        }
        return false;
    }

    function isValidPhone () {
        if(!$scope.user.phone
            || isNaN($scope.user.phone)
            || $scope.user.phone.length !== 10) {
            
            return false;
        }
        return true;
    }

    function validateEmail(email) { 
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    } 

    function postData() { 
        $scope.user.name = $scope.user.name + ' (dob: ' + $scope.user.dob + ')'
        $http.post('/api/v1/beta/users', {
            name  : $scope.user.name,
            message         : $scope.user.message,
            phone        : $scope.user.phone,
            email               : $scope.user.email
        }).success(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('success', 'Thank you for participating. We will contact the lucky winners after the results are declared on 10th Feb 2015.');
        })
        .error(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('error', 'You have already participated in the contest. Results will be declared on 10th Feb 2015.');
        });
    };

    function redirect() {
        $timeout(function () {
            $window.location.href = 'http://twyst.in';
        }, 4000);
    }
});