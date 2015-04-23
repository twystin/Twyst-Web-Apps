twystApp.controller('FeedbackCtrl', function($scope, $rootScope, $timeout, $window, dataSvc, item, logSvc) {
    logSvc.page("Feedback");
    var r = dataSvc.reccos;
    var i = 0;
    $scope.item = item.item;
    $scope.reccos = r.info.reccos;
    for (i = 0; i < $scope.reccos.length; i++) {
        if ($scope.reccos[i].outlet_summary._id === item.item) {
            $scope.recco = $scope.reccos[i];
            break;
        } else {
            $scope.recco = null;
        }
    }

    $scope.feedback = {};
    $scope.feedback.photo_type = 'image/jpeg';
    $scope.feedback.outlet = $scope.recco && $scope.recco.outlet_summary._id;
    $scope.feedback.type = '';
    $scope.feedback.comment = '';
    $scope.feedback.photo = null;


    $scope.camera = function() {
        logSvc.event('Feedback', 'Feedback - Camera clicked', 'Feedback - Photo taken', '1');

        navigator.camera.getPicture(function(imageData) {
            $scope.feedback.photo = imageData;
            $scope.$apply();
        }, function(message) {
            console.log("Failed because " + message);
        }, {
            quality: 50,
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 200,
            targetHeight: 200
        });
    };

    $scope.send_feedback = function() {
        logSvc.event('Feedback', 'Feedback - Send feedback', 'Feedback - Send feedback called', '1');

        dataSvc.feedback($scope.feedback).then(function() {
            logSvc.event('Feedback', 'Feedback - Send feedback', 'Feedback - Send feedback success', '1');

            $window.navigator.notification.alert("Thank you for your feedback.", function() {}, "FEEDBACK SENT! ", "OK");
        }, function() {

            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                logSvc.event('Feedback', 'Feedback - Send feedback', 'Feedback - Send feedback error', '1');
                $window.navigator.notification.alert(error,
                    function() {}, "ERROR", "OK");
            }

        });
    };

});
