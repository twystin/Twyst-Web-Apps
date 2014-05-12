'use strict';
twystApp.factory('typeaheadService', function ($http, $q) {

    var typeSvc = {};

    typeSvc.getTags = function (q) {

        var deferred = $q.defer();

        $http({
            url: '/api/v1/typeahead/tags/' + q,
            method: "GET",
            data: ''
        }).success(function (data) {
            deferred.resolve(data.info);
        }).error(function (data) {
            deferred.resolve(data.info);
        });
        
        return deferred.promise;
    };

    typeSvc.getTagNames = function (key) {
        var defer = $q.defer();
        typeSvc.getTags(key).then(function(tags){
            var tagNames = [];
            for (var i = 0; i<tags.length;i++) {
                tagNames.push(tags[i].name);
            };
            defer.resolve(tagNames)
        });
        return defer.promise;
    };

    return typeSvc;
});