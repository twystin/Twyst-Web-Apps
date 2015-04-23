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
                    if (success && success.info && success.info.social_graph) {
                        s = success.info.social_graph;
                        if (s.email && s.email.email || s.facebook) {
                            $state.go('main.in.found.home');
                        } else {
                            $state.go('main.out.social');
                        }
                    } else {
                        $state.go('main.out.social');
                    }
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
            $window.navigator.notification.alert("You should receive a verification code soon.",
                function() {
                    $scope.button_clicked.otp = false;
                    $state.go('main.out.otp');
                }, "VERIFICATION", "OK");
        }, function(error) {
            if (error === 'network_error') {
                $scope.button_clicked.otp = false;
                dataSvc.showNetworkError();
            } else {
                $window.navigator.notification.alert("We could not send a verification code. Please try again. Error: " + error.message,
                    function() {
                        $scope.button_clicked.otp = false;
                        $ionicLoading.hide();
                    }, "VERIFICATION ERROR", "OK");
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
                $window.navigator.notification.alert("Incorrect verification code entered. Please try again.",
                    function() {
                        $scope.button_clicked.verify = false;
                        $ionicLoading.hide();
                    }, "VERIFICATION ERROR", "OK");
            }
        });
    };
});
