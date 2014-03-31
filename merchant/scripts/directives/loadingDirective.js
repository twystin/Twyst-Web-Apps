twystApp.directive('loadingWidget', ['_START_REQUEST_', '_END_REQUEST_', function (_START_REQUEST_, _END_REQUEST_) {
    return {
        restrict: "A",
        link: function (scope) {
            // hide the element initially
            scope.data = false;

            scope.$on(_START_REQUEST_, function () {
                // got the request start notification, show the element
                scope.data = true;
            });

            scope.$on(_END_REQUEST_, function () {
                // got the request end notification, hide the element
                scope.data = false;
            });
        }
    };
}]);