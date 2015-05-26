'use strict';

var twystApp = angular.module('twystApp', ["ngRoute", 'ngAnimate', 'angles', 'toastr', 'angularFileUpload', 'ui.bootstrap', 'ngCookies', 'twystHttp']);

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
        when('/winback/create', {
            controller  : 'WinbackCtrl',
            templateUrl : '/merchant/templates/winback/create.html'
        }).
        when('/winback', {
            controller  : 'WinbackCtrl',
            templateUrl : '/merchant/templates/winback/view.html'
        }).
        when('/winback/update/:winback_id', {
            controller  : 'WinbackCtrl',
            templateUrl : '/merchant/templates/winback/update.html'
        }).
        when('/panel', {
            controller  : 'PanelCtrl',
            templateUrl : '/merchant/templates/panel/dashboard.html'
        }).
        when('/settings', {
            controller  : 'SettingCtrl',
            templateUrl : '/merchant/templates/settings/settings.html'
        }).
        when('/group_program', {
            controller  : 'GroupProgramCtrl',
            templateUrl : '/merchant/templates/group_program/view.html'
        }).
        when('/group_program/create', {
            controller  : 'GroupProgramCtrl',
            templateUrl : '/merchant/templates/group_program/create.html'
        }).
        when('/group_program/update/:group_program_id', {
            controller  : 'groupProgramUpdateCtrl',
            templateUrl : '/merchant/templates/group_program/update.html'
        }).
        when('/special_program/create/',{
            controller : 'SpecialCtrl',
            templateUrl : '/merchant/templates/special_programs/create.html'
        }).
        when('/special_program/update/:special_id', {
            controller : 'SpecialCtrl',
            templateUrl: '/merchant/templates/special_programs/update.html'
        }).
        when('/special_program', {
            controller : 'SpecialCtrl',
            templateUrl: '/merchant/templates/special_programs/view.html'
        }).
        when('/deal', {
            controller : 'DealCtrl',
            templateUrl: '/merchant/templates/deal/view.html'
        }).
        when('/deal/create', {
            controller  : 'DealCtrl',
            templateUrl : '/merchant/templates/deal/create.html'
        }).
        when('/deal/update/:deal_id', {
            controller : 'DealCtrl',
            templateUrl: '/merchant/templates/deal/update.html'
        }).
        when('/error', {
            templateUrl : '/merchant/templates/anon/error.html'
        }).
        otherwise({
            redirectTo  : '/error'
        });

    $httpProvider.interceptors.push('twystHttpInterceptor');
    }).run(function ($rootScope) {
        $rootScope.getRange = function(start, end, skip) {
            var nums = [];
            for(var i = start; i <= end; i += skip) {
                nums.push(i);
            }
            return nums;
        }

        $rootScope.getUuid = function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
                return v.toString(16);
            });
        }

        $rootScope.rewardify = function (input) {
            if(!input) {
                return '';
            }
            if (input.reward.custom && input.reward.custom.text) {
                return input.reward.custom.text;
            } else if (input.reward.flat && (input.reward.flat.off || input.reward.flat.spend)) {
                if(input.reward.flat.off && input.reward.flat.spend) {
                    return "Get Rs. " + ifEmpty(input.reward.flat.off) + " off on a minimum spend of Rs." + ifEmpty(input.reward.flat.spend);
                }
                if(input.reward.flat.off) {
                    return "Get Rs. " + ifEmpty(input.reward.flat.off) + " off on your bill";
                }
            } else if (input.reward.free && (input.reward.free.title || input.reward.free._with)) {
                if(input.reward.free.title && input.reward.free._with) {
                    return "Get a free " + ifEmpty(input.reward.free.title) + " with " + ifEmpty(input.reward.free._with);
                }
                if(input.reward.free.title) {
                    return "Get a free " + ifEmpty(input.reward.free.title);
                }
            } else if (input.reward.buy_one_get_one && input.reward.buy_one_get_one.title) {
                return "Buy one get one " + ifEmpty(input.reward.buy_one_get_one.title);
            } else if (input.reward.reduced && (input.reward.reduced.what || input.reward.reduced.worth || input.reward.reduced.for_what)) {
                if(input.reward.reduced.what && input.reward.reduced.worth) {
                   return "Get " + ifEmpty(input.reward.reduced.what) + " worth Rs. " + ifEmpty(input.reward.reduced.worth) + " for Rs. " + ifEmpty(input.reward.reduced.for_what);
                }
            } else if (input.reward.happyhours && input.reward.happyhours.extension) {
                return "Extended happy hours by " + ifEmpty(input.reward.happyhours.extension);
            } else if (input.reward.discount) {
                if (input.reward.discount.max) {
                    return "Get " + ifEmpty(input.reward.discount.percentage) + " off, subject to a maximum discount of Rs." + ifEmpty(input.reward.discount.max);
                } else {
                    return "Get " + ifEmpty(input.reward.discount.percentage) + " off on your bill";
                }
            } else {
                return ifEmpty(input.basics.description);
            }

            function ifEmpty(input) {
                if(input) {
                    return input;
                }
                return '';
            }
        }
})
.factory('toastSvc', function (toastr) {
    return {
        showToast: function (type, message, head) {
            toastr[type](message, 
                head, 
                {
                    closeButton: true
                });
        }
    }
});