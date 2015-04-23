 twystApp.controller('RewardDetailsCtrl', function($scope, $state, $window, urlp, $ionicLoading, dataSvc, item, storageSvc, $rootScope, logSvc) {
    logSvc.page("Reward Details");
     var r = dataSvc.rewards || null;
     var i = 0;
     $scope.item = item.item || null;

     $scope.rewards = (r && r.info.vouchers.ACTIVE) || [];
     for (i = 0; i < $scope.rewards.length; i++) {
         if ($scope.rewards[i].voucher._id === item.item) {
             $scope.reward = $scope.rewards[i];
             console.log("REWARD DETAIL " + JSON.stringify($scope.reward));
             break;
         } else {
             $scope.reward = null;
         }
     }

     $scope.is_redeemed = function(id) {
         var redeemed = storageSvc.get('redeemed');
         return redeemed && redeemed[id] && redeemed[id].status;
     };

     $scope.days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

     $scope.format_time = function(h, m) {
         var ampm = (h >= 12 ? 'PM' : 'AM');
         h = h % 12;
         h = h ? h : 12;
         m = m < 10 ? '0' + m : m;
         return h + ':' + m + ' ' + ampm;
     }

     $scope.imageName = function(item) {
         var a = '';
         if (item.voucher.basics.type !== 'WINBACK') {
             a = Object.keys(item.voucher.issue_details.issued_for.reward)[0];
         } else {
             a = Object.keys(item.voucher.issue_details.winback.reward)[0];
         }
         return "assets/rewards/" + a + ".png";
     };



     $scope.redeem = function(code, at) {
        logSvc.event('Redeem', 'Redeem called', 'Redeem called', '1');

         if (!at) {
             $window.navigator.notification.alert("Please select the location to redeem at.",
                 function() {}, "SELECT LOCATION", "OK");
         } else {
             $window.navigator.notification.confirm(
                 'Click OK to get your voucher code now. Give this voucher code to your server (at the restaurant or on the phone) within the next 60 minutes', // message
                 function(index) {
                     if (index !== 2) {
                         dataSvc.redeem(code, at._id).then(function(success) {
                             logSvc.event('Redeem', 'Redeem called', 'Redeem success', '1');

                             var redeemed = storageSvc.get('redeemed') || {};
                             redeemed[code] = {
                                 status: true,
                                 date: Date.now()
                             };
                             storageSvc.set('redeemed', redeemed);
                             $ionicLoading.hide();
                         }, function(error) {
                             if (error === 'network_error') {
                                 dataSvc.showNetworkError();
                             } else {
                                 logSvc.event('Redeem', 'Redeem called', 'Redeem error', '1');
                                    $ionicLoading.hide();
                                 // $window.navigator.notification.alert(error,
                                 //     function() {
                                 //         $ionicLoading.hide();
                                 //     }, "ERROR", "OK");
                             }
                         });
                     }
                 }, // callback
                 'Redeem voucher?', // title
                 ['OK', 'Cancel'] // buttonName
             );
         }
     };

     $scope.feedback = function(id) {
        console.log(id);
        if (id) {
            $state.go('main.in.found.feedback', {
                item: id
            }, {
                inherit: false
            });
        } else {
             $window.navigator.notification.alert("Please select the location to give feedback to.",
                 function() {}, "SELECT LOCATION", "OK");            
        }
     };

     $scope.terms = function() {
         $window.navigator.notification.alert(
             "No 2 (or more) offers can be clubbed.\n" +
             "Offers are not valid on specially priced combinations e.g. Buffets / Brunch / Corporate dining rates etc.\n" +
             "Only 1 voucher can be used per bill generated.\n" +
             "In certain cases specific items may be part of the offer. The redemption of such offers is subject to availability of the item.\n" +
             "The offers are provided at the sole discretion of the merchant and the merchant reserves the right to alter or withdraw the offer at any time.\n" +
             "Rewards consisting of alcohol / alcohol-based products will be available only to individuals above legal drinking age. The establishment reserves the right to verify the customer's age before providing such reward.",
             function() {}, // callback
             'Terms & Conditions', // title
             'OK' // buttonName
         );
     };
 });

 twystApp.filter('capitalize', function() {
     return function(input) {
         return input[0].toUpperCase() + input.substr(1);
     };
 });
