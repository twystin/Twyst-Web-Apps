angular.module('discoverApp', [])
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
.factory('discoverSvc', function($http, $q) {
    var discoverSvc = {};
    discoverSvc.getFeatured = function (start, end, q) {
        var deferred = $q.defer();
        $http.get(
            '/api/v3/discovered_outlets?start=' + start + '&end=' + end + '&q=' + q 
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };
    return discoverSvc;
})
.controller('DiscoverCtrl', function($scope, $window, discoverSvc) {
    function init() {
        $scope.start = 1;
        $scope.end = 10;
        $scope.lim = 9;
    }
    init();

    function isMobile() {
        if($window.innerWidth < 768) {
            return true;
        }
        return false;
    }

    $scope.search = function () {
        init();
        $scope.getFeatured();
    }

    $scope.loadMore = function () {
        $scope.start = $scope.end;
        $scope.end = $scope.start + $scope.lim;
        if($scope.end > $scope.total) {
            init();
        }
        $scope.getFeatured();
    }

    $scope.getFeatured = function () {
        $scope.q = $scope.q || '';
        discoverSvc.getFeatured($scope.start, $scope.end, $scope.q).then(function (data) {
            $scope.results = data.info.results;
            $scope.total = data.info.total;
        })
    }
});