'use strict';

twystApp.controller('PanelCtrl', function ($scope, $interval, $http, $location, authService, outletService) {
    
    if(!authService.isLoggedIn()) {
        $location.path('/');
    }

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }

    var days = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    $scope.notifs = [];
    var skip = 0;
    $scope.loading = false;

    var reward = {
        "breakfast": {
            'start': {
                'time': 480
            },
            'end': {
                'time': 690
            }
        },
        "brunch": {
            'start': {
                'time': 660
            },
            'end': {
                'time': 780
            }
        },
        "lunch": {
            'start': {
                'time': 690
            },
            'end': {
                'time': 900
            }
        },
        "evening": {
            'start': {
                'time': 900
            },
            'end': {
                'time': 1140
            }
        },
        "dinner": {
            'start': {
                'time': 1140
            },
            'end': {
                'time': 1439
            }
        }
    };

    $scope.template = {
        'success': false,
        'error': false,
        'voucher': false,
        'user': false,
        'none': true
    };

    $scope.error = {
        'status': null,
        'message': null
    };

    $scope.success = {
        'status': null,
        'message': null
    };

    $scope.counts = {
        'checkin': null,
        'voucher': null,
        'redeem': null
    };

    $scope.checkin = {};
    $scope.outlet = {};
    
    $interval(function () {
        $scope.refresh();
    }, 1000*60*10);

    $scope.refresh = function () {
        $scope.notifs = [];
        $scope.getCommonNotify(0);
        if($scope.outlet._id) {
            getCounts();
        }
    };

    $scope.$watch('selected_outlet', function() {
        
        $scope.outlet = _.find($scope.outlets, function (obj){
            return obj._id === $scope.selected_outlet;
        });
        if (!_.isEmpty($scope.outlet) && $scope.outlet._id) {
            getCounts();
        };
    });

    $scope.voucherStatusClass = function (voucher) {

        if(_.isEmpty(voucher)) {
            return;
        }

        if(new Date(voucher.issue_details.program.validity.burn_end) <= new Date()) {
            return 'voucher-redeemed';
        }

        if(voucher.basics.status === 'active') {
            return 'voucher-active';
        }

        if(voucher.basics.status === 'merchant redeemed') {
            return 'voucher-redeemed';
        }

        if(voucher.basics.status === 'user redeemed') {
            return 'voucher-active';
        }
    }

    $scope.isVoucherExpired = function (voucher) {
        if(new Date(voucher.issue_details.program.validity.burn_end) <= new Date()) {
            return true;
        }
        return false;
    }

    $scope.checkVoucherApplicability = function(voucher) {

        if(_.isEmpty(voucher)) {
            return;
        }

        if(new Date(voucher.issue_details.program.validity.burn_end) <= new Date()) {
            return 'has Expired.';
        }

        if(voucher.basics.status === 'merchant redeemed') {
            return 'has already been used.';
        }

        if(checkApplicabilityDay(voucher) && checkApplicabilityTime(voucher)) {
            return 'is ACTIVE and VALID at this time.'
        }
        else {
            return 'is ACTIVE but NOT VALID at this time.'
        }
    }

    $scope.getStatus = function(voucher) {

        if(_.isEmpty(voucher)) {
            return;
        }

        if(new Date(voucher.issue_details.program.validity.burn_end) <= new Date()) {
            return 'Expired';
        }

        if(voucher.basics.status === 'merchant redeemed') {
            return 'Used';
        }

        return 'Active';
    }

    function checkApplicabilityDay (voucher) {

        var mark_valid = false;

        if(voucher.issue_details.issued_for && 
            voucher.issue_details.issued_for.reward_applicability &&
            voucher.issue_details.issued_for.reward_applicability.day_of_week.length > 0) {
            
            var today = new Date().getDay();
            
            voucher.issue_details.issued_for.reward_applicability.day_of_week.forEach(function (day) {
                if(day === 'all days') {
                    mark_valid = true;
                }
                else if(days[today] === day) {
                    mark_valid = true;
                }
                else {
                    // Do nothing
                }
            });


            if(mark_valid) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function checkApplicabilityTime (voucher) {
        
        var mark_valid = false;

        if(voucher.issue_details.issued_for.reward_applicability.time_of_day
            && voucher.issue_details.issued_for.reward_applicability.time_of_day.length > 0) {

            var hour = new Date().getHours();
            var minute = new Date().getMinutes();

            var time_in_minutes = hour * 60 + minute;
            voucher.issue_details.issued_for.reward_applicability.time_of_day.forEach(function (time) {
                if(time === 'all day') {
                    mark_valid = true;
                }
                else if(reward[time].start.time <= time_in_minutes && reward[time].end.time >= time_in_minutes) {
                    mark_valid = true;
                }
                else {
                    // Do nothing
                }
            });

            if(mark_valid) {
                return true;
            }
            else {
                return false;
            }
        }
        else {
            return false;
        }
    }

    function getCounts () {

        $http.get('/api/v1/getcounts/' + $scope.outlet._id).success(function(data, status, header, config) {
            $scope.counts.checkin = data.info.checkin_count;
            $scope.counts.voucher = data.info.voucher_count;
            $scope.counts.redeem = data.info.redeem_count;
        }).error(function (data) {
            
        });
    }

    function templateController (v1, v2, v3, v4, v5) {

        $scope.template.success = v1;
        $scope.template.error = v2;
        $scope.template.voucher = v3;
        $scope.template.user = v4;
        $scope.template.none = v5;
    };

    function errorController(status, message) {
        
        $scope.error.status = status;
        $scope.error.message = message;
        templateController(false, true, false, false, false);
    }

    function isMobileNumber(phone) {
        if(isNaN(phone)) {
            return false;
        }
        if(phone.length !== 10) {
            return false;
        }
        return true;
    }

    function goForCheckin() {

        if ($scope.outlet._id && $scope.checkin.phone_no) {

            $scope.loading = true;

            $http.post('/api/v1/checkins', {
                phone: $scope.checkin.phone_no,
                outlet: $scope.outlet._id,
                location: $scope.checkin.location
            }).success(function (data) {

                $scope.checkin = {};

                $scope.loading = false;
                if(data.status === 'error') {
                    errorController(data.status, data.message);
                }
                else {
                    $scope.success.message = data.message;
                    templateController(true, false, false, false, false);
                }
                $scope.refresh();
            }).error(function (data) {
                $scope.loading = false;
                errorController(data.status, data.message);
                $scope.refresh();
            });
        }
    };

    $scope.createCheckin = function () {

        if(!outlet.attributes.home_delivery) {
            $scope.checkin.location = "DINE_IN";
        }

        if(!$scope.checkin.location) {
            $scope.checkin_select_dirty = true;
        }
        else if(isMobileNumber($scope.checkin.phone_no)) {
            goForCheckin();
        }
        else {
            $scope.checkin_phone_no_dirty = true;
        }
    };
    $scope.createRedeem = function () {
        if ($scope.outlet._id && $scope.voucher.basics.code) {
            $scope.loading = true;
            $http.post('/api/v1/redeem/vouchers', {
                code: $scope.voucher.basics.code,
                phone: $scope.phone,
                used_at: $scope.outlet._id
            }).success(function(data, status, header, config) {
                
                $scope.loading = false;
                
                if(data.status === 'error') {
                    errorController(data.status, data.message);
                }
                else {
                    $scope.loading = false;
                    templateController(true, false, false, false, false);
                    $scope.success.message = data.message;
                }
                $scope.refresh();
            }).error(function (data) {
                errorController(data.status, data.message);
                $scope.refresh();
            });
        }
    };
    $scope.getVoucherDetails = function () {
        if (($scope.code)) {

            $scope.loading = true;
            
            $http.get('/api/v1/vouchers/' + $scope.code.toUpperCase(), {
                code: $scope.code
            }).success(function(data, status, header, config) {
                $scope.loading = false;

                if(JSON.parse(data.info) !== null) {
                    $scope.voucher = JSON.parse(data.info); 
                    templateController(false, false, true, false, false);                   
                }
                else {
                    errorController(data.status, data.message);
                }
            }).error(function (data) {
                $scope.loading = false;
                errorController(data.status, data.message);
            });
        }
    };
    $scope.getVoucherDetailsByPhone = function () {
        $scope.vouchers = [];
        if(isMobileNumber($scope.phone)) {
            goForVoucher();
        }
        else {
            $scope.phone_no_dirty = true;
        }
    };

    function goForVoucher() {
        if (($scope.phone !== undefined)) {

            $scope.loading = true;
            
            $http.get('/api/v1/vouchers_by_phone/' + $scope.phone).success(function(data, status, header, config) {
                
                $scope.loading = false;

                if(data.info !== "null" && data.info.length > 0) {
                    $scope.vouchers = JSON.parse(data.info);
                    templateController(false, false, false, true, false);
                }
                else {
                    errorController(data.status, data.message);
                }
            }).error(function (data) {    
                $scope.loading = false;            
                errorController(data.status, data.message);
            });
        }
    }

    $scope.getDetails = function ( item ) {
        $scope.voucher = item;
        templateController(false, false, true, false, false);
    };

    $scope.getVoucherNotify = function () {
        $scope.voucher_change_status_error = null;
        $http.get('/api/v1/notify/voucher').success(function(data) {           
            if(data.info.length > 0) {
                $scope.voucher_notify = JSON.parse(data.info);
            }
        }).error(function (data) {
            $locationProvider.location.path('#/panel')
        });
    };
    $scope.getCommonNotify = function (skip) {
        $scope.voucher_change_status_error = null;
        $http.get('/api/v2/notify/merchants/' + skip).success(function(data) {           
            if(data.info && data.info.length > 0) {
                $scope.notifs = $scope.notifs.concat(data.info);
            }
        }).error(function (data) {
           
        });
    };
    $scope.loadMore = function () {
        skip += 20;
        $scope.getCommonNotify(skip);
    }
    $scope.changeVoucherStatus = function (code) {
        
        $http.get('/api/v1/vouchers/status/change/'+code).success(function(data) {
            $scope.refresh();
        }).error(function (data) {
            $scope.refresh();
            $scope.voucher_change_status_error = data.message;
        });
    };
    
    $scope.outletQuery = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;
        
        $http.get('/api/v1/outlets/' + user_id).success(function (data) {
            $scope.outlets = JSON.parse(data.info);
            if($scope.outlets.length > 0) {
                $scope.outlet = $scope.outlets[0];
                $scope.selected_outlet = $scope.outlets[0]._id;
            }
        }).error(function (data) {
            
        });
    };
});