'use strict';
twystApp.factory('proSupService', function ($log, $http, $location, $q) {
    var proSupSvc = {};

    proSupSvc.updateRewardTable = function (program_id) {
        var defer = $q.defer();
        $http({
            url: '/api/v3/rewards',
            method: "POST",
            data: {program_id: program_id}
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };
   
    proSupSvc.saveTier = function (program_id, tier) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/add/tiers/' + program_id,
            method: "POST",
            data: tier
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };

    proSupSvc.saveOffer = function (tier_id, offer) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/offers/',
            method: "POST",
            data: {
                tier_id: tier_id,
                offer: offer
            }
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };

    proSupSvc.updateProgram = function (program_id, program) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/programs/' + program_id,
            method: "PUT",
            data: program
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };

    proSupSvc.updateTier = function (tier_id, tier) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/tiers/' + tier_id,
            method: "PUT",
            data: tier
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };

    proSupSvc.updateOffer = function (offer_id, offer) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/offers/',
            method: "PUT",
            data: {
                offer_id: offer_id,
                offer: offer
            }
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };

    proSupSvc.deleteTier = function (tier_id) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/delete/tier/' + tier_id,
            method: "DELETE"
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };

    proSupSvc.deleteOffer = function (offer_id) {
        var defer = $q.defer();
        $http({
            url: '/api/v1/offer/' + offer_id,
            method: "DELETE"
        }).success(function (data) {
            defer.resolve(data);
        }).error(function (data) {
            defer.reject(data);
        });
        return defer.promise;
    };    
    return proSupSvc;
});