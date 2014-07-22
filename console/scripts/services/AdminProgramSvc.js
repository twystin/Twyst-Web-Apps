'use strict';
twystConsole.factory('adminProgramService', function ($http, $q) {

    var adminProgramSvc = {};

    adminProgramSvc.getPrograms = function (q, pageNumber, totalCountPerPage) {
        q = q || '';
        var deferred = $q.defer();
        $http.get(
            '/api/v2/allprograms?q=' + q + '&pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    adminProgramSvc.changeStatus = function (program) {
        var deferred = $q.defer();
        $http({
            'method': 'post',
            'url': '/api/v2/changestatus/program',
            'data': {program: program}
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return adminProgramSvc;
});