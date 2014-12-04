'use strict';
twystApp.factory('dashService', function ($rootScope, $http, $log) {
    var dashSvc = {},
        _dashinfo = {},
        getOutletCount = function (user_id) {
            $http.get('/api/v1/outlets/count/' + user_id)
                .success(function (data) {
                    _dashinfo.outlet_count = data.info;
                }).error(function (data) {
                    $log.error(data);
                });
        },
        getOfferCount = function (user_id) {
            $http.get('/api/v1/programs/count/' + user_id)
                .success(function (data) {
                    _dashinfo.offer_count = data.info;
                }).error(function (data) {
                    $log.error(data);
                });
        },
        getROI = function(user_id) {
            $http.get('/api/v3/roi/')
                .success(function (data){
                    _dashinfo.roi = data.info
                }).error(function (data){
                    $log.error(data);
                })
        },
        getRepeatRate = function(user_id){
            $http.get('/api/v3/repeat_rate?timespan=2592000000')
                .success(function (data){
                    data.info = (Math.round(data.info*100)/100).toFixed(2);
                    _dashinfo.repeat_rate = data.info
                }).error(function (data){
                    $log.error(data)
                })
        };
    dashSvc.getDashboardInfo = function () {
        return _dashinfo;
    };
    dashSvc.populateDashboardInfo = function (user_id) {
        getOutletCount(user_id);
        getOfferCount(user_id);
        getROI(user_id);
        getRepeatRate(user_id);
    };
    return dashSvc;
});