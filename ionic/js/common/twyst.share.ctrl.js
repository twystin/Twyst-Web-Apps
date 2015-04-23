twystApp.controller('ShareCtrl', function($scope, $ionicPopup, $window, $ionicLoading, urlp, logSvc) {
    $scope.sharePopup = function(long, short) {
        logSvc.event('Share', 'Share popup', 'Share popup called', '1');

        $scope.sharecontent = {long:long, short:short};
    
        var alertPopup = $ionicPopup.alert({
            title: 'LET YOUR FRIENDS KNOW',
            templateUrl: 'js/common/shareModal.html',
            scope: $scope,
            okText: 'Close', // String (default: 'OK'). The text of the OK button.
            okType: 'button-energized'            
        });
    }

    $scope.initContent = function(long,short) {
        logSvc.event('Share', 'Share popup', 'Share popup called', '1');
        $scope.sharecontent = {long:long, short:short};
    }

    $scope.whatsapp = function() {
        logSvc.event('Share', 'Share whatsapp', 'Share whatsapp called', '1');

        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> SHARING'
        });
        $window.plugins.socialsharing.shareViaWhatsApp(
            $scope.sharecontent.long,
            null,
            null,
            function() {
                logSvc.event('Share', 'Share whatsapp', 'Share whatsapp success', '1');

                $ionicLoading.hide();
            },
            function(errormsg) {
                logSvc.event('Share', 'Share whatsapp', 'Share whatsapp error', '1');

                $ionicLoading.hide();
                $window.navigator.notification.alert("Could not share with WhatsApp",
                    function() {}, "SHARING ERROR", "OK");
            });
    };

    $scope.twitter = function() {
        logSvc.event('Share', 'Share twitter', 'Share twitter called', '1');

        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> SHARING'
        });
        $window.plugins.socialsharing.shareViaTwitter(
            $scope.sharecontent.short,
            null,
            null,
            function() {
                logSvc.event('Share', 'Share twitter', 'Share twitter success', '1');

                $ionicLoading.hide();
            },
            function(errormsg) {
                logSvc.event('Share', 'Share twitter', 'Share twitter error', '1');

                $ionicLoading.hide();
                $window.navigator.notification.alert("Could not share with Twitter",
                    function() {}, "SHARING ERROR", "OK");
            });    
    }; 

    $scope.facebook = function() {
        logSvc.event('Share', 'Share facebook', 'Share facebook called', '1');

        $ionicLoading.show({
            template: '<i class="icon ion-loading-c"></i> SHARING'
        });
        $window.plugins.socialsharing.shareViaFacebook(
            $scope.sharecontent.long,
            null /* img */ ,
            null /* url */ ,
            function() {
                logSvc.event('Share', 'Share facebook', 'Share facebook success', '1');
                $ionicLoading.hide();
            },
            function(errormsg) {
                logSvc.event('Share', 'Share facebook', 'Share facebook error', '1');
                $ionicLoading.hide();
                $window.navigator.notification.alert("Could not share with Facebook",
                    function() {}, "SHARING ERROR", "OK");
            });
    }

});
