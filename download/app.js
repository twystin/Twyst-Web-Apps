var app = angular.module('twystAppDownload', ["ngRoute"]);

app.config(function ($routeProvider, $httpProvider) {
    $routeProvider.
        when('/:mobile/:merchant', {
            controller  : 'MainCtrl',
            templateUrl : './helper.html'
        }).
        otherwise({
            redirectTo  : '/'
        });
});

app.controller('MainCtrl', function($scope, $http, $window, $routeParams) {
	

	$scope.getInfo = function () {
		var info = getDetails($window);

		var merchant = $routeParams.merchant;
		var mobile = $routeParams.mobile;
		
		var log = {};
		log.merchant = merchant;
		log.phone  = mobile;
		log.action = "User clicked on download link";
        console.log(log)
		createLog(merchant, mobile, log);

		detectDevice(info);
	}

	function detectDevice (info) {

		var merchant = $routeParams.merchant;
		var mobile = $routeParams.mobile;
		var log = {};
		log.merchant = merchant;
		log.phone  = mobile;
		log.action = "";
        var re = /Android/;
        
		if(info.os === 'Windows') {
	       	log.action = "User on windows";
            console.log(log);
            createLog(merchant, mobile, log);
            $window.location = 'http://twyst.in'
	    }
	    if(info.os.search(re) !== -1) {
	     	log.action = "User on Android";
            createLog(merchant, mobile, log);
            $window.location = 'https://play.google.com/store/apps/details?id=com.twyst.app.android'
	    }
	    if(info.os === 'iOS') {
	        log.action = "User on IOS";
            createLog(merchant, mobile, log);
            $window.location = 'http://twyst.in'
	    }
	}

	function createLog(merchant, mobile, log) {

		$http.post('/api/v1/smslog', log).success(function (data) {
            console.log(data);
        }).error(function (data) {
            console.log(data);
        });
	}
	 

    function getDetails(window) {
    	
    	var info;

        var browser,
            version,
            mobile,
            os,
            osversion,
            bit,
            ua = window.navigator.userAgent,
            platform = window.navigator.platform;

        if ( /MSIE/.test(ua) ) {
            
            browser = 'Internet Explorer';
            
            if ( /IEMobile/.test(ua) ) {
                mobile = 1;
            }
            
            version = /MSIE \d+[.]\d+/.exec(ua)[0].split(' ')[1];
            
        } else if ( /Chrome/.test(ua) ) {
            
            browser = 'Chrome';
            version = /Chrome\/[\d\.]+/.exec(ua)[0].split('/')[1];
            
        } else if ( /Opera/.test(ua) ) {
            
            browser = 'Opera';
            
            if ( /mini/.test(ua) || /Mobile/.test(ua) ) {
                mobile = 1;
            }
            
        } else if ( /Android/.test(ua) ) {
            
            browser = 'Android Webkit Browser';
            mobile = 1;
            os = /Android\s[\.\d]+/.exec(ua)[0];
            
        } else if ( /Firefox/.test(ua) ) {
            
            browser = 'Firefox';
            
            if ( /Fennec/.test(ua) ) {
                mobile = 1;
            }
            version = /Firefox\/[\.\d]+/.exec(ua)[0].split('/')[1];
            
        } else if ( /Safari/.test(ua) ) {
            
            browser = 'Safari';
            
            if ( (/iPhone/.test(ua)) || (/iPad/.test(ua)) || (/iPod/.test(ua)) ) {
                os = 'iOS';
                mobile = 1;
            }
            
        }

        if ( !version ) {
            
             version = /Version\/[\.\d]+/.exec(ua);
             
             if (version) {
                 version = version[0].split('/')[1];
             } else {
                 version = /Opera\/[\.\d]+/.exec(ua)[0].split('/')[1];
             }
             
        }
        
        if ( platform === 'MacIntel' || platform === 'MacPPC' ) {
            os = 'Mac OS X';
            osversion = /10[\.\_\d]+/.exec(ua)[0];
            if ( /[\_]/.test(osversion) ) {
                osversion = osversion.split('_').join('.');
            }
        } else if ( platform === 'Win32' || platform == 'Win64' ) {
            os = 'Windows';
            bit = platform.replace(/[^0-9]+/,'');
        } else if ( !os && /Android/.test(ua) ) {
            os = 'Android';
        } else if ( !os && /Linux/.test(platform) ) {
            os = 'Linux';
        } else if ( !os && /Windows/.test(ua) ) {
            os = 'Windows';
        }

        info = {
            browser : browser,
            version : version,
            mobile : mobile,
            os : os,
            osversion : osversion,
            bit: bit
        };

        return info;
    }

});