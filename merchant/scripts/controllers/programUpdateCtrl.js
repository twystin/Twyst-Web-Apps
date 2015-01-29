twystApp.controller('programUpdateCtrl', 
	function ($scope, $routeParams, toastSvc, $timeout, $http, $modal, $parse, $route, $location, authService, outletService, programService, proSupService, imageService, typeaheadService, OPERATE_HOURS) {
			
		if (!authService.isLoggedIn()) {
	        $location.path('/');
	    }

	    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
	        $location.path('/panel');
	    }

		$scope.update_tabs = [
	        {active: true, title: 'Add a tier', content: '_tiers'},
	        {active: false, title: 'Add an offer', content: '_offers'},
	        {active: false, title: 'Update program', content: '_programs'}
	    ];

	    $scope.tier = {};
	    $scope.tier.basics={};
	    $scope.offer = {};

	    $scope.reward_check = [
	        {"text": "Discount", value:"discount"},
	        {"text": "Flat off", value:"flat"},
	        {"text": "Free ", value:"free"},
	        {"text": "Buy one Get one ", value:"buy_one_get_one"},
	        {"text": "Happy hours", value:"happyhours"},
	        {"text": "Reduced price ", value:"reduced"},
	        {"text": "Custom ", value:"custom"}
	    ];

	    $scope.selected_reward = $scope.reward_check[0];
//id="offerPreviewImage"
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

		$scope.day_of_week = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday','all days'];

	    $scope.time_of_day = ['breakfast', 'brunch', 'lunch', 'evening', 'dinner', 'all day'];
	    $scope.buttonDisabled = true;
	    $scope.rewardCheckedDays = ['all days'];
	    $scope.rewardCheckedTime = ['all day'];

	    $scope.checkinCheckedDays = [];
	    $scope.checkinCheckedTime = [];
	    $scope.participating_outlets = [];
	    $scope.basicVal=true;

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

	    $scope.outlet_for = {};
	    $scope.$watch('outlet_for._timings', function () {
	        if(!$scope.outlet_for._timings || $scope.outlet_for._timings === "NONE") {
	            $scope.avail_hours = OPERATE_HOURS;
	        }
	        else {
	            $scope.avail_hours = $scope.outlet_for._timings.business_hours;
	        }
	    }, true);

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

	    $scope.viewPlay1 = function () {
	        $scope.viewPlay = !$scope.viewPlay;
	    };

	    $scope.toggleOutlets = function (fruit) {
	        if ($scope.participating_outlets.indexOf(fruit) === -1) {
	            $scope.participating_outlets.push(fruit);
	        } else {
	            $scope.participating_outlets.splice($scope.participating_outlets.indexOf(fruit), 1);
	        }

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

	    $scope.outletQuery = function() {
	        outletService.query().then(function (data) {
	            $scope.outlets = data.info;
	            $scope.all_outlets = data.info;
	        }, function (err) {
	            console.log(err);
	        })
	    };

	    $scope.selectImage = function (image) {
	        if($scope.program.icon === image) {
	            $scope.program.icon = '';
	        }
	        else {
	            $scope.program.icon = image;
	        }
	    }

	   $scope.checkinToggleCheckDay = function (fruit) {
	        if ($scope.checkinCheckedDays.indexOf(fruit) === -1) {
	            $scope.checkinCheckedDays.push(fruit);
	        } else {
	            $scope.checkinCheckedDays.splice($scope.checkinCheckedDays.indexOf(fruit), 1);
	        }
	    };

	    $scope.checkinToggleCheckTime = function (fruit) {
	        if ($scope.checkinCheckedTime.indexOf(fruit) === -1) {
	            $scope.checkinCheckedTime.push(fruit);
	        } else {
	            $scope.checkinCheckedTime.splice($scope.checkinCheckedTime.indexOf(fruit), 1);
	        }
	    };

	    $scope.offerDetails = false;
	    $scope.toggleOfferDetails = function () {
	        $scope.offerDetails = !$scope.offerDetails;
	    };

	    $scope.chooseEligibility = true;
	    $scope.toggleChooseEligibility = function () {
	        $scope.chooseEligibility = !$scope.chooseEligibility;
	    };

	    $scope.applicability = true;
	    $scope.toggleApplicability = function () {
	        $scope.applicability = !$scope.applicability;
	    };

	    $scope.tierOffers = true;
	    $scope.toggleTierOffers = function () {
	        $scope.tierOffers =  !$scope.tierOffers;
	    };

	    $scope.termsAndCondition = true;
	    $scope.toggleTermsAndCondition = function () {
	        $scope.termsAndCondition = !$scope.termsAndCondition;
	    };

	    $scope.specifyValidTime = false;
	    $scope.toggleSpecifyValidTime = function () {
	        $scope.specifyValidTime = !$scope.specifyValidTime;
	    };

	    $scope.tag_list = {};
	    $scope.tag_list.tags=[];

	    $scope.fixupTags = function() {
	        $scope.offer.tags = $scope.offer.tags || [];    
	        var tags = "";
	        if($scope.tag_list.tags) {
	        	if (typeof $scope.tag_list.tags === 'string') {
		            tags = $scope.tag_list.tags.split(',');
		        } else {
		            tags = $scope.tag_list.tags.join().split(',');
		        }
		        for(var i in tags){
	                if ($scope.offer.tags.indexOf(tags[i]) === -1) {
	                    $scope.offer.tags.push(tags[i]);
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
	                    $scope.program.images[0] = data.info.replace(/"/g, "");
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

	    $scope.correctReward = function (param) {
	    	$scope.selected_reward = param;
	    	if(!$scope.offer._id) {
	    		$scope.offer.reward = {};
	    	} else {
	    		if($scope.offer.reward) {
	    			var key = Object.keys($scope.preserve_reward)[0];
	    			if(param.value === key) {
	    				$scope.offer.reward = $scope.preserve_reward;
	    			}
	    			else {
	    				$scope.offer.reward = {};
	    			}
	    		} else {
	    			$scope.offer.reward = {};
	    		}
	    	}
	    }

	   $scope.saveOffer = function (marked_tier) {
	   		if(marked_tier) {
	   			if($scope.validOffer($scope, marked_tier)){
	   				$scope.offer.reward_applicability = {};
			        $scope.offer.checkin_applicability = $scope.offer.checkin_applicability || {};
			        $scope.offer.reward_applicability.time_of_day = $scope.rewardCheckedTime;
			        $scope.offer.reward_applicability.day_of_week = $scope.rewardCheckedDays;
			        $scope.offer.checkin_applicability.day_of_week = $scope.checkinCheckedDays;
			        $scope.offer.avail_hours = $scope.avail_hours;

			   		proSupService.saveOffer(marked_tier, $scope.offer)
			   		.then(function (data) {
			   			updateRewardTable($scope.program._id);
			   			toastSvc.showToast('success', data.message);
			   			$route.reload();
			   		}, function (err) {
			   			toastSvc.showToast('error', err.message);
			   		});
	   			}
	   		}
	   		else {
	   			$scope.message = "Select a tier to save offer";
	   		}
	   }

		

	   $scope.saveTier = function () {
	   		proSupService.saveTier($scope.program._id, $scope.tier)
	   		.then(function (data) {
	   			updateRewardTable($scope.program._id);
	   			toastSvc.showToast('success', data.message);
	   			$route.reload();
	   		}, function (err) {
	   			toastSvc.showToast('error', err.message);
	   		});
	   	}

	   	$scope.editProgram = function (program) {
	        $scope.update_tabs[2].active=true;
	    }; 
 
	    $scope.editOffer = function (offer) {
			$scope.offer = offer;
			if($scope.offer.reward === undefined) {
				$scope.selected_reward = $scope.reward_check[0];
			}
			else {
				var l = Object.keys(offer.reward)[0];
				var ll = _.find($scope.reward_check, function (reward){return reward.value === l});
				$scope.selected_reward = ll;
				$scope.preserve_reward = $scope.offer.reward;
			}
			$scope.rewardCheckedDays = offer.reward_applicability.day_of_week;
			$scope.rewardCheckedTime = offer.reward_applicability.time_of_day;
			$scope.avail_hours = offer.avail_hours;
			$scope.tag_list.tags=offer.tags;
			$scope.update_tabs[1].active=true;
		};

		$scope.editTier = function (tier) {
	    	$scope.tier = tier;
	    	$scope.update_tabs[0].active=true;
	    };

	    $scope.updateTier = function () {
	   		proSupService.updateTier($scope.tier._id, $scope.tier)
	   		.then(function (data) {
	   			updateRewardTable($scope.program._id);
	   			toastSvc.showToast('success', data.message);
	   			$route.reload();
	   		}, function (err) {
	   			toastSvc.showToast('error', err.message);
	   		});
	   	}

	   	$scope.updateProgram = function () {

	   		if($scope.program.validity && $scope.program.validity.earn_start) {
	            $scope.program.validity.earn_start = new Date($scope.program.validity.earn_start).setHours(0,0,1);
	        }
	        if($scope.program.validity && $scope.program.validity.burn_start) {
	            $scope.program.validity.burn_start = new Date($scope.program.validity.burn_start).setHours(0,0,1);
	        }
	        if($scope.program.validity && $scope.program.validity.earn_end) {
	            $scope.program.validity.earn_end = new Date($scope.program.validity.earn_end).setHours(23,59,59);
	        }
	        if($scope.program.validity && $scope.program.validity.burn_end) {
	            $scope.program.validity.burn_end = new Date($scope.program.validity.burn_end).setHours(23,59,59);
	        }	        
	   		$scope.program.outlets = $scope.participating_outlets;
	   		
	   		proSupService.updateProgram($scope.program._id, $scope.program)
	   		.then(function (data) {
	   			updateRewardTable($scope.program._id);
	   			toastSvc.showToast('success', data.message);
	   			$route.reload();
	   		}, function (err) {
	   			toastSvc.showToast('error', err.message);
	   		});
	   	}

	    $scope.updateOffer = function () {
	    	if(_.isEmpty($scope.offer.reward)) {
	    		$scope.offer.reward = $scope.preserve_reward;	
	    	}
	   		$scope.offer.reward_applicability = {};
	   		$scope.offer.checkin_applicability = $scope.offer.checkin_applicability || {};
	        $scope.offer.reward_applicability.time_of_day = $scope.rewardCheckedTime;
	        $scope.offer.reward_applicability.day_of_week = $scope.rewardCheckedDays;
	        $scope.offer.checkin_applicability.day_of_week = $scope.checkinCheckedDays;
	   		$scope.offer.avail_hours = $scope.avail_hours;
	   		proSupService.updateOffer($scope.offer._id, $scope.offer)
	   		.then(function (data) {
	   			updateRewardTable($scope.program._id);
	   			toastSvc.showToast('success', data.message);
	   			$route.reload();
	   		}, function (err) {
	   			toastSvc.showToast('error', err.message);
	   		});
	   }

	   	function updateRewardTable(program_id) {
	   		proSupService.updateRewardTable(program_id)
	   		.then(function (data) {
	   			toastSvc.showToast('success', data.message);
	   		}, function (err) {
	   			toastSvc.showToast('error', err.message);
	   		});
	   	}

	    $scope.cancelUpdateOffer = function () {
		   	$scope.selected_reward = {value:''};
		    $scope.update_tabs[0].active=true;
		    $scope.rewardCheckedDays = [];
		    $scope.rewardCheckedTime = [];
		   	$scope.tag_list.tags=[];
		   	$scope.offer={};
		   	$scope.checkedDays=[];
		   	$route.reload();
		   	$scope.message='offer updation cancelled';
	   };
	    
	   $scope.deleteOfferInit = function (offer_id) {
	   		$scope.to_be_deleted_offer_id = offer_id;
	        $scope.modalInstance = $modal.open({
	            templateUrl : './templates/offer/steps/update/delete_offers.html',
	            backdrop    : true,
	            scope: $scope
	        });
	    };

	    $scope.deleteTierInit = function (tier_id) {
	    	$scope.to_be_deleted_tier_id = tier_id;
	        $scope.modalInstance = $modal.open({
	            templateUrl : './templates/offer/steps/update/delete_tiers.html',
	            backdrop    : true,
	            scope: $scope
	        });
	    };

	    $scope.edit = function () {
	        var program_id = $routeParams.program_id;
	        programService.read($scope, $http, $location, program_id);
	    };

	    
	    $scope.properVal=true;
		$scope.$watch('tier.basics.start_value + tier.basics.end_value',function(){
	    $scope.basicVal= $scope.basicValidation();
	    if($scope.basicVal==2)
	    {
	        $scope.properVal = $scope.properValidation();
	    }
	    else
	    {
	        $scope.properVal=true;
	    }
	    $scope.buttonDisabled= (!$scope.properVal) || ($scope.basicVal!=2)
	  });

	  $scope.basicValidation = function(){
	    var currentTier=$scope.tier;
	    if(currentTier && currentTier.basics)
	    {
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
	    var currentTier = $scope.tier;
	    var existingTiers = $scope.program.tiers;
	    
	    if(existingTiers && existingTiers.length>0 )
	    {
	        var flag=true;
	        existingTiers.forEach(function(tier){
	        	if(currentTier.basics.name==tier.basics.name)
	        	{
	        		return;
	        	}
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

	$scope.cancelModal = function () {
        $scope.modalInstance.dismiss();
    };

   	$scope.deleteOffer = function () {
   		proSupService.deleteOffer($scope.to_be_deleted_offer_id)
   		.then(function (data) {
   			$scope.cancelModal();
   			updateRewardTable($scope.program._id);
   			toastSvc.showToast('success', data.message);
   			$route.reload();
   		}, function (err) {
   			toastSvc.showToast('error', err.message);
   		});
   	}

   	$scope.deleteTier = function () {
   		proSupService.deleteTier($scope.to_be_deleted_tier_id)
   		.then(function (data) {
   			$scope.cancelModal();
   			updateRewardTable($scope.program._id);
   			toastSvc.showToast('success', data.message);
   			$route.reload();
   		}, function (err) {
   			toastSvc.showToast('error', err.message);
   		});
   	}
});