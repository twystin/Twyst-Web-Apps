twystApp.controller('SocialCtrl', function($scope, $state, $http, $window, urlp, dataSvc, storageSvc, logSvc) {
    logSvc.page("Social");

    $scope.user = $scope.user || {};

    $scope.getUser = function() {
        logSvc.page("Profile")
        dataSvc.userLoggedIn().then(function(s) {
            $scope.social_graph = s && s.user && s.user.social_graph;
            $scope.user.email = s && s.user && s.user.email.email;
            $scope.phone = storageSvc.get("user");
            console.log($scope.social_graph);
        }, function(e) {
            $scope.user = null;
        });        
    };

    $scope.fbLogin = function() {
        logSvc.event('Social', 'Social - FB login', 'Social - FB login called', '1');

        console.log("THIS FB LOGIN CALLED");
        facebookConnectPlugin.login(['email', 'public_profile', 'user_friends'], function(data) {
            if (data.authResponse) {
                console.log("CAME HERE");
                console.log(data);
                facebookConnectPlugin.api('/me', null, function(response) {
                    console.log("CAME HERE 2")
                    if (response.error) {
                        logSvc.event('Social', 'Social - FB login error', 'Social - FB login error', '1');
                        $window.navigator.notification.alert("Error: " + JSON.stringify(response.error),
                            function() {}, "ERROR!", "OK");

                    } else {
                        console.log("SUCCESS!");
                        $http.post(urlp + '/api/v3/social', {
                            key: 'facebook',
                            data: response
                        }).success(function(data) {
                            storageSvc.set('authStatus', 'main.in');
                            logSvc.event('Social', 'Social - FB login success', 'Social - FB login success', '1');
                            $window.navigator.notification.alert("Connected your account with Facebook",
                                function() {
                                    $state.go('main.in.found.home');
                                }, "CONNECTED!", "OK");
                        }).error(function(error) {
                            logSvc.event('Social', 'Social - FB login error', 'Social - FB login error', '1');
                            $window.navigator.notification.alert("Error: " + JSON.stringify(error),
                                function() {}, "ERROR!", "OK");
                        });
                    }
                });
            } else {
                logSvc.event('Social', 'Social - FB login error', 'Social - FB login error', '1');
                $window.navigator.notification.alert("Error logging in with Facebook",
                    function() {}, "ERROR!", "OK");
            }
        }, function(error) {
            logSvc.event('Social', 'Social - FB login error', 'Social - FB login error', '1');
            $window.navigator.notification.alert("Error logging in with Facebook" + JSON.stringify(error),
                function() {}, "ERROR!", "OK");            
        });
    };

    $scope.emLogin = function() {
        logSvc.event('Social', 'Social - Email login', 'Social - Email login', '1');

        console.log($scope.user.email);
        $http.post(urlp + '/api/v3/social', {
            key: 'email',
            data: {
                'email': $scope.user.email
            }
        }).success(function() {
            logSvc.event('Social', 'Social - Email success', 'Social - Email success', '1');

            $window.navigator.notification.alert("We have sent you an email. Please click on the link in the email to validate your email address.",
                function() {
                    $state.go('main.in.found.home');
                }, "ADDED EMAIL", "OK");
        }).error(function(error) {
            logSvc.event('Social', 'Social - Email error', 'Social - Email error', '1');

            $window.navigator.notification.alert("Error: " + JSON.stringify(error),
                function() {}, "ERROR", "OK");
        });
    };
});
