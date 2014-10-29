outletApp.controller('NearbyCtrl', function ($scope, $http, dataSvc, $window, angulargmUtils) {
	var lat = 28.47178,
        lon = 77.1016;
     setMapData(lat, lon);
     getUserLocation();
     
     function getUserLocation () {
      console.log( dataSvc.getUserLocation())
      dataSvc.getUserLocation().then(function (position) {
          $scope.position = position;
          // console.log("This is" + $scope.position.coords.latitude);
          lat = $scope.position.coords.latitude;
          lon = $scope.position.coords.longitude;
          getUserData(lat, lon);
      }, function (reason) {
          getUserData(lat, lon);
          console.log("Could not be determined.");
      });
     }
    function getUserData() {
      dataSvc.getUserDataInfo().then(function (data) {
          $scope.data = data.data;
          console.log($scope.data);
     });
    }


	function setMapData(lat, lon) {
      $scope.options = {
        map: {
          center: new google.maps.LatLng(lat, lon),
          zoom: 13,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        },
        outlets: {
          icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
        },
      };
    console.log($scope.options.map.center)

   
    $scope.outlets = [
    {
      name: 'nearby outlets',
      elevationMeters: 4392,
      location: {
        lat: lat, 
        lng: lon
      }
    }
    ];
  }
  $scope.openInfoWindow = function(data) {
    var d = {
      lat: data.contact.location.coords.latitude,
      lng: data.contact.location.coords.longitude
    }
    $scope.markerEvents = [
      {
        event: 'openinfowindow',
        locations: [angulargmUtils.objToLatLng(d)]
      },
    ];
  }
})