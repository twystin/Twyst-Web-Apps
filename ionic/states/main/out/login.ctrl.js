twystApp.controller('LoginCtrl', function($scope, $state, $window, $rootScope, $ionicLoading, storageSvc, dataSvc, logSvc) {
    $scope.user = storageSvc.get('user') || {};
    $scope.button_clicked = {};

    $scope.go_otp = function() {
       $state.go('main.out.otp');
    };

    $scope.login = function() {
        logSvc.page("Login");
        storageSvc.set('user', $scope.user);
        var promise = dataSvc.login($scope.user.phone);
        promise.then(function(success) {
          $state.go('main.in.found.home');
        }, function(error) {
            if (error === 'Unauthorized') {
                $scope.otp();
            } else {
                if (error === 'network_error') {
                    dataSvc.showNetworkError();
                } else {
                    console.log("Error: " + JSON.stringify(error));
                }
            }
        });
    };

    $scope.otp = function() {
        $scope.button_clicked.otp = true;
        logSvc.page("OTP Register");

        storageSvc.set('user', $scope.user);
        var promise = dataSvc.getOTP($scope.user.phone);
        promise.then(function(success) {
            $window.alert("You should receive a verification code soon.");
            $scope.button_clicked.otp = false;
            $state.go('main.out.otp');
        }, function(error) {
            if (error === 'network_error') {
                $scope.button_clicked.otp = false;
                dataSvc.showNetworkError();
            } else {
                $window.navigator.notification.alert("We could not send a verification code. Please try again. Error: " + error.message);
                $scope.button_clicked.otp = false;
                $ionicLoading.hide();
            }
        });
    };

    $scope.verify = function() {
        $scope.button_clicked.verify = true;

        logSvc.page("OTP Verify");

        storageSvc.set('user', $scope.user);
        var promise = dataSvc.verify($scope.user.otp, $scope.user.phone);
        promise.then(function(success) {
            $scope.button_clicked.verify = false;

            $scope.login();
        }, function(error) {
            if (error === 'network_error') {
                $scope.button_clicked.verify = false;
                dataSvc.showNetworkError();
            } else {
                $window.navigator.notification.alert("Incorrect verification code entered. Please try again.");
                $scope.button_clicked.verify = false;
                $ionicLoading.hide();
            }
        });
    };
});
