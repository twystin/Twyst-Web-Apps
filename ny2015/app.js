angular.module('newYearApp', ['ui.bootstrap'])
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
.factory('newYearSvc', function($http, $q) {
    var newYearSvc = {};
    newYearSvc.getFeatured = function (start, end, q) {
        var deferred = $q.defer();
        $http.get(
            '/api/v3/new_year_outlets?start=' + start + '&end=' + end + '&q=' + q 
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };
    newYearSvc.addEntry = function (user) {
        var deferred = $q.defer();
        $http({
            url: '/api/v3/new_year',
            method: 'POST',
            data: user
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };
    return newYearSvc;
})
.controller('NewYearCtrl', function($scope, $window, newYearSvc, $modal) {
    $scope.user = {};
    $scope.done = false;

    $scope.getFeatured = function () {
        $scope.searched = false;
        $scope.q = $scope.q || '';
        newYearSvc.getFeatured($scope.start, $scope.end, $scope.q).then(function (data) {
            $scope.results = data.info.results;
            $scope.total = data.info.total;
            scrollToTop();
            if($scope.q) {
                $scope.searched = true;
            }
        })
    }

    $scope.isNew = function (outlet) {
        var date = new Date(outlet.basics.created_at).getTime() + 1296000000;
        if(date >= new Date().getTime()) {
            return true;
        }
        return false;
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

    function scrollToTop() {
        $window.scrollTo(0,0)
    }

    $scope.addEntry = function () {
        $scope.user.outlet = $scope.outlet._id;
        newYearSvc.addEntry($scope.user).then(function (data) {
            $scope.user = {};
            $scope.done = true;
        })
    }

    $scope.fire = function () {
        $scope.done = false;
    }

    $scope.getDataModal = function (outlet) {
        $scope.outlet = outlet;
        var modalInstance = $modal.open({
            templateUrl: '_modal.html',
            backdrop: 'static',
            size: null,
            scope: $scope
        })
    };

    $scope.openUnknown = function () {
        var modalInstance = $modal.open({
            templateUrl: '_unknown.html',
            backdrop: 'static',
            size: null,
            scope: $scope
        })
    }
})
.controller('DatePickerCtrl', function ($scope, $timeout) {
    $scope.today = function() {
        $scope.dt = new Date();
    };
    $scope.today();

    $scope.showWeeks = true;
    $scope.toggleWeeks = function () {
        $scope.showWeeks = ! $scope.showWeeks;
    };

    $scope.clear = function () {
        $scope.dt = null;
    };

    $scope.toggleMin = function() {
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
    };
    $scope.toggleMin();

    $scope.open = function() {
        $timeout(function() {
            $scope.opened = true;
        });
    };

    $scope.dateOptions = {
        'year-format': "'yy'",
        'starting-day': 1
    };

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'shortDate'];
    $scope.format = $scope.formats[0];
});