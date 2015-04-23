twystApp.controller('CheckinSuccessCtrl', function($scope, dataSvc, $state, logSvc) {
	logSvc.page("Checkin Success");

	$scope.data = dataSvc.checkin_data;
	// console.log($scope.data);
    $scope.feedback = function(id) {
        console.log("CHECKIN ID " + id);
        if (id) {
            $state.go('main.in.found.feedback', {
                item: id
            }, {
                inherit: false
            });
        }
    };

});
