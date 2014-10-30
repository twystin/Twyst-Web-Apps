'use strict';
 
twystApp.controller('ProgramsCtrl', function ($scope,$timeout,$anchorScroll, $modal, $http, $location, $routeParams, $upload, authService, outletService, programService, imageService, typeaheadService, OPERATE_HOURS) {
    if (!authService.isLoggedIn()) {
        $location.path('/');
    }
    $scope.auth = authService.getAuthStatus();
    $scope.messages = outletService.getOutletSvcMessages();
    $scope.messages = programService.getProgramSvcMessages();
    $scope.image_loading = false;
    $scope.viewPlay = true;
    $scope.debug = false;
    $scope.program = {};
    $scope.program.outlets = [];
    $scope.program.tiers = $scope.program.tiers || [];
    $scope.tmpo = {};
    $scope.tmpo.offer = {};
    $scope.tier_edit_index = -1;
    $scope.offer_edit_index = -1;
    $scope.tier_offer_edit_index = -1;
    $scope.show_tip = false;
    $scope.basicVal=true;
    $scope.upload_color = "info";
    $scope.upload_label = "Upload";
    $scope.buttonDisabled=true;
    $scope.tabs = [
        {active: true, name: 'offer_basics', title: '1. Create a program', content: '_basics'},
        {active: false, name: 'offer_tiers', title: '2. Set up a tier', content: '_tiers'},
        {active: false, name: 'outlet_details', title: '3. Create an offer', content: '_offers'},
        {active: false, name: 'outlet_validity', title: '4. Set the validity', content: '_validity'},
        {active: false, name: 'outlet_participating_outlets', title: '5. Pick the outlets', content: '_participating_outlets'},
        {active: false, name: 'outlet_review', title: '6. Review and Save', content: '_review'}
    ];

    $scope.images = [
        {name: '1'},
        {name: '2'},
        {name: '3'},
        {name: '4'},
        {name: '5'},
        {name: '6'},
        {name: '7'},
        {name: '8'}
    ];


    $scope.reward_check = [
        {"text": "Discount", value:"discount"},
        {"text": "Flat off", value:"flat"},
        {"text": "Free ", value:"free"},
        {"text": "Buy one get one ", value:"buy_one_get_one"},
        {"text": "Happy hours", value:"happy"},
        {"text": "Reduced price ", value:"reduced"},
        {"text": "Custom ", value:"custom"}
    ];
    $scope.selected_reward = $scope.reward_check[0];


    $scope.day_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday','all days'];

    $scope.time_of_day = ['breakfast', 'brunch', 'lunch', 'evening', 'dinner', 'all day'];
    
    $scope.rewardCheckedDays = ['all days'];
    $scope.rewardCheckedTime = ['all day'];

    $scope.checkinCheckedDays = [];
    $scope.checkinCheckedTime = [];
    $scope.validationArray = [true, true, true, true, true, true, true, true];
    $scope.week = ['monday' ,'tuesday' ,'wednesday' ,'thursday' ,'friday', 'saturday', 'sunday'];

    $scope.rewardToggleCheckDay = function (fruit) {
        if(fruit === 'all days') {
            if($scope.rewardCheckedDays.indexOf(fruit) >= 0) {
                $scope.rewardCheckedDays.splice($scope.rewardCheckedDays.indexOf(fruit), 1);
            }
            else {
                $scope.rewardCheckedDays = ['all days'];
            }
        }
        else {
            if($scope.rewardCheckedDays.indexOf('all days') >= 0) {
                $scope.rewardCheckedDays.splice($scope.rewardCheckedDays.indexOf('all days'), 1);
            }
            if ($scope.rewardCheckedDays.indexOf(fruit) === -1) {
                $scope.rewardCheckedDays.push(fruit);
            } else {
                $scope.rewardCheckedDays.splice($scope.rewardCheckedDays.indexOf(fruit), 1);
            }
        }
    };

    $scope.avail_hours = OPERATE_HOURS;

    $scope.newTimings = function($event, index){
        if($scope.avail_hours[$scope.week[index]].timings.length < 5) {
            $scope.avail_hours[$scope.week[index]].timings.push({open: '', close: ''});        
            $event.preventDefault();    
        }
    };

    $scope.removeTimings = function (day, index) {
        $scope.avail_hours[day].timings.splice(index, 1);
    }

    $scope.timingsValidation = function () {
        var flag = 0;
        for (var i = 0; i < 7; i++){
            flag = 0;
            if ($scope.avail_hours[$scope.week[i]].closed == false && 
                $scope.avail_hours[$scope.week[i]].timings.length > 1){
                for (var j = 0; j < $scope.avail_hours[$scope.week[i]].timings.length-1; j++){
                    for (var k = j + 1 ; k < $scope.avail_hours[$scope.week[i]].timings.length; k++){
                        if ((sendTime(1, i, j) < sendTime(0, i, k)) && (sendTime(0, i, j) > sendTime(1, i, k))){
                            
                            flag=1;
                        }
                    }
                }
            }
        if (flag==1){
            $scope.validationArray[i] = false;
        }
        else{
            $scope.validationArray[i] = true;
        }
        }

    }

    function sendTime(i, w, t){
        //1 for open
        if (i==1){
            return ($scope.avail_hours[$scope.week[w]].timings[t].open.hr * 60 *1 +
            $scope.avail_hours[$scope.week[w]].timings[t].open.min * 1);
        }
        //0 for close
        else if (i==0){
            return ($scope.avail_hours[$scope.week[w]].timings[t].close.hr * 60 *1 +
            $scope.avail_hours[$scope.week[w]].timings[t].close.min * 1);
        }
    }

    $scope.applyToAllDays = function(time) {
        for(var i = 0; i < $scope.week.length; i++) {
            $scope.avail_hours[$scope.week[i]].closed = time.closed;
            var timings = [];
            for(var j = 0; j < time.timings.length; j++) {
                var t = {
                    open: {
                        hr: time.timings[j].open.hr,
                        min: time.timings[j].open.min
                    },
                    close: {
                        hr: time.timings[j].close.hr,
                        min: time.timings[j].close.min
                    }
                };
                timings.push(t);
            }
            $scope.avail_hours[$scope.week[i]].timings = timings;
        }
    }

    $scope.viewPlay1 = function () {
        $scope.viewPlay = !$scope.viewPlay;
    };

    $scope.rewardToggleCheckTime = function (fruit) {
        if(fruit === 'all day') {
            if($scope.rewardCheckedTime.indexOf(fruit) >= 0) {
                $scope.rewardCheckedTime.splice($scope.rewardCheckedTime.indexOf(fruit), 1);
            }
            else {
                $scope.rewardCheckedTime = ['all day'];
            }
        }
        else {
            if($scope.rewardCheckedTime.indexOf('all day') >= 0) {
                $scope.rewardCheckedTime.splice($scope.rewardCheckedTime.indexOf('all day'), 1);
            }
            if ($scope.rewardCheckedTime.indexOf(fruit) === -1) {
                $scope.rewardCheckedTime.push(fruit);
            } else {
                $scope.rewardCheckedTime.splice($scope.rewardCheckedTime.indexOf(fruit), 1);
            }
        }
    };

    $scope.toggleOutlets = function (fruit) {
        if ($scope.program.outlets.indexOf(fruit) === -1) {
            $scope.program.outlets.push(fruit);
        } else {
            $scope.program.outlets.splice($scope.program.outlets.indexOf(fruit), 1);
        }

    };
    // Opens rewards modal on view offers tab; listing different rewards

    $scope.getRewards = function (program_id) {
        programService.getRewards(program_id).then(function (reward) {
            $scope.reward = reward.info;
            rewardOpen('lg');
        });
    }
    function rewardOpen(size) {
      var modalInstance = $modal.open({
          templateUrl: './templates/offer/offermodal_view.html',
          controller  : 'RewardCtrl',
          size: size,
          scope: $scope
        });

    };
    $scope.programType = function () {
        $scope.tmpo = {};
        $scope.tmpo.tier = {};
        $scope.tmpo.tier.basics = {};
        $scope.tmpo.offer = {};
        $scope.tmpo.offer.basics = {};
        var program_type = $routeParams.program_type;
        console.log(program_type);
        if (program_type === "standalone") {
            $scope.tier_disabled = true;
            $scope.offer_disabled = true;
            $scope.tmpo.offer.basics.title = "_+-+Offer-+-_";
            $scope.tmpo.tier.basics.name = "_+++Tier+++_";
        }
    };

    $scope.tag_list = {};
    $scope.tag_list.tags=[]; 

    $scope.fixupTags = function() {
        $scope.tmpo.offer.tags = $scope.tmpo.offer.tags || [];    
        var tags = "";
        if($scope.tag_list.tags) {
            if (typeof $scope.tag_list.tags === 'string') {
                tags = $scope.tag_list.tags.split(',');
            } else {
                tags = $scope.tag_list.tags.join().split(',');
            }
            for(var i in tags){
                if ($scope.tmpo.offer.tags.indexOf(tags[i]) === -1) {
                    $scope.tmpo.offer.tags.push(tags[i]);
                }
            }
        }
        $scope.tag_list.tags = '';
    };
    
    $scope.getTags = function (tagKey) {
        return typeaheadService.getTagNames(tagKey);
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
            $scope.program.images= [];

            var success_function = function (data) {
                    $scope.dynamicObject.value = 100;
                    $scope.program.images.push(data.info.replace(/"/g, ""));
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

    $scope.query = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        programService.query($scope, $http, $location, user_id);
    };

    $scope.create = function () {

        if($scope.program.validity && $scope.program.validity.earn_start) {
            $scope.program.validity.earn_start = $scope.program.validity.earn_start.setHours(0,0,1);
        }
        if($scope.program.validity && $scope.program.validity.burn_start) {
            $scope.program.validity.burn_start = $scope.program.validity.burn_start.setHours(0,0,1);
        }
        if($scope.program.validity && $scope.program.validity.earn_end) {
            $scope.program.validity.earn_end = $scope.program.validity.earn_end.setHours(23,59,59);
        }
        if($scope.program.validity && $scope.program.validity.burn_end) {
            $scope.program.validity.burn_end = $scope.program.validity.burn_end.setHours(23,59,59);
        }
        
        $scope.program.accounts = [];
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        $scope.program.accounts.push(user_id);
        programService.create($scope, $http, $location);
    };

    $scope.viewProgram = function (program_id) {
        programService.read($scope, $http, $location, program_id);
    };

    $scope.update = function (program_name) {
        if(program_name !== '')
            programService.update($scope, $http, $location, program_name);
    };

    $scope.deleteProgram = function (program) {
        var modalInstance = $modal.open({
            templateUrl : './templates/offer/delete_program.html',
            controller  : 'ProgramDeleteCtrl',
            backdrop    : true,
            resolve: {
              program: function(){
                return program;
              }
            }
        });
    };

    $scope.clear = function () {
        $scope.program = {};
    };
    $scope.clearOffer=function(){
        $scope.tmpo.offer=$scope.program.tiers[$scope.program.tiers.length - 1].offers.pop();
        $scope.avail_hours = OPERATE_HOURS;
    };

    $scope.addTier = function () {
        console.log("called");
        console.log($scope.tmpo.tier.basics.name);
        var tier = {
            basics:  {
                name: $scope.tmpo.tier.basics.name,
                start_value: $scope.tmpo.tier.basics.start_value,
                end_value: $scope.tmpo.tier.basics.end_value
            },
            offers: []
        };
        if($scope.tier_edit_index == -1) {
            $scope.program.tiers.push(tier);
            console.log($scope.program.tiers);
        }
        else {
            $scope.program.tiers[$scope.tier_edit_index] = tier;
        }
        $scope.tmpo.tier = null;
    };

    $scope.clearTier=function(){
       $scope.tmpo.tier=$scope.program.tiers.pop();
    };
    
    $scope.editTier = function(tier) {
        $scope.tier_edit_index = $scope.program.tiers.indexOf(tier);
        $scope.tmpo.tier = tier;
    };

    $scope.removeTier = function(tier) {
        $scope.program.tiers = _($scope.program.tiers).reject(function(el) {return el === tier });
    };

    $scope.addOffer = function() {
        
        $scope.selected_reward = $scope.reward_check[0];
        $scope.tmpo.offer.reward_applicability = {};
        $scope.tmpo.offer.checkin_applicability = $scope.tmpo.offer.checkin_applicability || {};
        $scope.tmpo.offer.reward_applicability.time_of_day = $scope.rewardCheckedTime;
        $scope.tmpo.offer.reward_applicability.day_of_week = $scope.rewardCheckedDays;
        $scope.tmpo.offer.checkin_applicability.day_of_week = $scope.checkinCheckedDays;
        $scope.tmpo.offer.avail_hours = $scope.avail_hours;

        $scope.rewardCheckedTime = ['all day'];
        $scope.rewardCheckedDays = ['all days'];
        $scope.checkinCheckedDays = [];

        if($scope.offer_edit_index === -1 || $scope.tier_offer_edit_index === -1) {
            $scope.program.tiers[$scope.program.tiers.length - 1].offers.push($scope.tmpo.offer);
        }
        else {
            $scope.program.tiers[$scope.tier_offer_edit_index].offers[$scope.offer_edit_index] = $scope.tmpo.offer;
            $scope.offer_edit_index = -1;
            $scope.tier_offer_edit_index = -1;
        }
        $scope.tmpo.offer = {};
        $scope.tmpo.offer.user_eligibility={};
        $scope.tmpo.offer.user_eligibility.criteria={};
        $scope.tag_list.tags=null;
        $scope.tmpo.offer.reward={
            discount:{
                percentage:'',
                max:''
            }
        };        
        $scope.tmpo.offer.user_eligibility.criteria.condition='on every';
        
        $scope.tag_list.tags=null;
    };

    $scope.scrollToTop=function(){
       /*$location.hash('topofpage');
       $anchorScroll(); 
       */
       window.scrollTo(0,100);
    };
    
    $scope.editOffer = function(offer) {
        var index;
        for (var i = 0; i < $scope.program.tiers.length; i++) {
          for(var j = 0; j < $scope.program.tiers[i].offers.length; j++) {
            if ($scope.program.tiers[i].offers[j] === offer) {
                $scope.offer_edit_index = j;
                $scope.tier_offer_edit_index = i;
                break;
            }
          }
        }
        $scope.tmpo.offer = offer;
    };

    $scope.removeOffer = function(offer) {
        $scope.program.offers = _($scope.program.offers).reject(function(el) {return el === offer });
    };

    $scope.outletQuery = function() {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        outletService.query($scope, $http, $location, user_id);
    };
    
    $scope.$watch('tmpo.tier.basics.start_value + tmpo.tier.basics.end_value',function(){
        $scope.basicVal= $scope.basicValidation();
        if($scope.basicVal==2)
        {
            $scope.properVal = $scope.properValidation();
        }
        else
        {
            $scope.properVal=true;
        }
        $scope.buttonDisabled= (!$scope.properVal) || ($scope.basicVal!=2);
  });

  $scope.basicValidation = function(){
    var currentTier=$scope.tmpo.tier;
    if(currentTier) {
        if(!currentTier.basics.start_value || !currentTier.basics.end_value)
        {
            return 0;
        }
        else if(Number(currentTier.basics.start_value) <= 0 || Number(currentTier.basics.end_value)<=0)
        {
            return 1;
        }
        else if(Number(currentTier.basics.start_value) < Number(currentTier.basics.end_value))
        {
            return 2;
        }
        else
        {
            return 3;
        }
    }
  };

  $scope.properValidation = function(){
    $scope.properVal = true;
    var currentTier = $scope.tmpo.tier;
    var existingTiers = $scope.program.tiers;
    
    if(existingTiers && existingTiers.length>0 )
    {
        var flag=true;
        existingTiers.forEach(function(tier){
            if(Number(currentTier.basics.end_value)<Number(tier.basics.start_value))
            {  
            }
            else if(Number(currentTier.basics.start_value)> Number(tier.basics.end_value))
            {   
            }
            else{
                flag=false;
            }
        });
        return flag;
    }
    else if(existingTiers.length===0)
    {
        return true;
    }
    else
    {
        return false;
    }
  };

  $scope.validOffer = function ($scope, marked_tier) {
        if(!$scope.offer.user_eligibility) {
            return true;
        }

        var marked;
        for (var i = 0; i < $scope.program.tiers.length; i++) {
            if($scope.program.tiers[i]._id === marked_tier) {
                marked =  $scope.program.tiers[i];
            }
        };

        if($scope.offer.user_eligibility.criteria.value > marked.basics.end_value) {
            $scope.message = "User eligibility value can not be greater than tier end value";
            return false;
        }

        for(var i = 0; i < marked.offers.length; i++) {
            if($scope.offer.user_eligibility.criteria.condition === 'after') {
                if($scope.offer.user_eligibility.criteria.condition === marked.offers[i].user_eligibility.criteria.condition) {
                    $scope.message = "You can not add two offers in same tier with AFTER user_eligibility conditions";
                    return false;
                }
            }
        }
        return true;
    }  
});

twystApp.controller('RewardCtrl', 
    function ($scope, $modalInstance) {

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };      
});

twystApp.controller('ProgramDeleteCtrl', 
    function ($scope, $route, $http, $location, $modalInstance, programService, program) {

        var program_id = program._id;

        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.delete = function () {
            programService.delete($scope, $http, $location, program_id, $route, $modalInstance);
        };      
});

twystApp.controller('DatePickerCtrl', function ($scope, $timeout) {
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
        $scope.minDate = ( $scope.minDate ) ? null : new Date();
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

twystApp.controller('TimepickerCtrl', function ($scope) {

  $scope.mytime = new Date();

  $scope.hstep = 1;
  $scope.mstep = 10;
  $scope.options = {
    hstep: [1, 2, 3],
    mstep: [1, 5, 10, 15, 25, 30]
  };

  $scope.ismeridian = true;
  $scope.toggleMode = function() {
    $scope.ismeridian = ! $scope.ismeridian;
  };

  $scope.update = function() {
    var d = new Date();
    d.setHours( 14 );
    d.setMinutes( 0 );
    $scope.mytime = d;
  };

  $scope.changed = function () {
    console.log('Time changed to: ' + $scope.mytime);
  };

  $scope.clear = function() {
    $scope.mytime = null;
  };
});