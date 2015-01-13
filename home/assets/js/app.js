angular.module('twystApp', ['ngAnimate', 'toastr', 'userAuth', 'ui.bootstrap'])
.directive('backgroundImage', function () {
  return function (scope, element, attrs) {
    attrs.$observe('backgroundImage', function (value) {
      if (value) {
        var url = 'http://s3-us-west-2.amazonaws.com/twyst-outlets/' + value;
        element.css({
            'background': "url('" + url + "')",
            'background-size':   'cover',                     /* <------ */
            'background-repeat': 'no-repeat',
            'background-position': 'center center' 
        });
      }
    });
  };
})
.factory('featuredSvc', function($http, $q) {
    var featuredSvc = {};
    featuredSvc.getFeatured = function (number) {
        var deferred = $q.defer();
        $http.get(
            '/api/v3/featured_outlets?num=' + number 
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };
    return featuredSvc;
})
.factory('toastSvc', function (toastr) {
    return {
        showToast: function (type, message, head, timeout) {
            toastr[type](message, 
                head, 
                {
                    timeOut: timeout,
                    closeButton: true                    
                });
        }
    }
})
.controller('AuthCtrl', function ($scope, $modal, userAuthSvc, toastSvc) {
    $scope.user = null;
    $scope.login_details = {
        is_valid_phone: false,
        phone: null
    }

    userAuthSvc.getLoggedInUser().then(function (res) {
        $scope.user = userAuthSvc.getAuthStatus();
        console.log($scope.user)
        toastSvc.showToast('success', 'Logged-In successfully', null, 5000);
    }, function (error) {
        $scope.user = null;
    });

    $scope.getOTP = function (phone) {
        userAuthSvc.getOTP(phone).then(function (res) {
            $scope.user = userAuthSvc.getAuthStatus();
            console.log($scope.user)    
            toastSvc.showToast('success', 'You will soon receive a verification code', null, 5000);
        }, function (error) {
            toastSvc.showToast('error', 'Error sending verification code', null, 5000);
        })
    }

    $scope.verifyOTP = function (otp, phone) {
        userAuthSvc.verifyOTP(otp, phone).then(function (res) {
            $scope.user = userAuthSvc.getAuthStatus(); 
            toastSvc.showToast('success', 'successfully logged-in', null, 5000);
        }, function (error) {
            toastSvc.showToast('error', 'Wrong verification code', null, 5000);
        })
    }

    $scope.logout = function () {
        userAuthSvc.logout().then(function (res) {
            $scope.user = userAuthSvc.getAuthStatus();
            toastSvc.showToast('success', 'successfully logged-out', null, 5000);
        }, function (error) {
            toastSvc.showToast('error', 'Error logging out', null, 5000);
        })
    }

    $scope.initLogin = function () {
        var modalInstance = $modal.open({
            templateUrl: '/home/_partials/login_modal.html',
            size: 'sm',
            backdrop: 'static',
            scope: $scope
        });
    };

    $scope.$watch('login_details.phone', function () {
        console.log("hhuhui")
        if($scope.login_details.phone 
            && ($scope.login_details.phone.length === 10) 
            && isNumeric($scope.login_details.phone)) {
            $scope.login_details.is_valid_phone = true;
        }
        else {
            $scope.login_details.is_valid_phone = false;
        }
    })

    function isNumeric(str) {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(str);
    }
})
.controller('FeaturedCtrl', function($scope, $window, featuredSvc, userAuthSvc, toastSvc) {
    $scope.numOfFeatured = 6;

    function isMobile() {
        if($window.innerWidth < 768) {
            return true;
        }
        return false;
    }

    $scope.isNew = function (outlet) {
        var date = new Date(outlet.basics.created_at).getTime() + 1296000000;
        if(date >= new Date().getTime()) {
            return true;
        }
        return false;
    }

    if(isMobile()) {
        $scope.numOfFeatured = 3;
    }

    $scope.getFeatured = function () {
        featuredSvc.getFeatured($scope.numOfFeatured).then(function (data) {
            $scope.results = data.info;
        })
    }

    $scope.getMobileOperatingSystem = function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) ) {
          return 'iOS';
        }
        else if( userAgent.match( /Android/i ) ) {
          return 'Android';
        }
        else {
          return 'unknown';
        }
    }
})
.controller('ContactCtrl', function($scope, $http) {
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