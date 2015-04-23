twystApp.controller('MainCtrl', function($scope, $timeout, $rootScope, $window, $state, dataSvc, logSvc) {
    $scope.getUser = function() {
        $timeout(function() {
            logSvc.page("Main");
            dataSvc.userLoggedIn().then(function(success) {
                console.log("TWYST SUCCESS " + JSON.stringify(success));
                if (success && success.user && success.user.social_graph) {
                    s = success.user.social_graph;
                    if (s.email && s.email.email || s.facebook) {
                        if (s.email) {
                            if (success.user.validated && success.user.validated.email_validated) {
                                status = success.user.validated.email_validated.status;
                                // It's coming back as text :(
                                if (status === false || status === "false") {
                                    $window.alert("You have not verified your email address, please check your inbox for a mail from Twyst and verify your email address.");
                                    $state.go('main.in.found.home');
                               } else {
                                    $state.go('main.in.found.home');
                               }
                            } else {
                                $window.alert("You have not verified your email address, please check your inbox for a mail from Twyst and verify your email address.");
                                $state.go('main.in.found.home');
                            }
                        } else {
                            $state.go('main.in.found.home');
                        }
                    } else {
                        $state.go('main.out.social');
                    }
                } else {
                    $state.go('main.out.social');
                }

                //$state.go('main.in.found.home');
            }, function(error) {
                if (error === 'network_error') {
                    dataSvc.showNetworkError();
                    $state.go('main.out.login');
                } else {
                    $state.go('main.out.login');
                }
            });
        }, 1000);
    };
});
