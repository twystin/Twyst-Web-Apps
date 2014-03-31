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
        };

    dashSvc.getDashboardInfo = function () {
        return _dashinfo;
    };
    dashSvc.populateDashboardInfo = function (user_id) {
        getOutletCount(user_id);
        getOfferCount(user_id);
    };
    return dashSvc;
});