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
    $scope.hoverShow = function () {
      $scope.hoverButton = true;
      console.log($scope.hoverButton);
    };
    $scope.hoverhide = function () {
      $scope.hoverButton = false;
      console.log($scope.hoverButton);
    };

    function getUserData(latitude, longitude) {
      dataSvc.getUserDataInfo(latitude, longitude).then(function (data) {
          $scope.data = data.data;
     });
    }
    $scope.getLocation();

});