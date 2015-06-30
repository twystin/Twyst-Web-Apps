twystConsole.controller('PublicController', function($scope, $location, authService, dataService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    dataService.getSMSJobStatus().then(function (data) {
    	console.log(data)
    	$scope.sms = data.info;
    }, function (err) {
    	console.log(err);
    });
})
.controller('ReccoController', function($scope, $location, $http, $route, authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    var RECCO_CONFIG = {
		USER_CHECKIN_WEIGHT : 5,
		NUMBER_OF_RECCO : 10,
		CHECKIN_CUTOFF_INTERVAL : 15,
		NORMALIZED_WEIGHT : 100,
		OUTLET_POPULARITY_WEIGHT : 100,
		RELEVANCE_MATCH_WEIGHT : 100,
		DISTANCE_WEIGHT : 100
	};

	$scope.getDefaultValue = function () {
		$scope.recco_config = RECCO_CONFIG;
	}

    $scope.getReccoConfig = function () {
    	$http.get(
            '/api/v2/recco_config'
        ).success(function (data) {
            $scope.recco_config = data.info;
        }).error(function (data) {

        });
    }

    $scope.updateReccoConfig = function () {
    	$http.put(
            '/api/v2/recco_config', $scope.recco_config
        ).success(function (data) {
            $route.reload();
        }).error(function (data) {

        });
    }

})
.controller('NotifController', function($scope, $http, $location, authService, toastSvc, dataService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

	$scope.success = {};
	$scope.error = {};
	$scope.message = {};
	$scope.min_date = new Date();
    $scope.max_date = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    $scope.outlets = [];

	function isValid() {
		if(($scope.message.phones
			|| $scope.message.gcms || $scope.message.outlet
			)
			&& $scope.message.head
			&& $scope.message.body
			&& $scope.message.date
			&& $scope.message.hours
			&& $scope.message.minutes) {
			if($scope.message.gcms) {
				if($scope.message.server_key) {
					return true;
				}
				return false;
			}
			return true;
		}
		return false;
	}

	$scope.makeEmpty = function(type) {

		$scope.success = {};
		$scope.error = {};
		$scope.message = {};
		$scope.message.type = type;
	}

	$scope.fileChanged = function() {
      var reader = new FileReader();
      	reader.onload = function(e) {
	        $scope.$apply(function() {
	          $scope.message.phones = csvToArray(reader.result);
	        });
	    };
	    var csvFileInput = document.getElementById('fileInput');
      	var csvFile = csvFileInput.files[0];
      	reader.readAsText(csvFile);
    }

	function csvToArray(csvFile){
		var allUsers = csvFile.split("\n");
		var result = [];
		for(var i = 0; i < allUsers.length; i++){	
			if(allUsers[i]) {
				result.push(allUsers[i]);	
			}
			
		}
		return result;
    }

	$scope.addNotif = function () {

		var obj = {};
		if($scope.message.type == 'SMS' || $scope.message.type == 'OUTLET'  || $scope.message.type == 'FILE') {
			obj.message_type = 'SMS'
		}
		

		if(isValid()) {
			obj.from = $scope.message.from;
			obj.head = $scope.message.head;
			obj.body = $scope.message.body;
			obj.server_key = $scope.message.server_key;
			var msgLength = Math.ceil(obj.body.length/160);
			var numOfCust = $scope.message.phones.length;
			obj.scheduled_at = $scope.message.date.setHours($scope.message.hours, $scope.message.minutes ,0);
			alert('you are scheduling '+ msgLength*numOfCust  + " messages " + ' for ' + numOfCust + ' customers')
			if($scope.message.phones) {
				while($scope.message.phones.length) {
					var phones = $scope.message.phones.splice(0, 100);
					
					sendRequest(obj, phones);
				}				
			}
			else if($scope.message.outlet) {
				obj.outlet = $scope.message.outlet;
				sendRequest(obj);
			}
			else if($scope.message.gcms) {
				obj.gcms = $scope.message.gcms.split(/,|;|\n/);
			}
		}
		else {
			$scope.error.message = "Please fill all the fields."
		}
	}

	function sendRequest (obj, phones) {
		obj.phones = phones;
		$http.post('/api/v2/notifs', {obj:obj, phones}).success(function (data) {
			toastSvc.showToast('success', data.message);
			$location.path('/notifs');
		}).error(function (data) {
			toastSvc.showToast('error', err.message);
		});
	}

	$scope.getNotifs = function () {
		$http.get('/api/v2/notifs').success(function (data) {
			$scope.notifs = data.info;
		}).error(function (err) {
			toastSvc.showToast('error', err.message);
		});
	}

	$scope.outletQuery = function() {
		var request = $http.get('/api/v1/outlet/console/');
		return request.then(function(response) {
			$scope.outlets = eval(eval(response).data.info);
		}, function(response) {

		});
	};

	$scope.getNumbers = function(outlet) {
		var q = {
                outlets: [$scope.message.outlet],
                data_type: 'unique',
                programs: [$scope.message.outlet]//should not write this line
            };
		
        dataService.getUserMetric(q).then(function(data) {
            $scope.message.phones = data;
            $scope.message.from = data[data.length-1];
        });


       
	}
})
.controller('DatePickerCtrl', function($scope, $timeout) {

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
    //$scope.toggleMin();

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
})
.controller('AuthController', function ($scope, $http, $location, authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

	$scope.auth = {};

	$scope.isLoggedIn = function () {
		if(authService.isLoggedIn()) {
			return true;
		}
		return false;
	}

	$scope.login = function() {
		authService.login($scope, $http, $location);
	}

	$scope.logout = function () {
		authService.logout($scope, $http, $location);
	}
})
.controller('DashboardController', function($scope, $http, $location, authService) {
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

})
.controller('AppController', function($scope, $http, dataService) {
	$scope.date = {};

	$scope.getDownloads = function () {
		$scope.data = null;
		var outlet_id = $scope.for_outlet,
			start_date = $scope.date.start,
			end_date = $scope.date.end;
		dataService.getDownloads(outlet_id, start_date, end_date).then(function (data) {
			$scope.data = data;
		})
	}

	$scope.outletQuery = function() {
		var request = $http.get('/api/v1/outlet/console/');
		return request.then(function(response) {
			$scope.outlets = eval(eval(response).data.info);
		}, function(response) {

		});
	};

})
.controller('UsersController', function($scope, $http, $location, $routeParams, authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }

	$scope.user = {};
	$scope.user.validated = {};
	$scope.users = [];
	$scope.message = "";

	$scope.query = function() {
		var request = $http.get('/api/v1/auth/users');
		return request.then(function(response) {
			$scope.users = eval(eval(response).data.info);
		}, function(response) {

		});
	}

	$scope.edit = function() {
		var username = $routeParams.username;

		var request = $http.get('/api/v1/auth/users/' + username);
		return request.then(function(response) {
			var user = eval(eval(response).data.info)[0];
			$scope.user.name = user.username;
			$scope.user.email = user.email;
			$scope.user.role = user.role;
			$scope.user.validated = user.validated.role_validated;
			console.log($scope.user);

		}, function(response) {
			console.log(response);
		})
	}

	$scope.update = function(user) {
		$http({
			url: '/api/v1/auth/users/validate/' + user.name,
			method: "PUT",
			data: user
		}).success(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users/view')
		}).error(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users/view')
		});
	}

	$scope.delete = function(user) {
		$http({
			url: '/api/v1/auth/users/' + user.username,
			method: 'DELETE',
			data: user
		}).success(function(data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/users/view')
		}).error(function(data,status,headers,config) {
			$scope.message = data.message;
			$location.path('/users/view')
		})
	}

	$scope.resendValidationEmail = function (username) {
		console.log(username);
		$http({
			url: '/api/v1/resend/validation/' + username,
			method: 'PUT'
		}).success(function(data, status, headers, config) {
			$scope.message = data.message;
		}).error(function(data,status,headers,config) {
			$scope.message = data.message;
		})
	}

	$scope.updateOutlet = function(outlet) {
		console.log(outlet.contact.location.coords.longitude);
		$http({
			url: '/api/v1/outlets/' + outlet.basics.name,
			method: "PUT",
			data: outlet
		}).success(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/outlets/')
		}).error(function (data, status, headers, config) {
			$scope.message = data.message;
			$location.path('/outlets/')
		});
	}

	$scope.outletQuery = function() {
		var request = $http.get('/api/v1/outlet/console/');
		return request.then(function(response) {
			$scope.outlets = eval(eval(response).data.info);
		}, function(response) {

		});
	}


		$scope.reward_check = [
				{"text": "Discount", value:"discount"},
				{"text": "Flat off", value:"flat"},
				{"text": "Free ", value:"free"},
				{"text": "Buy one get one ", value:"buy_one_get_one"},
				{"text": "Happy hours", value:"happy"},
				{"text": "Reduced price ", value:"reduced"},
				{"text": "Custom ", value:"custom"}
		];
	$scope.editOutlet = function() {
		var outlet_id = $routeParams.outlet_id;

		var request = $http.get('/api/v1/outlets/view/' + outlet_id);
		return request.then(function(response) {
			console.log(response);
			var outlet = eval(eval(response).data.info)[0];
			$scope.outlet = outlet;
			console.log($scope.outlet);

		}, function(response) {
			console.log(response);
		})
	}

	$scope.validity = {};

	$scope.addQrs = function () {

		$scope.success = {};
		$scope.error_message = '';

		var outlet_id = $scope.qr_for_outlet;
		var num = $scope.num_of_qrs;
		var validity = $scope.validity;
		validity.start = validity.start.setHours(0,0,1);
		validity.end = validity.end.setHours(23,59,59);
		console.log(validity);
		console.log($scope.validity);
		var max_use_limit;

		if($scope.qrType === 'single') {
			max_use_limit = 5;
		}
		else {
			max_use_limit = $scope.max_use_limit;
		}

		$http({
			url: '/api/v1/qr/outlets/',
			method: "POST",
			data: {outlet: outlet_id, num: num, type: $scope.qrType, validity: validity, max_use_limit: max_use_limit}
		}).success(function (data, status, headers, config) {
			$scope.success = data;
			$scope.success.info = $scope.success.info.replace(/"/g, "");
			$scope.error_message = '';
		}).error(function (data, status, headers, config) {
			$scope.success = {};
			$scope.error_message = data.message;
		});

	}
}).controller('uploadCtrl', function ($scope, $http, $timeout, $window, toastSvc,  authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }
    $scope.fileChanged = function() {
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.$apply(function() {
          $scope.jsonData = csvTOJson(reader.result);
        });
      };

      var csvFileInput = document.getElementById('fileInput');
      var csvFile = csvFileInput.files[0];
      reader.readAsText(csvFile);
    }


    $scope.submitUserList = function(){
      var csvFileInput = document.getElementById('fileInput');
      if(csvFileInput.files[0]) {
        $http.post('/api/v1/populate/card_user', {
          userData  : $scope.jsonData

        }).success(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('success', 'Successfully updated');
        })
        .error(function (data, status, header, config) {
            redirect();
            toastSvc.showToast('error', 'There is some error in csv file.');
        });

      }
      else {
        alert("Plese Upload a CSV File");
        return false;
      }


    }

    function csvTOJson(csvFile){

      var allUsers = csvFile.split("\n");
      console.log(allUsers.length+ " allUsers");

      var result = [];

      var headers = allUsers[0].split(",");

      for(var i = 1; i < allUsers.length-1; i++){

        var obj = {};
        var currentUser = allUsers[i].split(",");

        for(var j = 0; j < headers.length; j++){
          if(currentUser[j] != undefined){
            obj[headers[j].trim()] = currentUser[j].trim();
          }

          if(j == 3 && currentUser[j] != undefined) {
            if(!validateEmail(currentUser[j].trim())) {
              alert('wrong email in sheet ' + currentUser[j] + " " + j);
              return false;
            }
          }

          else if(j == 7 && currentUser[j] != undefined) {
            if(!isMobileNumber(currentUser[j].trim())) {
              alert('wrong mobileNumber in sheet ' + currentUser[j] + " " + j);
              return false;
            }
          }
        }
        console.log(obj);
        result.push(obj);
      }
      return result;
    }

    function isMobileNumber(phone) {
        if(phone
            && (phone.length === 10)
            && isNumber(phone)
            && isValidFirstDigit(phone)) {
            return true;
        };
        return false;
    }

    function isValidFirstDigit(phone) {
        if(phone[0] === '7'
            || phone[0] === '8'
            || phone[0] === '9') {
            return true;
        }
        return false;
    }

    function isNumber(str) {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(str);
    }



    function isValidPhone () {
        if(!$scope.user.phone
            || isNaN($scope.user.phone)
            || $scope.user.phone.length !== 10) {

            return false;
        }
        return true;
    }

    function validateEmail(email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    function redirect() {
        $timeout(function () {
            $window.location.href = 'http://twyst.in/console/#/user/card_user';
        }, 4000);
    }
}).controller('reportCtrl', function ($scope, $http, $modal, $timeout, $window, toastSvc,  authService) {
	$scope.get_checkin_data = false;
	$scope.get_redeemption_data = false;
	$scope.show_redeemption_type = false;
	$scope.showRedeepmtionType = function(type) {
		if(type == 'REDEEM' || $scope.report.checkin_type == 'REDEEM') {
			$scope.get_checkin_data = false;
			$scope.get_redeemption_data = false;
			$scope.show_redeemption_type = true;	
		}
		else{
			$scope.show_redeemption_type = false;
			$scope.get_redeemption_data = false;
			$scope.get_checkin_data = false;
		}
	}
	if (!authService.isLoggedIn()) {
        $location.path('/');
    }
    $scope.report = {}
     
    $scope.getReport = function() {
    	if($scope.report.checkin_type == 'REDEEM') {
    		if($scope.report.end_date && $scope.report.start_date && $scope.report.checkin_type && $scope.report.redeeption_type) {
	     		if($scope.report.end_date.getTime() < $scope.report.start_date.getTime()){

		      		toastSvc.showToast('error', 'Start date can not be greater than end Date');
		      		return false;
		      	}
		      	else {
		      		$scope.query = {
		      			start_date: $scope.report.start_date,
		      			end_date: $scope.report.end_date,
		      			checkin_type: $scope.report.checkin_type,
		      			voucher_type: $scope.report.redeeption_type
		      		}
		      		getSummary();
		      	}	
	     	}
	     	else {
	     		toastSvc.showToast('error', 'Please Select dates, redeemption type');
	     		
	     	}	
    	}
    	else if($scope.report.end_date && $scope.report.start_date && $scope.report.checkin_type) {
    		
    		if($scope.report.end_date.getTime() < $scope.report.start_date.getTime()){

	      		toastSvc.showToast('error', 'Start date can not be greater than end Date');
	      		return false;
	      	}
	      	else {
	      		$scope.query = {
	      			start_date: $scope.report.start_date,
	      			end_date: $scope.report.end_date,
	      			checkin_type: $scope.report.checkin_type
	      		}
	      		getSummary();
	      	}

    	}
    	else {
     		toastSvc.showToast('error', 'Please Select dates, checkin type');
     	}
     	
    }
    function getSummary() {
    	$http({
			url: '/api/v2/summary_metric',
			method: "POST",
			data: $scope.query
        }).success(function (data, status, header, config) {	
        	if(data.info && data.info.isCheckin) {
        		
	            $scope.checkins= data.info;
	        
			    getCsvForCheckin($scope.checkins);
			    
			    function getCsvForCheckin(data) {
			        $scope.checkin_csv = [];
			        for (var key in $scope.checkins) {
			        	
			        	var a = $scope.checkins[key];
			        	
			        	for(var check in a) {
			        		
			        		if(check == 0) {
			        			var obj = {
				                    'outlet': 'outlet',
				   		            'date': key+'-2015'
				                };
				                var first_obj = {
				                    'outlet': a[check].outlet,
				                    'checkin_count': a[check].count
				                };
			        		}
			        		else {
			        			
			        			var obj = {
				                    'outlet': a[check].outlet,
				                    'checkin_count': a[check].count
				                };
			        		}
				        	if (check == 0) {
				        		$scope.checkin_csv.push(obj);	
				        		$scope.checkin_csv.push(first_obj);
				        	}
				        	else{
				        		$scope.checkin_csv.push(obj);
				        	}
			                
			                $scope.get_checkin_data = true;
			        	}
			        	   
			        }
			     
			    };
        	}
        	else if(data.info  && data.info.isRedeem){
        		
	            $scope.redeems = data.info;
	            
			    getCsvForRedemption($scope.redeems);
	            function getCsvForRedemption(data) {
			        $scope.redeem_csv = [];
			        for (var key in $scope.redeems) {				        	
			        	var a = $scope.redeems[key];
			        	for(var check in a) {
			        		if(check == 0) {
			        			var obj = {
				                    'outlet': 'outlet',
				   		            'date': key+'-2015'
				                };
				                var first_obj = {
				                    'outlet': a[check].outlet,
				                    'checkin_count': a[check].count
				                };
			        		}
			        		else {
			        			
			        			var obj = {
				                    'outlet': a[check].outlet,
				                    'checkin_count': a[check].count
				                };
			        		}
				        	if (check == 0) {
				        		$scope.redeem_csv.push(obj);	
				        		$scope.redeem_csv.push(first_obj);
				        	}
				        	else{
				        		$scope.redeem_csv.push(obj);
				        	}
			        		
		                
		                $scope.get_redeemption_data = true;
			        	}
			        	   
			        }
			    };
	            
        	}
        	else {
        			toastSvc.showToast('error', 'There is no record for selected range.');
        	}


        })
        .error(function (data, status, header, config) {

            toastSvc.showToast('error', 'Error in getting data.');
        });
    }

}).controller('checkinCtrl', function ($scope, $http, $timeout, $window, toastSvc,  authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }
    $scope.fileChanged = function() {
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.$apply(function() {
          $scope.jsonData = csvTOJson(reader.result);
        });
      };

      var csvFileInput = document.getElementById('fileInput');
      var csvFile = csvFileInput.files[0];
      reader.readAsText(csvFile);
    }


    $scope.submitUserList = function(){
      var csvFileInput = document.getElementById('fileInput');
      if(csvFileInput.files[0]) {
  		for (var i = 0; i < $scope.jsonData.length; i++) {
  			//console.log(JSON.stringify($scope.jsonData[i]) + 'oo')
  			if($scope.jsonData[i].outlet_id != '') {
  				$http.post('/api/v1/bulk/panel_checkins', {
	          	rows  : $scope.jsonData[i]
	          
		        }).success(function (data, status, header, config) {
		           	
		            toastSvc.showToast('success', JSON.stringify(data.message));
		        })
		        .error(function (data, status, header, config) {
		            
		            toastSvc.showToast('error',  JSON.stringify(data.message.message));
		        });	
  			}  			
  					
  		};
      }
      else {
        alert("Plese Upload a CSV File");
        return false;
      }


    }

    function csvTOJson(csvFile){

      var allUsers = csvFile.split("\n");
      //console.log(allUsers.length+ " allUsers");

      var result = [];

      var headers = allUsers[0].split(",");

      for(var i = 1; i < allUsers.length; i++){

        var obj = {};
        var currentUser = allUsers[i].split(",");

        for(var j = 0; j < headers.length; j++){
          if(currentUser[j] != undefined){
            obj[headers[j].trim()] = currentUser[j].trim();
          }
        }
        //console.log(obj);
        result.push(obj);
      }
      return result;
    }

    function isMobileNumber(phone) {
        if(phone
            && (phone.length === 10)
            && isNumber(phone)
            && isValidFirstDigit(phone)) {
            return true;
        };
        return false;
    }

    function isValidFirstDigit(phone) {
        if(phone[0] === '7'
            || phone[0] === '8'
            || phone[0] === '9') {
            return true;
        }
        return false;
    }

    function isNumber(str) {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(str);
    }



    function isValidPhone () {
        if(!$scope.user.phone
            || isNaN($scope.user.phone)
            || $scope.user.phone.length !== 10) {

            return false;
        }
        return true;
    }

}).controller('smsReportCtrl', function ($scope, $http, $timeout, $window, toastSvc,  authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }
    
   	$scope.sms = {}

  	$scope.getSmsReport = function(){
   		if($scope.sms.end_date && $scope.sms.start_date) {
     		if($scope.sms.end_date.getTime() < $scope.sms.start_date.getTime()){

	      		toastSvc.showToast('error', 'Start date can not be greater than end date');
	      		return false;
	      	}
	      	else {
	      		$scope.query = {};
			    $scope.query.start_date = $scope.sms.start_date;
			    $scope.query.end_date = $scope.sms.end_date;
	      		getReport();
	      	}	
     	}
     	else {
     		toastSvc.showToast('error', 'Please Select Date Range');
     		
     	}
    }
    getReport = function(){      
      $http({
			url: '/api/v2/smsReport',
			method: "POST",
			data: $scope.query
        }).success(function (data, status, header, config) {	
        	if(data.info) {        		
			    $scope.sms_csv = [];
			    var prev = 0;
		        for (var i = 0; i < data.info.length; i++) {		   		        
		        	if(data.info[i].from && data.info[i+1] && data.info[i+1].from && data.info[i].from == data.info[i+1].from) {		        		
		        		prev =  prev + data.info[i].phones.length;		                		    
		        	}
		        	else if(data.info[i] && data.info[i].from && data.info[i-1] && data.info[i-1].from && data.info[i].from == data.info[i-1].from) {
		        		
		        		var obj = {
		                    'date': data.info[i].logged_at,	
		                    'from': data.info[i].from,
		                    'number': data.info[i].phones.length + prev,
		                    'total sms': Math.ceil(data.info[i].body.length/160)*(data.info[i].phones.length + prev)
		                };
		                prev = 0;
		                
			        	$scope.sms_csv.push(obj);
			        	$scope.get_sms_data = true;
			        }
			        else {
			        	var obj = {
		                    'date': data.info[i].logged_at,	
		                    'from': data.info[i].from,
		                    'number': data.info[i].phones.length,
		                    'total sms': Math.ceil(data.info[i].body.length/160)*data.info[i].phones.length
		                };
		                
			        	$scope.sms_csv.push(obj);
			        	$scope.get_sms_data = true;	
			        	prev = 0;
			        }
		        	
		        }	
			        
        	}
        	
        	else {
        			toastSvc.showToast('error', 'There is no record for selected range.');
        	}
        })
        .error(function (data, status, header, config) {

            //toastSvc.showToast('error', 'There is some error in csv file.');
        });
    }

    
}).controller('batchCheckinCtrl', function ($scope, $http, $timeout, $window, toastSvc,  authService) {

	if (!authService.isLoggedIn()) {
        $location.path('/');
    }
    $scope.fileChanged = function() {
      var reader = new FileReader();
      reader.onload = function(e) {
        $scope.$apply(function() {
          $scope.jsonData = csvTOJson(reader.result);
        });
      };

      var csvFileInput = document.getElementById('fileInput');
      var csvFile = csvFileInput.files[0];
      reader.readAsText(csvFile);
    }


    $scope.submitUserList = function(){
      var csvFileInput = document.getElementById('fileInput');
      if(csvFileInput.files[0]) {
  		for (var i = 0; i < $scope.jsonData.length; i++) {  			
  			if($scope.jsonData[i].outlet_id != '') {
  				$http.post('/api/v1/bulk/panel_checkins', {
	          	rows  : $scope.jsonData[i]
	          
		        }).success(function (data, status, header, config) {
		           	
		            toastSvc.showToast('success',  i + ': ' +JSON.stringify(data.message));
		        })
		        .error(function (data, status, header, config) {
		            
		            toastSvc.showToast('error',  JSON.stringify(data.message.message));
		        });	
  			}
  			else {
  				toastSvc.showToast('success',  'Bulk Checkin Completed');
  				return false;
  			}
  					
  		};
      }
      else {
        alert("Plese Upload a CSV File");
        return false;
      }


    }

    function csvTOJson(csvFile){

      var allUsers = csvFile.split("\n");
      var result = [];

      var headers = allUsers[0].split(",");

      for(var i = 1; i < allUsers.length; i++){

        var obj = {};
        var currentUser = allUsers[i].split(",");

        for(var j = 0; j < headers.length; j++){
          if(currentUser[j] != undefined){
            obj[headers[j].trim()] = currentUser[j].trim();
          }
        }
        console.log(obj);
        result.push(obj);
      }
      return result;
    }

    function isMobileNumber(phone) {
        if(phone
            && (phone.length === 10)
            && isNumber(phone)
            && isValidFirstDigit(phone)) {
            return true;
        };
        return false;
    }

    function isValidFirstDigit(phone) {
        if(phone[0] === '7'
            || phone[0] === '8'
            || phone[0] === '9') {
            return true;
        }
        return false;
    }

    function isNumber(str) {
        var numeric = /^-?[0-9]+$/;
        return numeric.test(str);
    }



    function isValidPhone () {
        if(!$scope.user.phone
            || isNaN($scope.user.phone)
            || $scope.user.phone.length !== 10) {

            return false;
        }
        return true;
    }

})
