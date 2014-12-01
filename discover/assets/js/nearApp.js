angular.module('nearApp', ['uiGmapgoogle-maps'])
.directive('backgroundImage', function () {
  return function (scope, element, attrs) {
    attrs.$observe('backgroundImage', function (value) {
      if (value) {
        var url = 'http://s3-us-west-2.amazonaws.com/twyst-outlets/' + value;
        element.css({
            'background': "url('" + url + "')",
            'background-size':   'cover',                     /* <------ */
            'background-repeat': 'no-repeat',
            'background-position': 'center center' 
        });
      }
    });
  };
})
.factory('nearSvc', function($http, $q) {
    var nearSvc = {};
    nearSvc.getNear = function (lat, lon, dis, q) {
        var deferred = $q.defer();
        $http.get(
            '/api/v3/discovered_near_outlets?lat=' + lat + '&lon=' + lon + '&distance=' + dis + '&q=' + q 
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };
    return nearSvc;
})
.controller('NearCtrl', function($scope, $window, nearSvc) {
    $scope.map = { center: { latitude: null, longitude: null }, zoom: 12 };
    $scope.marker = {
        id: 0,
        coords: {
            latitude: null, 
            longitude: null
        }
    };
    $scope.distance = 6;

    $scope.getLocation = function () {
        var options = {
            enableHighAccuracy: true,
            timeout: 60000,
            maximumAge: 0
        };
        navigator.geolocation.getCurrentPosition (
            locationSuccess, 
            locationError,
            options
        );
    }

    function locationSuccess(position) {
        $scope.map.center = position.coords;
        $scope.marker.coords = position.coords;
        $scope.$apply(function () {
            $scope.getNear();
        });
    }

    function locationError(error) {
        locationErrorHandler(error);
    }

    function locationErrorHandler(error) {
        var error_message;
        switch(error.code) {
            case 1: 
                error_message = "You have denied the location access.";
                break;
            case 2: 
                error_message = "Your location is not available.";
                break;
            case 3: 
                error_message = "Your location access timed-out.";
                break;
        }
        $window.alert(error_message);
    }

    $scope.search = function () {
        $scope.getNear();
    }

    $scope.getNear = function () {
        $scope.searched = false;
        $scope.q = $scope.q || '';
        nearSvc.getNear(
            $scope.map.center.latitude, 
            $scope.map.center.longitude,
            $scope.distance, 
            $scope.q
        ).then(function (data) {
            $scope.results = setIcons(data.info);
            if($scope.q) {
                $scope.searched = true;
            }
        })
    }

    function setIcons(results) {
        results.forEach(function (r) {
            r.icon = "icons/" + (r.outlet.basics.icon ? r.outlet.basics.icon : r.outlet.basics.is_a) + '.png';
        });
        return results;
    }

    $scope.getMobileOperatingSystem = function () {
        var userAgent = navigator.userAgent || navigator.vendor || window.opera;
        if( userAgent.match( /iPad/i ) || userAgent.match( /iPhone/i ) || userAgent.match( /iPod/i ) )
        {
          return 'iOS';

        }
        else if( userAgent.match( /Android/i ) )
        {
          return 'Android';
        }
        else
        {
          return 'unknown';
        }
    }
});