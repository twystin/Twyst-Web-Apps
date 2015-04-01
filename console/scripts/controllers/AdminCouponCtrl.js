twystConsole.controller('AdminCouponCtrl', function($scope, $http, $modal, $location, $routeParams, authService, adminCouponService) {
  $scope.reward_check = [{
    "text": "Discount",
    value: "discount"
  }, {
    "text": "Flat off",
    value: "flat"
  }, {
    "text": "Free ",
    value: "free"
  }, {
    "text": "Buy one get one ",
    value: "buy_one_get_one"
  }, {
    "text": "Happy hours",
    value: "happy"
  }, {
    "text": "Reduced price ",
    value: "reduced"
  }, {
    "text": "Custom ",
    value: "custom"
  }];

  $scope.outletQuery = function() {
    adminCouponService.getOutlets().then(function(data) {
      $scope.outlets = data;
    }, function(err) {
      console.log(err);
    })
  }

  $scope.createCoupon = function() {
    adminCouponService.getUser($scope.temp.phone).then(function(data) {
      var d = JSON.parse(data.data.info);
      if (d.length === 0) {
        console.log("No such user");
      } else {
        $scope.coupon.issue_details.issued_to = d[0]._id;
        $scope.coupon.issue_details.issued_at.push($scope.temp.issued_at);
        adminCouponService.saveCoupon($scope.coupon).then(function(data) {
          console.log(data);
        }, function(err) {
          console.log(err);
        })
      }
    }, function(err) {
      console.log(err);
    });
  }

  $scope.coupon = {
    basics: {
      description: null
    },
    validity: {
      earn_start: null,
      earn_end: null,
      coupon_valid_days: null
    },
    issue_details: {
      issued_at: [],
      issued_to: null,
      issued_by: 'twyst',
      issue_source: 'console'
    },
    terms: null
  }
});
