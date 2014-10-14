'use strict';

twystApp.controller('PanelCtrl', function ($scope, $modal, $timeout, $interval, $http, $location, authService, outletService) {

    if (!authService.isLoggedIn()) {
        $location.path('/');
    }

    if (authService.isLoggedIn() && authService.getAuthStatus().role > 4) {
        $location.path('/panel');
    }

    $scope.isAuthorized = function () {
        if(authService.getAuthStatus().role <= 5) {
            return true;
        }
        return false;
    }

    var days = [ 'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

    $scope.notifs = [];
    var skip = 0;
    $scope.loading = false;
    $scope.max_date = new Date();
    $scope.min_date = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    $scope.data_checkin = {
        'outlet': null,
        'program': null
    };

    $scope.data_voucher = {
        'outlet': null,
        'program': null
    };

    $scope.data_redeem = {
        'outlet': null,
        'program': null
    };

    $scope.page = {
        'currentPage' : 1
    }

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
    $scope.checkin.created_date = new Date();
    $scope.used = {};
    $scope.used.time = new Date();
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

    $scope.filterChanged = function (value) {
        $scope.filtered_vouchers = [];
        if(value) {
            if(value === 'Active') { 

                $scope.vouchers.forEach(function (voucher) {
                    if((voucher.basics.status === 'active'
                        || voucher.basics.status === 'user redeemed')
                        && (new Date(voucher.issue_details.program.validity.burn_end) > new Date())
                        && (new Date(new Date(voucher.basics.created_at).getTime() + 3 * 60 * 60 * 1000) < new Date())) {
                        $scope.filtered_vouchers.push(voucher);
                    }
                })
            } 
            else if(value === 'Used') {
                $scope.vouchers.forEach(function (voucher) {
                    if(voucher.basics.status === 'merchant redeemed') {
                        $scope.filtered_vouchers.push(voucher);
                    }
                })
            } 
            else if(value === 'Expired') {
                $scope.vouchers.forEach(function (voucher) {
                    if(voucher.basics.status !== 'merchant redeemed'
                        && new Date(voucher.issue_details.program.validity.burn_end) <= new Date()) {
                        $scope.filtered_vouchers.push(voucher);
                    }
                })
            } 
            else if(value === 'All') {
                $scope.vouchers.forEach(function (voucher) {
                    if((new Date(new Date(voucher.basics.created_at).getTime() + 3 * 60 * 60 * 1000) < new Date())) {
                        $scope.filtered_vouchers.push(voucher);
                    }
                })
            } 
        }
    }

    $scope.$watch('selected_outlet', function() {
        
        $scope.outlet = _.find($scope.outlets, function (obj){
            return obj._id === $scope.selected_outlet;
        });
        if (!_.isEmpty($scope.outlet) && $scope.outlet._id) {
            getActiveProgram($scope.programs, $scope.outlet);
            getCounts();
        };
    });

    $scope.$watch('program', function() {
        getCounts();
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

        if(voucher.basics.status === 'merchant redeemed') {
            return 'has already been used.';
        }

        if(new Date(voucher.issue_details.program.validity.burn_end) <= new Date()) {
            return 'has Expired.';
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

        if(voucher.basics.status === 'merchant redeemed') {
            return 'Used';
        }

        if(new Date(voucher.issue_details.program.validity.burn_end) <= new Date()) {
            return 'Expired';
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

        if($scope.program && $scope.selected_outlet) {
            $http.get(
                '/api/v1/getcounts/' + $scope.outlet._id + '/' + $scope.program._id
                ).success(function(data, status, header, config) {
                
                $scope.counts.checkin = data.info.checkin_count;
                $scope.counts.voucher = data.info.voucher_count;
                $scope.counts.redeem = data.info.redeem_count;
            }).error(function (data) {
                
            });
        }
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
            $http.post('/api/v2/checkins', {
                phone: $scope.checkin.phone_no,
                outlet: $scope.outlet._id,
                location: $scope.checkin.location,
                created_date: $scope.checkin.created_date
            }).success(function (data) {
                $scope.checkin.phone_no = '';
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
                $scope.checkin.phone_no = '';
                $scope.loading = false;
                errorController(data.status, data.message);
                $scope.refresh();
            });
        }
    };

    $scope.createCheckin = function () {
        if($scope.outlet.attributes.dine_in && !$scope.outlet.attributes.home_delivery){
            $scope.checkin.location = "DINE_IN";
        }
        else if(!$scope.outlet.attributes.dine_in && $scope.outlet.attributes.home_delivery){
            $scope.checkin.location = "HOME_DELIVERY";
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
            var used_time = $scope.used.time;
            $http.post('/api/v1/redeem/vouchers', {
                code: $scope.voucher.basics.code,
                phone: $scope.phone,
                used_at: $scope.outlet._id,
                used_time: used_time
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
                $scope.loading = false;
                errorController(data.status, data.message);
                $scope.refresh();
            });
        }
    };
    $scope.getVoucherDetails = function () {
        if (($scope.code)) {

            $scope.loading = true;
            
            $http.get('/api/v1/vouchers/' + $scope.code.toUpperCase() + '/'+ $scope.outlet._id, {
                code: $scope.code,
                searchedAt: $scope.outlet._id
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
        $scope.filtered_vouchers = [];
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
            
            $http.get('/api/v1/vouchers_by_phone/' + $scope.phone + '/' + $scope.outlet._id).success(function(data, status, header, config) {
                
                $scope.loading = false;

                if(data.info) {
                    $scope.vouchers = data.info.VOUCHERS || [];
                    $scope.filtered_vouchers = $scope.vouchers || [];
                    $scope.CHECKIN_COUNT = data.info.CHECKIN_COUNT || 0;
                    $scope.filterChanged('All');
                    templateController(false, false, false, true, false);
                    $scope.voucher_filter = 'All';
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
        $scope.loading = true;

        $http.get('/api/v1/vouchers/status/change/'+code).success(function(data) {
            $scope.loading = false;
            templateController(true, false, false, false, false);
            $scope.success.message = data.message;
            $scope.refresh();
        }).error(function (data) {
            $scope.loading = false;
            errorController(data.status, data.message);
            $scope.refresh();
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

    $scope.getPrograms = function () {
        $scope.auth = authService.getAuthStatus();
        var user_id = $scope.auth._id;

        $http.get('/api/v1/programs/' + user_id).success(function (data) {
            $scope.programs = JSON.parse(data.info) || [];
            getActiveProgram($scope.programs, $scope.outlet)
        }).error(function (data) {
            
        });
    };

    function getActiveProgram (programs, outlet) {
        var program_running_on_outlet = null;
        if(programs && programs.length > 0) {
            programs.forEach (function (program) {
                if(program.status === 'active') {
                    var active_program_running = getProgramRunningOnThisOutlet(program, $scope.outlet);
                    console.log(active_program_running)
                    if(active_program_running) {
                        program_running_on_outlet = active_program_running;
                    }
                }
            });
            if(program_running_on_outlet) {
                $scope.program = program_running_on_outlet;
            };
            var program = {
                'name': 'All',
                '_id': 'ALL'
            };
            if(programs[programs.length - 1]._id !== 'ALL') {
                $scope.programs.push(program);
            }
            if(!$scope.program) {
                $scope.program = $scope.programs[0];
            }
        }
    }

    function getProgramRunningOnThisOutlet(program, outlet) {
        if(!outlet) {
            return null;
        }
        var p = null;
        program.outlets.forEach(function (o) {
            console.log(o._id.toString() === outlet._id.toString())
            if(o._id.toString() === outlet._id.toString()) {
                p = program;
            }
        });
        return p;
    }

    $scope.checkinsModal = function () {
        var modalInstance = $modal.open({
            templateUrl : './templates/panel/checkin_modal.html',
            controller  : 'CheckinDataCtrl',
            backdrop    : 'static',
            keyboard    : true,
            scope: $scope
        });
    };

    $scope.vouchersModal = function () {
        var modalInstance = $modal.open({
            templateUrl : './templates/panel/voucher_modal.html',
            controller  : 'VoucherDataCtrl',
            backdrop    : 'static',
            keyboard    : true,
            scope: $scope
        });
    };

    $scope.redeemsModal = function () {
        var modalInstance = $modal.open({
            templateUrl : './templates/panel/redeem_modal.html',
            controller  : 'RedeemDataCtrl',
            backdrop    : 'static',
            keyboard    : true,
            scope: $scope
        });
    };
}).

controller('CheckinDataCtrl', function ($modalInstance, $scope, $location, dataService) {
    

    function init () {
        $scope.page.currentPage = 1;
        $scope.totalCountPerPage = 10;
        $scope.totalCheckins = 10;
        $scope.maxSize = 4;
        $scope.checkins = [];
    }

    init();

    $scope.data_checkin.outlet = $scope.selected_outlet;
    $scope.data_checkin.program = $scope.program._id;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.$watch('page.currentPage', function() {
        $scope.getCheckinData();
    });

    $scope.$watch('data_checkin', function() {
        init();
        $scope.getCheckinData();
    }, true);

    $scope.getCheckinData = function () {
        dataService.getCheckinData(
            $scope.data_checkin.outlet,
            $scope.data_checkin.program,
            $scope.page.currentPage,
            $scope.totalCountPerPage).then(function (data) {

            $scope.checkins = data.info.CHECKINS || [];
            $scope.totalCheckins = data.info.totalCount;
        })
    }
}).

controller('VoucherDataCtrl', function ($modalInstance, $scope, $location, dataService) {
    

    function init () {
        $scope.page.currentPage = 1;
        $scope.totalCountPerPage = 10;
        $scope.totalVouchers = 10;
        $scope.maxSize = 4;
        $scope.vouchers_list = [];
    }

    init();

    $scope.data_voucher.outlet = $scope.selected_outlet;
    $scope.data_voucher.program = $scope.program._id;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.$watch('page.currentPage', function() {
        $scope.getVoucherData();
    });

    $scope.$watch('data_voucher', function() {
        init();
        $scope.getVoucherData();
    }, true);

    $scope.getVoucherData = function () {
        dataService.getVoucherData(
            $scope.data_voucher.outlet,
            $scope.data_voucher.program,
            $scope.page.currentPage,
            $scope.totalCountPerPage).then(function (data) {

            $scope.vouchers_list = data.info.VOUCHERS || [];
            $scope.totalVouchers = data.info.totalCount;
        })
    }
}).

controller('RedeemDataCtrl', function ($modalInstance, $scope, $location, dataService) {
    

    function init () {
        $scope.page.currentPage = 1;
        $scope.totalCountPerPage = 10;
        $scope.totalRedeems = 10;
        $scope.maxSize = 4;
        $scope.redeems = [];
    }

    init();

    $scope.data_redeem.outlet = $scope.selected_outlet;
    $scope.data_redeem.program = $scope.program._id;

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.$watch('page.currentPage', function() {
        $scope.getRedeemData();
    });

    $scope.$watch('data_redeem', function() {
        init();
        $scope.getRedeemData();
    }, true);

    $scope.getRedeemData = function () {
        dataService.getRedeemData(
            $scope.data_redeem.outlet,
            $scope.data_redeem.program,
            $scope.page.currentPage,
            $scope.totalCountPerPage).then(function (data) {

            $scope.redeems = data.info.REDEEMS || [];
            $scope.totalRedeems = data.info.totalCount;
        })
    }
})