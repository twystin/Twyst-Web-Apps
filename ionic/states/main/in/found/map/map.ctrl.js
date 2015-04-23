twystApp.controller('MapCtrl', function($scope, $ionicModal, $state, $timeout, $window, $filter, dataSvc, storageSvc, logSvc) {
    logSvc.page("Map")
    $scope.div = document.getElementById("map_canvas");
    $scope.nearby = storageSvc.get('nearby') || [];

    $scope.showOutletDetails = function(item) {
      console.log("SHOW OUTLET DETAILS " + item);
        $state.go('main.in.found.outlet_details', {
            item: item
        }, {
            inherit: false
        });
    };

    $scope.search = $scope.search || {};
    $scope.search.clicked = false;    

    $scope.createMap = function() {
        $scope.map = plugin.google.maps.Map.getMap($scope.div, {
            'backgroundColor': 'white',
            'controls': {
                'compass': true,
                'myLocationButton': true,
                'indoorPicker': true,
                'zoom': true
            },
            'gestures': {
                'scroll': true,
                'tilt': true,
                'rotate': true
            },
            'camera': {
                'latLng': $scope.me,
                'tilt': 0,
                'zoom': 13,
                'bearing': 50
            }
        });
    };

    $scope.addCircle = function() {
        $scope.map.addCircle({
            'center': $scope.me,
            'radius': 5000,
            'strokeColor': '#b6b6b6',
            'strokeWidth': 5,
            'fillColor': '#ffffff'
        }, function(circle) {
            console.log("ADDED CIRCLE");
        });
    };

    $scope.addMarkers = function() {
        console.log("ADD MARKERS CALLED");
        for (var i = 0; i < $scope.nearby.length; i++) {
            loc = new plugin.google.maps.LatLng(
                $scope.nearby[i].outlet_summary.contact.location.coords.latitude,
                $scope.nearby[i].outlet_summary.contact.location.coords.longitude);

            $scope.map.addMarker({
                'position': loc,
                'icon': 'www/assets/map/' + $scope.nearby[i].outlet_summary.basics.is_a + '.png',
                'title': [$scope.nearby[i].outlet_summary.basics.name,
                    $scope.nearby[i].outlet_summary.contact.location.locality_1[0]
                ].join("\n"),
                'item': $scope.nearby[i].outlet_summary._id,
                'snippet': 'Click to view details',
                'markerClick': infoWindow,
                'infoClick': infoClick
            });
        }
    };

    $scope.getNearby = function(more) {
        dataSvc.getNearby(500).then(function(data) {
            $scope.nearby = data.info.near;
            $scope.me = new plugin.google.maps.LatLng(dataSvc.position.coords.latitude, dataSvc.position.coords.longitude);
            $scope.createMap();
            // $scope.addCircle();
            $scope.addMarkers();
        }, function(error) {
            $scope.me = new plugin.google.maps.LatLng(28, 77);
            $scope.$broadcast('scroll.refreshComplete');

            if (error === 'network_error') {
                dataSvc.showNetworkError();
            } else {
                // $window.navigator.notification.alert(error,
                //     function() {}, "ERROR", "OK");
            }

        });
    };

    $scope.location_error_shown = $scope.location_error_shown || false;
    $scope.$on('no_location', function() {
        if (!$scope.location_error_shown) {
            $window.navigator.notification.alert("Please enable location services and give Twyst access to your location to get accurate distances and map information.",
            function() {}, "CANNOT FIND LOCATION", "OK");
            $scope.location_error_shown = true;
            $timeout(function() {
                $scope.location_error_shown = false;
            }, 1000*60);
        }
    });


    $scope.getNearby();

    $scope.fullView = function() {
        $scope.map.showDialog();
    };

    $scope.redrawMap = function() {
        $scope.search.clicked = true;
        $scope.map.clear();
        var outlets = $filter('filter')($scope.nearby, $scope.searchText);
        for (var i = 0; i < outlets.length; i++) {
            loc = new plugin.google.maps.LatLng(
                outlets[i].outlet_summary.contact.location.coords.latitude,
                outlets[i].outlet_summary.contact.location.coords.longitude);
            $scope.map.addMarker({
                'position': loc,
                'icon': 'www/assets/map/' + $scope.nearby[i].outlet_summary.basics.is_a + '.png',
                'title': [outlets[i].outlet_summary.basics.name, outlets[i].outlet_summary.contact.location.locality_1[0]].join("\n"),
                'item': $scope.nearby[i].outlet_summary._id,
                'snippet': 'Click to view details',
                'markerClick': infoWindow,
                'infoClick': infoClick
            });
        }

        $scope.map.setZoom(12);
        $scope.search.clicked = false;

    };

    $scope.clearMap = function() {
        $scope.map.clear();
    };

    function infoWindow(marker) {
        marker.getPosition(function(latLng) {
            $scope.map.animateCamera({
                'target': latLng,
                'tilt': 30,
                'zoom': 16
            });
        });
    }

    function infoClick(marker) {
        $scope.showOutletDetails(marker.get("item"));
    }

});
