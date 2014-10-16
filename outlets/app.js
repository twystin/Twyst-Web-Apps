
var outletApp = angular.module('outletApp', ["ezfb", "ngRoute", 'ui.bootstrap', 'ngCookies', 'd3onut', 'AngularGM', 'slick', 'twyst.data']);

outletApp.filter('replaceComma', function () {
  return function (item) {
    return item ? item.replace(/,/g, ', ') : '';
  };
});

outletApp.directive('wrapOwlcarousel', function () {
  return {
    restrict: 'E',
    link: function (scope, element) {
      var options = scope.$eval($(element).attr('data-options'));
      $(element).owlCarousel(options);
    }
  };
});
outletApp.directive('fancybox', function ($compile) {
  return {
    restrict: 'A',
    replace: false,
    link: function ($scope, element) {

      $scope.open_fancybox = function () {

        var el = angular.element(element.html()),

          compiled = $compile(el);
        $.fancybox.open(el);

        compiled($scope);

      };
    }
  };
});
outletApp.directive('backgroundImage', function () {
  return function (scope, element, attrs) {
    attrs.$observe('backgroundImage', function (value) {
      if (value) {
        var url = 'http://s3-us-west-2.amazonaws.com/twystmerchantpages/merchants/' + value + '/Background.png';
        element.css({'background': "url('" + url + "')"});
      }
    });
  };
});
outletApp.directive('slickSlider', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $timeout(function () {
        var options = scope.$eval(attrs.slickSlider);
        $(element).slick({
          infinite: true,
          slidesToShow: 7,
          slidesToScroll: 2,
          rtl: true,
          autoplay: true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 7,
                slidesToScroll: 7,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 5
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: false
              }
            },
            {
              breakpoint: 539,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                dots: false
              }
            }
          ]
        });
      });
    }
  };
});
outletApp.directive('sliderSlick', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $timeout(function () {
        var options = scope.$eval(attrs.sliderSlick);
        $(element).slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 2,
          rtl: true,
          autoplay: false,
          accessibility: true,
          arrows: true,
          focusOnSelect: true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 670,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                dots: true
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                dots: true
              }
          }
  ]
         });
     });
   }
 }
}); 
outletApp.directive('sliderSingle',function ($timeout){
 return {
   restrict: 'A',
   link: function (scope,element,attrs) {
     $timeout(function () {
        var options = scope.$eval(attrs.sliderSlick);
         $(element).slick({
          infinite: false,
          slidesToShow: 1,
          rtl: true,
          autoplay: false, 
          arrows: true
         });
     });
   }
 }
}); 
// outletApp.controller('MapCtrl', ['$scope', function ($scope) {
//     $scope.mapOptions = {
//       center: new google.maps.LatLng(35.784, -78.670),
//       zoom: 15,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//   }]);
outletApp.controller('DiscoverCtrl', function ($scope, $http, dataSvc, $window, angulargmUtils) {
    $scope.userlocation = false;
    var lat = 28.47178,
        lon = 77.1016;
    getUserData(lat, lon);
    setMapData(lat, lon);
    $scope.getLocation = function () {
            $window.navigator.geolocation.getCurrentPosition(function(position) {
              $scope.$apply(function() {
                  $scope.location = position;
                  if(position && position.coords && position.coords.latitude && position.coords.longitude) {
                    lat = position.coords.latitude;
                    lon = position.coords.longitude;
                    $scope.userlocation = true;
                  }
                  getUserData(lat, lon);
                  
              });
              }, function(error) {
                  $scope.message="Error getting location automatically. Please enter co-ordinates manually.";
                  console.log(error);
          });

    }

    function getUserData(latitude, longitude) {
      dataSvc.getUserDataInfo(latitude, longitude).then(function (data) {
          $scope.data = data.data;
     });
    }

     $scope.getLocation();
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
});
outletApp.controller('OutletCtrl', function ($scope, $routeParams, outletService, $modal, $http) {

  $scope.getOutletOpts = function (outlet) {
   return angular.extend(
     { title: outlet.name },
     $scope.options.outlets
     );
 };
 $scope.isCollapsed = true;
$scope.open = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'templates/_partials/slider_modal.html',
      size: size,
      scope: $scope
    })
  };
$scope.mapOpen = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'templates/_partials/modal_map.html',
      size: size,
      scope: $scope
    })
  };


 $scope.selectOutlet = function (outlet, marker) {
  if ($scope.prev) {
    $scope.prev.setOptions($scope.options.outlets);
  }
  $scope.prev = marker;
  marker.setOptions($scope.options.selected);
};

$scope.getSlugs = function () {
  outletService.getSlugs().then(function (data) {
    $scope.slugs = data;

  });
}
$scope.hidePanel = function () {
   var key = $scope.outlet.basics.slug;
    $http.get('https://s3-us-west-2.amazonaws.com/twystmerchantpages/merchants/' + key + '/' + key + '1.png').success(function (data){
      $scope.hide_image_panel = false;
    }).error(function (data) {
      $scope.hide_image_panel = true;
    });
}
$scope.getOutlet = function () {

  var outlet_id = $routeParams.outlet_id;
  outletService.getOutlet(outlet_id).then(function (data) {
    $scope.outlet = data.OUTLET;
     $scope.rewards = data.REWARDS;
     if($scope.outlet) {
      setMapData();
     }
    })
};

function setMapData() {
  $scope.options = {
    map: {
      center: new google.maps.LatLng($scope.outlet.contact.location.coords.latitude, $scope.outlet.contact.location.coords.longitude),
      zoom: 14,
      mapTypeId: google.maps.MapTypeId.TERRAIN
    },
    outlets: {
      icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
    },
    selected: {
      icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/yellow-dot.png',
    }
  };
  
  $scope.outlets = [
  {
    name: $scope.outlet.basics.name + ', ' + $scope.outlet.contact.location.locality_1.toString(),
    img: 'http://www.thetrackerfoundation.org/Images/MountRainier_SM.jpg',
    elevationMeters: 4392,
    location: {
      lat: $scope.outlet.contact.location.coords.latitude, 
      lng: $scope.outlet.contact.location.coords.longitude  
    }
  }
  ];
}

$scope.getOutlet();



$scope.getUrI = function (outlet) {
  if (outlet && outlet.links) {
   var outlet_fb_url = outlet.links.facebook_url.slice(13);
   return outlet_fb_url;  
 };
 return null;
};
$scope.getUrITwitter = function (outlet) {
  if (outlet && outlet.links) {
   var outlet_twitter_url = outlet.links.twitter_url.slice(12);
   return outlet_twitter_url;  
 };
 return null;
};
$scope.getPosts = function (outlet) {
  if (outlet && outlet.links) {
    outletService.getPosts($scope.getUrI(outlet));
  };
};
$scope.getCostForTwoText = function (outlet) {
  if(outlet && outlet.attributes && outlet.attributes.cost_for_two.min
    && outlet.attributes.cost_for_two.max) {
    var costs = ["100", "300", "500", "1000","1500","2000", "2500", "3000", "> 3000"],
  bottom = Number(outlet.attributes.cost_for_two.min) - 1,
  top = Number(outlet.attributes.cost_for_two.max) - 1;

  if (bottom < top) {
    return [costs[bottom], costs[top]];
  }
}   
};

}).factory('outletService', function ($http, $q) {
  var outletService = {};
  outletService.getOutlet = function (outlet_id) {
    var deferred = $q.defer();

    $http({
      url: '/api/v1/publicview/outlets/' + outlet_id,
      method: 'GET'
    }).success(function (data) {
      deferred.resolve(data.info);
    }).error(function (data) {
      deferred.resolve(data);
    });

    return deferred.promise;
  };
  outletService.getPosts = function (outlet_fb_url) {

    $http.jsonp('https://graph.facebook.com/' + outlet_fb_url + '/feed?access_token=' +  "CAACEdEose0cBAJjoP2sZCrZBZBCWzGcobdwLQUgR3FqXi7D97CZB2dpCTwZBhOFMwqjnefVpJcK6SqfVZBpw6vTRy9KnpxYlS3jtrYmxp4ifMiD4ZCxSbB98C4kZApTmGxfPtmO1cZApWOreasYiZA3rQ5AFoZCkGo5PLuzcOYrqUsGgILIvg7SOPdQhPzretP0ey2Xc1OZAmPXa2sGSHk6HgOTZC?callback=JSON_CALLBACK").success(function (data) {
      console.log(data);
    }).error(function (data) {
     console.log(data);
   });                                                                                         
  };
  // outletService.getLocation = function () {
  //   var deferred = $q.defer();
  //   $http({
  //     url: '/api/v2/data/28/77',
  //     method: 'GET'
  //   }).success(function (data) {
  //     deferred.resolve (data.info);
  //   }).error(function (data) {
  //     deferred.resolve(data);
  //   });
  //   return deferred.promise;
  // };
  outletService.getSlugs = function () {

    var deferred = $q.defer();

    $http({
      url: '/api/v2/outlets/slugs',
      method: 'GET'
    }).success(function (data) {
      deferred.resolve(data.info);
    }).error(function (data) {
      deferred.resolve(data);
    });

    return deferred.promise;                                                                                         
  };
  return outletService;
}).config(function (ezfbProvider, $routeProvider, $httpProvider){
  ezfbProvider.setInitParams({
    appId: '763534923659747'
  });

  $routeProvider.
  when('/discover',{
    templateUrl: './templates/discover.html',
    controller: 'OutletCtrl'
  }).
  when('/nearby',{
    templateUrl: './templates/nearby.html',
    controller: 'OutletCtrl'
  }).
  when('/:outlet_id',{
    templateUrl: './templates/outlet_view.html',
    controller: 'OutletCtrl'
  })

})