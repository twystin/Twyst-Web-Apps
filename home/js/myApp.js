var myApp = angular.module("myApp", ["firebase"]);

myApp.controller('MyController', ['$scope', '$firebase',
  function($scope, $firebase) {
    //CREATE A FIREBASE REFERENCE
    var ref = new Firebase("https://twyst-contest.firebaseio.com/");

    // GET MESSAGES AS AN ARRAY
    $scope.messages = $firebase(ref).$asArray();

    //ADD MESSAGE METHOD
    $scope.addMessage = function() {
      console.log("inside addMessage");
      //LISTEN FOR RETURN KEY
      //if (e.keyCode === 13 && $scope.msg) {
        //ALLOW CUSTOM OR ANONYMOUS USER NAMES
        //var name = $scope.name || 'anonymous';

        //ADD TO FIREBASE
        $scope.messages.$add({
          from: $scope.name,
          body: $scope.email
        });

        //RESET MESSAGE
        //$scope.msg = "";
      //}
    }
  }
]);
// var myApp = angular.module("myApp", ["firebase"]);

// // a factory to create a re-usable profile object
// // we pass in a username and get back their synchronized data
// myApp.factory("Profile", ["$firebase",
//   function($firebase) {
//     return function(username) {
//       // create a reference to the user's profile
//       var ref = new Firebase("https://twyst-contest.firebaseio.com/profiles/").child(username);

//       // return it as a synchronized object
//       return $firebase(ref).$asObject();
//     }
//   }
// ]);

// appaf.controller("ProfileCtrl", ["$scope", "Profile",
//   function($scope, Profile) {
//     // put our profile in the scope for use in DOM
//     console.log("inside");
//     $scope.profile = Profile("rishiag");
//   }
// ]);
     // var appaf = angular.module('myapp', ['firebase']);


     // appaf.controller("UserCtrl", ["$scope", "$firebase",
     //   function($scope, $firebase) {
     //     var ref = new Firebase("https://twyst-contest.firebaseio.com/");
     //     // create an AngularFire reference to the data
     //     var sync = $firebase(ref);
     //     // download the data into a local object
     //     $scope.data = sync.$asObject();
     //   }
     // ]);
     // myapp.controller('BookCtrl', ['$scope', 'angularFire',  
     //   function BookCtrl($scope, angularFire) {
     //     var url = 'https://twyst-contest.firebaseio.com/';
     //     var promise = angularFire(url, $scope, 'users', []);
     //     $scope.newUser = {};

     //     promise.then(function() {
     //       startWatch($scope);
     //     });
     //   }
     // ]);

     // function startWatch($scope) {  
     //   $scope.add = function() {
     //     console.log($scope.newUser);
     //     $scope.users.push($scope.newUser);
     //     $scope.newUser = '';
     //   }
     // }