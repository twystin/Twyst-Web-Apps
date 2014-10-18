outletApp.controller('DiscoverCtrl', function ($scope, $http, dataSvc, $window, angulargmUtils) {
    $scope.userlocation = false;
    var lat = 28.47178,
        lon = 77.1016;
    getUserData(lat, lon);
    $scope.getLocation = function () {
      dataSvc.getUserLocation().then( function (position) {
        $scope.position = position;
      });
    }

    function getUserData(latitude, longitude) {
      dataSvc.getUserDataInfo(latitude, longitude).then(function (data) {
          $scope.data = data.data;
     });
    }
    $scope.getLocation();

});