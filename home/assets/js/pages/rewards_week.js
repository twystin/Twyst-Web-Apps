var twystContact = angular.module('twystRewardsWeek', ['toastr'])
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
.controller('RewardsWeekCtrl', function($scope, $http, $timeout, $window, toastSvc) {

    $scope.user = {};
    $scope.Cafes = [
        'ax',
        'b',
        'New c',
        'd',
        'eh',
        'Sri f',
        'g',
    ];
    $scope.Pizzas = [
        'q',
        'fz',
        'd Indies',
        'fa',
        'United d Emirates',
        'South z',
        'ff',
    ];

    $scope.Pubs = [
        'a',
        'ea',
        's Indies',
        'v',
        'f Arab Emirates',
        'w Africa',
        'e',
    ];
    $scope.selected_Cafes = [];
    $scope.selected_Pizzas = [];
    $scope.selected_Pubs = [];
    $scope.selected_Cafe = [];
    $scope.selected_Pizza = [];
    $scope.selected_Pub = [];
    $scope.selected_outlet = [];
    

    $scope.togglePool = function (ischecked, pool, team) {
        if($scope.selected_Cafe[ischecked] || $scope.selected_Pizza[ischecked] || $scope.selected_Pub[ischecked]){
            console.log("checked")
            if($scope[pool].length === 2) {
                $scope.disable = true;
            }
            if($scope[pool].length < 3) {
                if ($scope[pool].indexOf(team) === -1) {
                    $scope.selected_outlet.push(team);
                    $scope[pool].push(team);
                } else {
                    $scope.disable = true;    
                    $scope[pool].splice($scope[pool].indexOf(team), 1);
                    
                }
            }  
            else {
                $scope.disable = true;
            }
        }
        
        else {
            $scope.disable = false;
            $scope.selected_outlet.splice($scope[pool].indexOf(team), 1);
            $scope[pool].splice($scope[pool].indexOf(team), 1);
        }
    }
    $scope.enableSelection = function () {
        $scope.disable = false;
        $scope.selected_Cafes = [];
        $scope.selected_Pizzas = [];
        $scope.selected_Pubs = [];
        $scope.selected_Cafe = [];
        $scope.selected_Pizza = [];
        $scope.selected_Pub = [];
        $scope.selected_outlet = [];
        
    }

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
            toastSvc.showToast('error', 'Please fill all the fields and select 3 outlets.');
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
        var length = $scope.selected_Cafes.length + $scope.selected_Pizzas.length + $scope.selected_Pubs.length;
        if($scope.user.name
            && $scope.user.phone
            && $scope.user.email
            && $scope.user.dob
            && length === 3) {
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
        $scope.user.name = $scope.user.name + ' (dob: ' + $scope.user.dob + ')';
        $scope.user.message = $scope.selected_Cafes.toString() + ',' + $scope.selected_Pizzas.toString() + ',' + $scope.selected_Pubs.toString();
        $http.post('/api/v1/beta/users', {
            name  : $scope.user.name,
            message         : $scope.user.message,
            phone        : $scope.user.phone,
            email               : $scope.user.email
        }).success(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('success', 'Thank you for participating. We will contact the lucky winners after the results are declared,  after 10th March 2015.');
        })
        .error(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('error', 'You have already participated in the contest. Results will be declared after 10th March 2015.');
        });
    };

    function redirect() {
        $timeout(function () {
            $window.location.href = '';
        }, 4000);
    }
});

