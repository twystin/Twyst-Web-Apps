twystApp.factory('dataService', function($rootScope, $http, $q) {

	var dataSvc = {};

	dataSvc.getCheckinData = function(outlet, program, pageNumber, totalCountPerPage) {

		var defer = $q.defer();
        $http.get(
            '/api/v2/allcheckins/'+ outlet + '/' + program + '?pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
	}

    dataSvc.getVoucherData = function(outlet, program, pageNumber, totalCountPerPage) {

        var defer = $q.defer();
        $http.get(
            '/api/v2/allvouchers/'+ outlet + '/' + program + '?pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    dataSvc.getRedeemData = function(outlet, program, pageNumber, totalCountPerPage) {

        var defer = $q.defer();
        $http.get(
            '/api/v2/allredeems/'+ outlet + '/' + program + '?pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

	return dataSvc;

});