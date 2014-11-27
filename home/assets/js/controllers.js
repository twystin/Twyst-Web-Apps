angular.module('twystApp', ['ngAnimate'])
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
.factory('featuredSvc', function($http, $q) {
    var featuredSvc = {};
    featuredSvc.getFeatured = function () {
        var deferred = $q.defer();
        $http.get('/api/v3/featured_outlets').success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });
        
        return deferred.promise;
    };
    return featuredSvc;
})
.controller('FeaturedCtrl', function($scope, featuredSvc) {
    $scope.getFeatured = function () {
        featuredSvc.getFeatured().then(function (data) {
            $scope.outlets = data.info;
        })
    }
})
.controller('ContactCtrl', function($scope, $http) {
    $scope.user = {};
    $scope.user.thank_you = false;
    $scope.user.error = false;

    $scope.contact = function () {
        if ($scope.user.name &&
            $scope.user.message &&
            $scope.user.email) {

            $http.post('/api/v1/beta/users',
                {   name  : $scope.user.name,
                    message : $scope.user.message,
                    email : $scope.user.email
                })
                .success(function (data, status, header, config) {
                    $scope.user = {};
                    $scope.user.thank_you = true;
                    $scope.user.error = false;
                })
                .error(function (data, status, header, config) {
                    $scope.user.error = true;
                    $scope.user.thank_you = false;
                });
        }
        else {
            $scope.user.thank_you = false;
            $scope.user.error = false;
        }
    };
    
});