twystConsole.controller('AdminQrCtrl', function($scope, $http, $modal, $location, $routeParams, authService, adminQrService, toastSvc) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    function init () {
        $scope.selected_qrs = [];
        $scope.currentPage = 1;
        $scope.totalCountPerPage = 50;
        $scope.totalQrs = 10;
        $scope.maxSize = 10;
        $scope.qrs = [];
        $scope.min_date = new Date();
        $scope.validity = {
            start: null,
            end: null
        };
    }

    init();

    $scope.$watch('currentPage', function() {
        $scope.getQrs();
    });

    $scope.$watch('searchTerm', function() {
        init();
        $scope.getQrs();
    });

    $scope.isValidityEnding = function (qr) {
        return new Date(Date.now() + 864000000) > (new Date(qr.validity.end)) ? true : false;
    }

    $scope.toggleQrs = function (fruit) {
        if ($scope.selected_qrs.indexOf(fruit) === -1) {
            $scope.selected_qrs.push(fruit);
        } else {
            $scope.selected_qrs.splice($scope.selected_qrs.indexOf(fruit), 1);
        }
    };

    $scope.getQrs = function () {
        var outlet_id = $routeParams.outlet_id;
    	adminQrService.getQrs(
            outlet_id,
            $scope.searchTerm,
            $scope.currentPage,
            $scope.totalCountPerPage)
        .then(function (data) {
            $scope.qrs = data.info.QRS || [];
            $scope.totalQrs = data.info.totalCount;
        }, function (err) {
            toastSvc.showToast('error', err.message);
        });
    }

    $scope.changeValidity = function () {
        if(isDateSelected()) {
            if($scope.selected_qrs.length) {
                var data = {
                    ids: $scope.selected_qrs,
                    validity: $scope.validity
                };
                console.log(data)
                adminQrService.changeValidity(data)
                .then(function (data) {
                    toastSvc.showToast('success', data.message);
                }, function (err) {
                    toastSvc.showToast('error', err.message);
                });
            }
            else {
                toastSvc.showToast('error', 'Select at-least one QR code to update');
            }
        }
        else {
            toastSvc.showToast('error', 'Select start_date and end_date');
        }
    }

    function isDateSelected() {
        if($scope.validity && $scope.validity.start && $scope.validity.end) {
            return true;
        }
        return false;
    }
});