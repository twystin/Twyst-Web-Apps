'use strict';

twystApp.controller('OutletCtrl', 
    ['$scope', '$timeout', '$modal', '$window', '$http', '$location', '$upload', '$routeParams','$route', 'authService', 'outletService', 'imageService', '$log',
    function ($scope, $timeout, $modal, $window, $http, $location, $upload, $routeParams,$route, authService, outletService, imageService, $log) {

    if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }

    // Variable declarations
    $scope.init = function () {
        $scope.upload_label = "Upload";
        $scope.upload_color = "info";
        $scope.update_flag = false;
        $scope.image_loading = false;
        $scope.outlets = {};
        if($scope.outlet) {
            if($scope.outlet._id) {
                var _id = $scope.outlet._id;
                $scope.outlet = {};
                $scope.outlet._id = _id;
                console.log($scope.outlet);
            }
        }
        else {
            $scope.outlet = {};
        }
        $scope.outlet.attributes = {};
        $scope.outlet.attributes.cost_for_two = {};
        $scope.outlet.contact = {};
        $scope.outlet.basics = {};
        $scope.outlet.contact.phones = {};
        $scope.outlet.contact.phones.mobile = [{num: ''}];
        $scope.outlet.contact.phones.reg_mobile = [{num: ''}];
        $scope.outlet.contact.location = {};
        $scope.outlet.contact.location.coords = {};
        $scope.outlet.attributes.tags = [];
        $scope.outlet.attributes.payment_options = [];
        $scope.outlet_created = false;
        $scope.payments = ['cash', 'visa', 'master', 'amex', 'sodexho'];

        $scope.tabs = [
            {active: true, name: 'outlet_basics', title: '1. Name your outlet', content: '_basics'},
            {active: false, name: 'outlet_info', title: '2. Add contact information', content: '_address'},
            {active: false, name: 'outlet_details', title: '3. Add outlet details', content: '_attributes'},
            {active: false, name: 'outlet_review', title: '4. Review and Save!', content: '_review'}
        ];

        // Outlet icons
        $scope.restaurant_icons = ['restaurant','biryani','chinese','conntinental','north_indian']
        $scope.fast_food_icons = ['fast_food','burgers','pizza','wraps'];
        $scope.pub_icons = ['pub','beer'];
        $scope.bakery_icons = ['bakery','cake'];
        $scope.cafe_icons = ['cafe','bistro'];
        $scope.takeaway_icons = ['takeaway'];
        $scope.other_icons = ['other'];
        $scope.dessert_icons = ['desserts']
    };
    $scope.init();

    // Service initialization
    outletService.setOutletSvcMessages(200, null);
    $scope.auth = authService.getAuthStatus();
    $scope.messages = outletService.getOutletSvcMessages();
    $scope.$on('handleChangedOutletSvcMessages', function () {
        $scope.messages = outletService.getOutletSvcMessages();
        if ($scope.messages.data.status === "success") {
            $log.warn($scope.outlet);
        }
    });

    $scope.selectIcon = function (icon) {
        if(!($scope.outlet.basics.icon === icon)) {
            $scope.outlet.basics.icon = icon;
        }
    };

    $scope.newRegMobile = function($event){

        if($scope.outlet.contact.phones.reg_mobile.length < 5) {
            $scope.outlet.contact.phones.reg_mobile.push({num: ''});        
            $event.preventDefault();    
        }
    };

    $scope.newMobile = function($event){

        if($scope.outlet.contact.phones.mobile.length < 5) {
            $scope.outlet.contact.phones.mobile.push({num: ''});        
            $event.preventDefault();    
        }
    };

    $scope.getCostForTwoText = function (outlet) {
        if(outlet.attributes.cost_for_two.min
            && outlet.attributes.cost_for_two.max) {
            var costs = ["100", "300", "500", "1000","1500","2000", "2500", "3000", "more than 3000"],
                bottom = Number(outlet.attributes.cost_for_two.min) - 1,
                top = Number(outlet.attributes.cost_for_two.max) - 1;

            if (bottom < top) {
                return costs[bottom] + " to " + costs[top];
            }
        }   
    };

    $scope.toggleCheckPayment = function (payment) {
        if ($scope.outlet.attributes.payment_options.indexOf(payment) === -1) {
            $scope.outlet.attributes.payment_options.push(payment);
        } else {
            $scope.outlet.attributes.payment_options.splice($scope.outlet.attributes.payment_options.indexOf(payment), 1);
        }
    };

    $scope.tag_list = {};

    $scope.fixupTags = function() {
        $scope.outlet.attributes.tags = $scope.outlet.attributes.tags || [];    
        var tags = "";
        if($scope.tag_list.tags) {
            if (typeof $scope.tag_list.tags === 'string') {
                tags = $scope.tag_list.tags.split(',');
            } else {
                tags = $scope.tag_list.tags.join().split(',');
            }
            for(var i in tags){
                if ($scope.outlet.attributes.tags.indexOf(tags[i]) === -1) {
                    $scope.outlet.attributes.tags.push(tags[i]);
                }
            }
        }
        $scope.tag_list.tags = '';
    };

    $scope.$watch('tag_list.tags', function() {
        if($scope.tag_list.tags) {
            var length = $scope.tag_list.tags.length;
            var typed = $scope.tag_list.tags[length-1];
            $scope.tags = [];
            $http.get(
                '/api/v1/typeahead/tags/' + typed
                ).success(function (data) {
                    var info_length = data.info.length;
                    if(info_length > 0) {
                        for(var i = 0; i < info_length; i++) {
                            $scope.tags.push(data.info[i].name);
                        }
                    }
                }).error(function (data) {
                    console.log(data);
            });
        }
    });

    $scope.getCurrentLocation = function () {
        $window.navigator.geolocation.getCurrentPosition(function(position) {
            console.log(position);
            $scope.$apply(function() {
                $scope.outlet.contact.location.coords.latitude = position.coords.latitude;
                $scope.outlet.contact.location.coords.longitude = position.coords.longitude;
                $scope.accuracy = position.coords.accuracy;
            });
            }, function(error) {
                $scope.message="Error getting location automatically. Please enter co-ordinates manually.";
                console.log(error);
        });
    };

    $scope.viewOutlet = function(outlet) {
        $scope.outlet = outlet;
    };

    $scope.query = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        outletService.query($scope, $http, $location, user_id);
    };

    $scope.read = function (outlet_title) {
        outletService.read($scope, $http, $location, outlet_title);
        $location.path('/outlets/update/' + outlet_title);
    };

    $scope.view = function () {
        var outlet_id = $routeParams.outlet_id,
            request = $http.get('/api/v1/outlets/view/' + outlet_id);
        $scope.update_flag = true;
        return request.then(function (response) {
            var outlet = JSON.parse(response.data.info)[0];
            $scope.outlet = outlet;
        }, function (response) {
            $log.warn(response);
        });
    };

    $scope.create = function () {
        $scope.outlet.outlet_meta = {};
        $scope.outlet.outlet_meta.accounts = [];
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        $scope.outlet.outlet_meta.accounts.push(user_id);
        outletService.create($scope, $http, $location);
    };

    $scope.update = function (outlet_id) {
        outletService.update($scope, $http, $location, outlet_id);
    };

    $scope.deleteOutlet = function (outlet) {
        var modalInstance = $modal.open({
            templateUrl : './templates/outlet/delete_outlet.html',
            controller  : 'OutletDeleteCtrl',
            backdrop    : true,
            resolve: {
              outlet: function(){
                return outlet;
              }
            }
        });
    };

    $scope.onFileSelect = function ($files) {
        if(($files[0].type === "image/jpeg") || 
            ($files[0].type === "image/png") ||
            ($files[0].type === "image/gif")) {
                uploadImage();
        }
        else {
            $scope.image_upload_message = "Select a valid Image";
        }

        function uploadImage() {
            $scope.disableImgUploadButton=true;
            $scope.dynamicObject = {value : 10};
            $scope.image_loading = true;
            $scope.outlet.basics = $scope.outlet.basics || {};
            $scope.outlet.basics.images = [];

            var success_function = function (data) {
                
                    $scope.dynamicObject.value = 100;
                    $scope.outlet.basics.images.push(data.info.replace(/"/g, ""));
                    $scope.upload_label = "Done";
                    $scope.upload_color = "inverse";
                },
                error_function = function (data) {
                    $log.error(data);
                };

            $timeout(function () { $scope.dynamicObject.value += 70; }, 4000);

            imageService.uploadImage($files[0]).then(function(data) {
                if(data.status === 'success') {
                    success_function(data);
                }
                else {
                    error_function(data);
                }
            });
        }
    };

    //Function for sharing the link to created outlet card on Facebook
    $scope.share = function () {
        var outletSlug = $scope.outlet.basics.name.toLowerCase().replace(/\s+/g, '').replace(/\W/g, '');
        var imageLink;  
        if($scope.outlet.basics.images && $scope.outlet.basics.images[0])
        {
            imageLink = $scope.outlet.basics.images[0];
        }
        else
        {
            imageLink = 'http://dogfood.twyst.in/common/images/logo_2.png';
        }
        FB.ui({
            method: 'feed',
            name: $scope.outlet.basics.name,
            link: 'http://twyst.in/merchant/#/public/outlets/' + outletSlug,
            picture: imageLink,
            caption: 'New Outlet Created at www.twyst.in',
            description: 'Hey! I just created a new outlet on www.twyst.in!',
            message: 'Hey! I just created an outlet on www.twyst.in'
        });
    };

    $scope.reload = function(){
        $route.reload();
    }
    
    $scope.$watch('outlet.contact.phones.mobile',function(){
        if($scope.outlet && $scope.outlet.contact && $scope.outlet.contact.phones && $scope.outlet.contact.phones.mobile)
        {
            var str = $scope.outlet.contact.phones.mobile;
            if(str.length==0)
            {
                $scope.mobileError=null;
            }
            else if(str.length>=1)
            {
                if(str[0]!='7' && str[0]!='8' && str[0]!='9')
                {
                    $scope.mobileError="Invalid mobile number. Please enter your 10-digit number";
                }
                else if(!/^\d+$/.test(str) )
                {
                    $scope.mobileError="Invalid mobile number. Please enter your 10-digit number";
                }
                else
                {
                    if(str.length<10)
                    {
                        $scope.mobileError="Mobile number too short";
                    }
                    else if(str.length>10)
                    {
                        $scope.mobileError="Mobile number too long";
                    }
                    else
                    {
                        $scope.mobileError=null;
                    }
                }
            }
        }
        
    });
    $scope.$watch('outlet.contact.location.pin',function(){
        if($scope.outlet && $scope.outlet.contact && $scope.outlet.contact.location && $scope.outlet.contact.location.pin)
        {
            var str = $scope.outlet.contact.location.pin;
            if(str.length==0)
            {
                $scope.pincodeError=null;
            }
            else if(str.length>=1)
            {
                if(str[0]=='0' || str[0]=='9')
                {
                    $scope.pincodeError="Invalid pin code. Please enter your 6-digit pin code";
                }
                else if(!/^\d+$/.test(str) )
                {
                    $scope.pincodeError="Invalid pin code. Please enter your 6-digit pin code";
                }
                else
                {
                    if(str.length<6)
                    {
                        $scope.pincodeError="Pin code too short";
                    }
                    else if(str.length>6)
                    {
                        $scope.pincodeError="Pin code too long";
                    }
                    else
                    {
                        $scope.pincodeError=null;
                    }
                }
            }
        }
        
    });
    
}]);

twystApp.controller('OutletDeleteCtrl', 
     ['$scope', '$route', '$http', '$location', '$modalInstance', 'outletService','outlet',
    function ($scope, $route, $http, $location, $modalInstance, outletService, outlet) {

        var outlet_title = outlet.basics.name;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.delete = function () {
            outletService.delete($scope, $http, $location, outlet_title, $route, $modalInstance);
        };      
}]);