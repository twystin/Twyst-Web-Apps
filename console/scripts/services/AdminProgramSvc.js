'use strict';
twystConsole.factory('adminProgramService', function ($http, $q) {

    var adminProgramSvc = {};
    adminProgramSvc.getPrograms = function (q, pageNumber, totalCountPerPage, sortParam, sortOrder) {
        sortParam = sortParam || "name";
        sortOrder = sortOrder || 1;
        q = q || '';
        var deferred = $q.defer();
        $http.get(
            '/api/v2/allprograms?q=' + q + '&pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage + '&sortBy=' + sortParam + '&sortOrder=' + sortOrder
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
            'data': {
                program_id: program._id,
                status: program.status
            }
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return adminProgramSvc;
});