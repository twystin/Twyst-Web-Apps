'use strict';

var twystApp = angular.module('twystApp', ["ngRoute", 'angles', 'angularFileUpload', 'ui.bootstrap', 'ngCookies', 'twystHttp']);

twystApp.config(function ($routeProvider, $httpProvider) {
    $routeProvider.
        when('/', {
            controller  : 'AnonCtrl',
            templateUrl : '/merchant/templates/anon/home.html'
        }).
        when('/detect/device', {
            controller  : 'DeviceCtrl',
            templateUrl : '/merchant/templates/anon/detect.html'
        }).
        when('/contact', {
            controller  : 'AnonCtrl',
            templateUrl : '/merchant/templates/anon/contact.html'
        }).
        when('/privacy', {
            controller  : 'AnonCtrl',
            templateUrl : '/merchant/templates/anon/privacy.html'
        }).
        when('/public/outlets/', {
            controller  : 'PublicCtrl',
            templateUrl : '/merchant/templates/public/outlets.html'
        }).
        when('/public/outlets/:outlet', {
            controller  : 'PublicCtrl',
            templateUrl : '/merchant/templates/public/outlet.html'
        }).
        when('/public/share/:outlet/:offer', {
            controller  : 'PublicCtrl',
            templateUrl : '/merchant/templates/public/share.html'
        }).
        when('/dashboard/home', {
            controller  : 'DashboardCtrl',
            templateUrl : '/merchant/templates/dashboard/home.html'
        }).
        when('/analytics', {
            controller  : 'AnalyticsCtrl',
            templateUrl : '/merchant/templates/analytics/analytics.html'
        }).
        when('/analytics/summary', {
            controller  : 'AnalyticsCtrl',
            templateUrl : '/merchant/templates/analytics/summary.html'
        }).
        when('/analytics/frequency', {
            controller  : 'AnalyticsCtrl',
            templateUrl : '/merchant/templates/analytics/frequency.html'
        }).
        when('/auth/register', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/auth/register.html'
        }).
        when('/validate/email/:token', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/auth/email_validated.html'
        }).
        when('/auth/reset/:token', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/auth/reset.html'
        }).
        when('/create/user', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/profile/user/create_user.html'
        }).
        when('/users', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/profile/user/users.html'
        }).
        when('/users/edit/:username', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/profile/user/edit.html'
        }).
        when('/profile/info', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/profile/add_information.html'
        }).
        when('/profile/change/password', {
            controller  : 'AuthCtrl',
            templateUrl : '/merchant/templates/profile/change_password.html'
        }).
        when('/outlets', {
            controller  : 'OutletCtrl',
            templateUrl : '/merchant/templates/outlet/outlets.html'
        }).
        when('/outlets/create', {
            controller  : 'OutletCtrl',
            templateUrl : '/merchant/templates/outlet/create.html'
        }).
        when('/outlets/:outlet_id', {
            controller  : 'OutletCtrl',
            templateUrl : '/merchant/templates/outlet/steps/review.html'
        }).
        when('/outlets/update/:outlet_id', {
            controller  : 'OutletCtrl',
            templateUrl : '/merchant/templates/outlet/update.html'
        }).
        when('/offers/create', {
            controller  : 'ProgramsCtrl',
            templateUrl : '/merchant/templates/offer/select.html'
        }).
        when('/offers/create/:program_type', {
            controller  : 'ProgramsCtrl',
            templateUrl : '/merchant/templates/offer/create.html'

        }).
        when('/offers', {
            controller  : 'ProgramsCtrl',
            templateUrl : '/merchant/templates/offer/offers.html'
        }).
        when('/offers/:program_name', {
            controller  : 'ProgramsCtrl',
            templateUrl : '/merchant/templates/offer/steps/review.html'
        }).
        when('/offers/update/:program_id', {
            controller  : 'programUpdateCtrl',
            templateUrl : '/merchant/templates/offer/update.html'
        }).
        when('/panel', {
            controller  : 'PanelCtrl',
            templateUrl : '/merchant/templates/panel/dashboard.html'
        }).
        when('/settings', {
            controller  : 'SettingCtrl',
            templateUrl : '/merchant/templates/settings/settings.html'
        }).
        when('/error', {
            templateUrl : '/merchant/templates/anon/error.html'
        }).
        otherwise({
            redirectTo  : '/error'
        });

    $httpProvider.interceptors.push('twystHttpInterceptor');
});