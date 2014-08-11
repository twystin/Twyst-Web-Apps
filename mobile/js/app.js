'use strict';

var twystClient = angular.module('twystClient', ["ngRoute", "angularMoment", "ngTouch", "ui.bootstrap", "uuid4"])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.cache = true;
    }]).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'templates/home.html'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }
        ]);

twystClient.run(function ($rootScope, $log, $timeout, $interval, sessionSvc, dataSvc, logSvc) {
    logSvc.info("Starting the app");
    sessionSvc.run();
    dataSvc.run();

    $rootScope.distance = function (p1, p2) {
        var R = 6371; // km
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            };
        }

        if (!p1 || !p2 || _.isEmpty(p1) || _.isEmpty(p2)) {
            return 6371;
            //return null;
        }

        var dLat = (p2.latitude-p1.latitude).toRad();
        var dLon = (p2.longitude-p1.longitude).toRad();

        var lat1 = p1.latitude.toRad();
        var lat2 = p2.latitude.toRad();

        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        if (d > 20) {
            return 21;
        }
        return d.toFixed(1);
    };

    $rootScope.plural = function(word, count) {
        return count > 1 ? word + 's' : word;
    }

    // HANDLE THE BACK BUTTON CLICK
    var onDeviceReady = function(){
        document.addEventListener("backbutton", handleDeviceBackButton, false);
        setTimeout(function() {
            navigator.splashscreen.hide();
        }, 10000);
    }

    function handleDeviceBackButton(evt){
        evt.preventDefault();
        evt.stopPropagation();
        $rootScope.state = 'home'; // ideally should track current and previous state
    }

    document.addEventListener("deviceready", onDeviceReady, false);
});