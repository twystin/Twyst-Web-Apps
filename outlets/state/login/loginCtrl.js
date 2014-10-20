outletApp.controller('loginCtrl', function ($scope, $timeout, $rootScope, loginSvc, flash, $location){

  $scope.login = function () {
   console.log($scope.phone);
   var promise = loginSvc.login($scope.phone);
   promise.then(function(success) {
    console.log("signed in");
    flash("You have been successfully logged in");
    $location.path('/discover');
  }, function(error) {
    if (error === 'Unauthorized') {
      console.log("Unauthorized");
      flash("Please sign up");
    } else {
      console.log("error");
      flash("We could not sign you in. Please try again.");
    }
  });
 };

 $scope.getotp = function () {
  console.log($scope.phone);
  var verification = false
  var promise = loginSvc.getOTP($scope.phone);
   promise.then(function(success) {
      flash("You should receive an OTP code soon.");
      // $location.path('/otp');
      $scope.verification = true;
    }, function(error) {
      flash("We could not get an OTP code. Please try again.");
    });
 };

  $scope.verify = function(data) {
    $scope.otp = $scope.vercode;
    var promise = loginSvc.verify($scope.otp, $scope.phone);
    promise.then(function(success) {
      $scope.login();
    }, function(error) {
      flash("Incorrect OTP entered. Please try again.");
      console.log(error.message);
    });
  };

});