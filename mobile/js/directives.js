twystClient.directive('offer', [function () {
    return {
        restrict: 'A',
        scope: {
            offerData: '@'
        },
        controller: function ($scope) {
            $scope.program = JSON.parse($scope.offerData);
        },
        templateUrl: './templates/partials/offer.html'
    };
}]);

twystClient.directive('outlet', [function () {
    return {
        restrict: 'A',
        scope: {
            outletData: '@'
        },
        controller: function ($scope) {
            $scope.outlet = JSON.parse($scope.outletData);
            console.log($scope.outlet);
        },
        templateUrl: './templates/partials/outlet.html'
    };
}]);