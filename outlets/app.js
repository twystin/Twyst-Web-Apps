
var outletApp = angular.module('outletApp', ["ngRoute", 'ui.bootstrap', 'ngCookies', 'd3onut', 'AngularGM', 'slick']);

outletApp.directive('wrapOwlcarousel', function () {
  return {
    restrict: 'E',
    link: function (scope, element, attrs) {
      var options = scope.$eval($(element).attr('data-options'));
      $(element).owlCarousel(options);
    }
  };
});
outletApp.directive('fancybox', function ($compile) {
  return {
    restrict: 'A',
    replace: false,
    link: function ($scope, element, attrs) {

      $scope.open_fancybox = function () {

        var el = angular.element(element.html()),

          compiled = $compile(el);
        $.fancybox.open(el);

        compiled($scope);

      };
    }
  };
});
outletApp.directive('backgroundImage', function() {
  return function(scope, element, attrs){
      attrs.$observe('backgroundImage', function(value) {
          if(value) {
            var url = 'http://s3-us-west-2.amazonaws.com/twystmerchantpages/' + value + '.png';
            element.css({'background': "url('"+ url +"')"});
          }
      });
  };
});
outletApp.directive('slickSlider',function($timeout){
 return {
   restrict: 'A',
   link: function(scope,element,attrs) {
     $timeout(function() {
        var options = scope.$eval(attrs.slickSlider);
         $(element).slick({
          infinite: true,
          slidesToShow: 7,
          slidesToScroll: 7,
          rtl: true,
          autoplay: true,
          autoplaySpeed: 2000,
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
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                dots: true
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 2,
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
outletApp.directive('sliderSlick',function($timeout){
 return {
   restrict: 'A',
   link: function(scope,element,attrs) {
     $timeout(function() {
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
            breakpoint: 600,
            settings: {
              slidesToShow: 1,
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
outletApp.directive('sliderSingle',function($timeout){
 return {
   restrict: 'A',
   link: function(scope,element,attrs) {
     $timeout(function() {
        var options = scope.$eval(attrs.sliderSlick);
         $(element).slick({
          centerPadding: '50px',
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

outletApp.controller('OutletCtrl', function ($scope, $routeParams, outletService, $modal) {

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
 // $scope.$watch('outlet.basics.name', function () {
 //  if($scope.outlet) {
 //    var url = 'http://s3-us-west-2.amazonaws.com/twystmerchantpages/' + $scope.outlet.basics.name + '.png';
 //    // console.log("url('"+ url +"')")
 //    $('#image_background').css('background', "url('"+ url +"')");
 //  }
 // })

 // $scope.getBackImage = function (name) {
 //  var name = outlet.basics.name
 //  $scope.bck_image = {
 //    'background': 'url(https://s3-us-west-2.amazonaws.com/twystmerchantpages/'+ name +'.png)'
 //  }
 // }

 $scope.selectOutlet = function (outlet, marker) {
  if ($scope.prev) {
    $scope.prev.setOptions($scope.options.outlets);
  }
  $scope.prev = marker;
  marker.setOptions($scope.options.selected);
};

($scope.getOutlet = function () {

  var outlet_id = $routeParams.outlet_id;
  outletService.getOutlet(outlet_id).then(function(data) {
    $scope.outlet = data.OUTLET;
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
//scope.center = new google.maps.LatLng($scope.outlet.contact.location.coords.latitude, $scope.outlet.contact.location.coords.longitude);
             //$scope.volcanoes[0].location.lat = $scope.outlet.contact.location.coords.latitude;
             //$scope.volcanoes[0].location.lng = $scope.outlet.contact.location.coords.longitude;
            // $scope.zoom = 14;
            //  $scope.options = {
            //   volcanoes: {
            //      icon: 'https://maps.gstatic.com/mapfiles/ms2/micons/red-dot.png',
            //     }
            // };
            // $scope.volcanoes = [
            //     {
            //       id: 0,
            //       name: 'Mount Rainier',
            //       location: {
            //         lat: $scope.outlet.contact.location.coords.latitude, 
            //         lng: $scope.outlet.contact.location.coords.longitude
            //     }
            // }];
            $scope.rewards = data.REWARDS;
          })
})();

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
  return outletService;
}).config(function ($routeProvider, $httpProvider){
  $routeProvider.
  when('/:outlet_id',{
    templateUrl: './templates/outlet_view.html',
    controller: 'OutletCtrl'
  })

})
