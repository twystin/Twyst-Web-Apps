
var outletApp = angular.module('outletApp',["ngRoute",'ui.bootstrap','ngCookies','d3onut']);

outletApp.controller('OutletCtrl', function($scope, $routeParams, outletService) {
	($scope.getOutlet = function() {
		var outlet_id = $routeParams.outlet_id;
		outletService.getOutlet(outlet_id).then(function(data) {
			$scope.outlet = data.OUTLET;
			$scope.rewards = data.REWARDS;
		})
	})();
    $scope.getUrI = function(outlet) {
        if (outlet && outlet.links) {
           var outlet_fb_url = outlet.links.facebook_url.slice(13);
            return outlet_fb_url;  
        };
       return null;
    };
     $scope.getUrITwitter = function(outlet) {
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
        if(outlet.attributes.cost_for_two.min
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
