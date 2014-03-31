'use strict';
twystApp.factory('imageService', function ($http, $q, $upload) {

    var imageSvc = {};

    imageSvc.uploadImage = function (image) {

        var deferred = $q.defer();

        $upload.upload({
            url: '/api/v1/image/upload/',
            method: 'PUT',
            file: image
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.resolve(data);
        });
        
        return deferred.promise;
    };

    return imageSvc;
});