twystApp.factory('dataService', function($rootScope, $http, $q) {

	var dataSvc = {};

	dataSvc.getCheckinData = function(outlet, program, pageNumber, totalCountPerPage) {

		var defer = $q.defer();
        $http.get(
            '/api/v2/allcheckins/'+ outlet + '/' + program + '?pageNumber=' + pageNumber + '&totalCountPerPage=' + totalCountPerPage
        ).success(function (data) {
            for(var i = 0; i < data.info.CHECKINS.length; i++) {
                var a = data.info.CHECKINS[i].phone.substr(0, 2);
                var b = data.info.CHECKINS[i].phone.slice(-4);
                var phone = a+'XXXX'+b;
                data.info.CHECKINS[i].phone = phone;
            }
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
            for(var i = 0; i < data.info.REDEEMS.length; i++) {
                var a = data.info.REDEEMS[i].issue_details.issued_to.phone.substr(0, 2);
                var b = data.info.REDEEMS[i].issue_details.issued_to.phone.slice(-4);
                var phone = a+'XXXX'+b;
                data.info.REDEEMS[i].issue_details.issued_to.phone = phone;
            }
            defer.resolve(data);
        });
        return defer.promise;
    }

	return dataSvc;

});