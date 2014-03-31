'use strict';

var twystClient = angular.module('twystClient', ["ngMap", "ngRoute", "ui.bootstrap"])
    .config(['$httpProvider', function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        $httpProvider.defaults.cache = true;
    }]).config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/', {
                    templateUrl: 'templates/home.html',
                    controller: 'HomeCtrl'
                }).
                when('/recco/:id', {
                    templateUrl: 'templates/recco_detail.html',
                    controller: 'ReccoDetailCtrl'
                }).
                when('/near/:id', {
                    templateUrl: 'templates/near_detail.html',
                    controller: 'NearDetailCtrl'
                }).
                when('/settings', {
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingsCtrl'
                }).
                when('/errors', {
                    templateUrl: 'templates/error.html',
                    controller: 'DataCtrl'
                }).
                when('/near', {
                    templateUrl: 'templates/near.html',
                    controller: 'NearCtrl'
                }).
                when('/my', {
                    templateUrl: 'templates/my.html',
                    controller: 'MyCtrl'
                }).
                when('/settings', {
                    templateUrl: 'templates/settings.html',
                    controller: 'SettingsCtrl'
                }).
                when('/checkin', {
                    templateUrl: 'templates/checkin.html',
                    controller: 'CheckinCtrl'
                }).
                when('/signin', {
                    templateUrl: 'templates/signin.html',
                    controller: 'SignInCtrl'
                }).
                otherwise({
                    redirectTo: '/'
                });
        }
        ]);

twystClient.run(function ($rootScope, $log, $timeout, sessionSvc, dataSvc) {
    sessionSvc.run();
    $timeout(function() {
        dataSvc.run();
    }, 1000);

    $rootScope.distance = function (p1, p2) {
        var R = 6371; // km
        if (typeof (Number.prototype.toRad) === "undefined") {
            Number.prototype.toRad = function() {
                return this * Math.PI / 180;
            };
        }
        if (!p1 || !p2) {
            return null;
        }

        var dLat = (p2.latitude-p1.latitude).toRad();
        var dLon = (p2.longitude-p1.longitude).toRad();
        var lat1 = p1.latitude.toRad();
        var lat2 = p2.latitude.toRad();
        var a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.sin(dLon/2) * Math.sin(dLon/2) * Math.cos(lat1) * Math.cos(lat2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    };
    $rootScope.plural = function(word, count) {
        return count > 1 ? word + 's' : word;
    }
});