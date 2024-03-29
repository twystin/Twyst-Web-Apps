var contestApp = angular.module("contestApp", ["firebase", 'ui.bootstrap']);

contestApp.controller('MyController', ['$scope', '$firebase', '$window',
  function($scope, $firebase, $window) {

    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://twyst-contest.firebaseio.com/users");
    // GET MESSAGES AS AN ARRAY
    $scope.messages = $firebase(ref).$asArray();
    $scope.dob = {
      date: null
    };
    var msg = {}
      //ADD MESSAGE METHOD
    $scope.register = function() {

       $scope.submitted = true;
      var flag = 0;
      new Firebase('https://twyst-contest.firebaseio.com/users/' + $scope.phone).once('value', function(snap) {
        console.log('I fetched a user!', snap.val());
        //var obj=JSON.parse(snap.val());
        if (snap.val()) {
          console.log("inside if");
          console.log("User is already registered");
          $window.alert("You are already registered, keep checking in");
          flag = 1;
        } else {
          console.log("inside else");
         // console.log("You are already registered");

        }
        if (flag==0){
          $scope.addSimple();
        }
        //    alert(obj.dob);
      });
      /*if (flag == 0) {
        if (confirm('Do you also want to connect your Facebook account?')) {
          $scope.addFB();
        } else {
          $scope.addSimple();
        }
      } else {
        alert("You are already registered! Keep checking in!")
      }*/
    }
    $scope.addSimple = function() {
      $scope.hideThis = false;
      $scope.fbConnect = false;
      //ADD TO FIREBASE
      var flag = 0;
      new Firebase('https://twyst-contest.firebaseio.com/users/' + $scope.phone).once('value', function(snap) {
        console.log('I fetched a user!', snap.val());
        //var obj=JSON.parse(snap.val());
        /*if (snap.val()) {
          console.log("true");
          flag = 1;
        } else {
          console.log("You are already registered");

        }*/
        //    alert(obj.dob);
      });
      //if (flag == 0) {
        var ref2 = new Firebase("https://twyst-contest.firebaseio.com/users/" + $scope.phone);
        //var msg = {}

        msg = {
          username: $scope.username,
          email: $scope.email,
          dob: $scope.dob.date.toString()
        };

        //$scope.messages.$add(msg);
        ref2.set(msg);
      //}
      $scope.msg = "";
      $scope.hideThis = true;
    }
    $scope.addFB = function() {
      //     var firebaseRef = new Firebase("https://twyst-contest.firebaseio.com/");

      var flag = 0;
      new Firebase('https://twyst-contest.firebaseio.com/users/' + $scope.phone+"/accessToken").once('value', function(snap) {
        console.log('I fetched access token!', snap.val());
        
        //var obj=JSON.parse(snap.val());
        if (snap.val()) {
          console.log("facebook is already registered");
          $window.alert("Your facebook is already connected, keep checking in");
          flag = 1;
        } else {
          console.log("Your facebook is not registered");

        }
        //    alert(obj.dob);
      });
      if (flag == 0) {
        var ref2 = new Firebase("https://twyst-contest.firebaseio.com/users/" + $scope.phone);
        //var msg = {};
        var auth = new FirebaseSimpleLogin(ref, function(error, user) {
          if (error) {
            // an error occurred while attempting login
            console.log('an error occurred:');
            console.log(error);
          } else if (user) {
            // user authenticated with Firebase
            console.log('logged in:');
            console.log(user);
            var dob = $scope.dob;
              if (!$scope.dob) {
                dob = 'null';
              }
            msg = {
              username: $scope.username,
              email: $scope.email,
              dob: dob,
              accessToken: user.accessToken,
              id: user.id
            };

            //$scope.messages.$add(msg);
            ref2.set(msg);
            $scope.fbConnect = true;
          } else {
            // user is logged out
            console.log('logged out');
          }
        }); // Note: Attach this to a click event to permit the pop-up to be shown
        auth.logout();
        auth.login('facebook');


      }
      $scope.msg = "";
    }
  }
]);
contestApp.directive('wrapOwlcarousel', function () {  
    return {  
        restrict: 'E',  
        link: function (scope, element, attrs) {  
            var options = scope.$eval($(element).attr('data-options'));  
            $(element).owlCarousel(options);  
        }  
    };  
}); 
contestApp.controller('DatePickerCtrl', function ($scope, $timeout) {
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
        $scope.minDate = new Date (1914-01-01);
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