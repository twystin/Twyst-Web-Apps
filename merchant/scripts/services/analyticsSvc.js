'use strict';
twystApp.factory('analyticsSvc', function ($rootScope, $http, $log) {
    var analyticsSvc = {},
        _datainfo = {},
        getVoucherData = function () {
            $http.get('/api/v1/analytics/vouchers')
                .success(function (data) {
                    _datainfo.voucherData = JSON.parse(data.info).voucher_data_all;
                    _datainfo.voucherData.datasets[0].fillColor = "rgba(151,187,205,0)";
                    _datainfo.voucherData.datasets[0].strokeColor = "#e67e22";
                    _datainfo.voucherData.datasets[0].pointColor = "rgba(151,187,205,0)";
                    _datainfo.voucherData.datasets[0].pointStrokeColor = "#e67e22";
                    _datainfo.chart2 = _datainfo.voucherData;
                }).error(function (data) {
                    $log.error(data);
                });
        },
        getCheckinData = function () {
            $http.get('/api/v1/analytics/checkins')
                .success(function (data) {
                    _datainfo.checkinData = JSON.parse(data.info).checkin_data_all;
                    _datainfo.checkinData.datasets[0].fillColor = "rgba(151,187,205,0)";
                    _datainfo.checkinData.datasets[0].strokeColor = "#e67e22";
                    _datainfo.checkinData.datasets[0].pointColor = "rgba(151,187,205,0)";
                    _datainfo.checkinData.datasets[0].pointStrokeColor = "#e67e22";
                    _datainfo.chart1 = _datainfo.checkinData;
                }).error(function (data) {
                    $log.error(data);
                });
        },
        getCheckinCount = function ($scope) {
            $http.get('/api/v1/analytics/checkin_count')
                .success(function (data) {
                    console.log(data);
                    $scope.checkins_count = data.info;
                    console.log($scope.checkins_count);
                }).error(function (data) {
                    $log.error(data);
                });
        },
        getVoucherCount = function ($scope) {
            $http.get('/api/v1/analytics/voucher_count')
                .success(function (data) {
                    $scope.vouchers_count = data.info;
                }).error(function (data) {
                    $log.error(data);
                });
        };

    analyticsSvc.getAnalyticsInfo = function () {
        return _datainfo;
    };

    analyticsSvc.populateAnalyticsInfo = function () {
        getVoucherData();
        getCheckinData();
    };

    analyticsSvc.populateCountInfo = function ($scope) {
        getVoucherCount($scope);
        getCheckinCount($scope);
    };

    analyticsSvc.getVouchers = function ($scope, $http, $location, outlet_id) {
        $http.get('/api/v1/vouchers/' + outlet_id)
            .success(function (data) {
                $scope.vouchers = JSON.parse(data.info);
            }).error(function (data, status, header, config) {
                //TODO: Handle error case
            });
    };

    analyticsSvc.getSummaryCheckins = function ($scope, $http, $location) {
        $http.get('/api/v1/analytics/checkins/' + $scope.program_id)
            .success(function (data) {
                $scope.checkins_summary = JSON.parse(data.info);
            }).error(function (data, status, header, config) {
                //TODO: Handle error case
            });
    };

    analyticsSvc.getSummaryVouchers = function ($scope, $http, $location) {
        $http.get('/api/v1/analytics/vouchers/' + $scope.program_id)
            .success(function (data) {
                $scope.vouchers_summary = JSON.parse(data.info);
            }).error(function (data, status, header, config) {
                //TODO: Handle error case
            });
    };

    return analyticsSvc;
});