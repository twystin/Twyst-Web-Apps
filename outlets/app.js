
var outletApp = angular.module('outletApp', ["ezfb", "ngRoute", 'ui.bootstrap', 'ngCookies', 'AngularGM', 'slick', 'twyst.data', 'login', 'flash']);

outletApp.filter('replaceComma', function () {
  return function (item) {
    return item ? item.replace(/,/g, ', ') : '';
  };
});


// outletApp.controller('MapCtrl', ['$scope', function ($scope) {
//     $scope.mapOptions = {
//       center: new google.maps.LatLng(35.784, -78.670),
//       zoom: 15,
//       mapTypeId: google.maps.MapTypeId.ROADMAP
//     };
//   }]);

outletApp.controller('OutletCtrl', function ($scope, $rootScope, $routeParams, outletService, $modal, $http, $window, $location) {

  $scope.counter = 3;
  $scope.count_limit = 3;

  $scope.updateCounter = function (count) {
    $scope.counter += count;
  }

  $scope.checkMobile = function () {
    if ($window.innerWidth < 850) {
      $scope.counter = 5;
      $scope.count_limit = 5;
      $rootScope.locations = $rootScope.locations || [];
      $rootScope.locations.push($location.url());
      //console.log("LOCATON IS" + JSON.stringify($location.url()));
      //$rootScope.location = $location;
      //console.log($rootScope.location);

      return true;

    }
    return false;
  };
  // $scope.appendDivs  = function () {
  //   if ($window.innerWidth < 850) {
  //     $("#facebook_panel_right").insertAfter("#callout_heading_panel_overview");
  //     console.log("hey there");
  //   };
  // }

  $scope.checkMobile();
  // $scope.appendDivs();
  $scope.closemodalMobile = function (slug) {
    // console.log($rootScope.locations);
    $location.url($rootScope.locations[0]);
  };

  $scope.getSlugForImages = function () {
    $scope.slug = $routeParams.outlet_slug;
  }

  $scope.mobileImages = function (outlet) {
    var outlet_slug = $scope.outlet.basics.slug;
    $location.path('/carousel/'+ outlet_slug);    
  };

  $scope.getOutletOpts = function (outlet) {
   return angular.extend(
     { title: outlet.name },
     $scope.options.outlets
     );
 };
 $scope.isCollapsed = true;
$scope.open = function (size) {
     var modalInstance = $modal.open({
      templateUrl: 'state/_partials/slider_modal.html',
      size: size,
      scope: $scope
    })
  };
$scope.mapOpen = function (size) {

    var modalInstance = $modal.open({
      templateUrl: 'state/_partials/modal_map.html',
      size: size,
      scope: $scope
    })
  };

  $scope.share = function () {
    FB.ui({
        app_id: '763534923659747',
        method: 'feed',
        name: $scope.outlet.basics.name,
        picture: "https://s3-us-west-2.amazonaws.com/twystmerchantpages/merchants/" + $scope.outlet.basics.slug + "/logo1.png",
        link: 'http://twyst.in/outlets/#/' + $scope.outlet.publicUrl[0],
        caption: $scope.outlet.contact.location.locality_1[0] + ', ' + $scope.outlet.contact.location.locality_2[0] + ', ' + $scope.outlet.contact.location.city,
        description: ($scope.rewards && $scope.rewards.length) ? $scope.rewards[$scope.rewards.length - 1].title + ' and much more.' : ''
    }, function (response) {
      console.log(response)
    });
  }


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
    $rootScope.o = data.OUTLET;
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
    appId: '763534923659747',
    version    : 'v2.1'
  });

  $routeProvider.
  when('/discover',{
    templateUrl: 'state/discover/discover.html',
    controller: 'DiscoverCtrl'
  }).
  when('/nearby',{
    templateUrl: 'state/nearby/nearby.html',
    controller: 'NearbyCtrl'
  }).
  when('/login',{
    templateUrl: 'state/login/login.html',
    controller: 'OutletCtrl'
  }).
  when('/otp',{
    templateUrl: 'state/login/otp.html',
    controller: 'OutletCtrl'
  }).
  when('/carousel/:outlet_slug',{
    templateUrl: 'state/_partials/slider_mobile.html',
    controller: 'OutletCtrl'
  }).
  when('/:outlet_id',{
    templateUrl: 'state/outlet_view/outlet_view.html',
    controller: 'OutletCtrl'
  })

})