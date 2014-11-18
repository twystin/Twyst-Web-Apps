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
            deferred.reject(data);
        });
        
        return deferred.promise;
    };

    imageSvc.uploadImageV3 = function (image_file, imageObject) {
        var deferred = $q.defer();
        $upload.upload({
            url: '/api/v3/images',
            method: 'PUT',
            file: image_file,
            data: imageObject
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });        
        return deferred.promise;
    };

    imageSvc.deleteImage = function (imageObject) {
        var deferred = $q.defer();
        $http({
            url: '/api/v3/images',
            method: 'DELETE',
            params: imageObject
        }).success(function (data) {
            deferred.resolve(data);
        }).error(function (data) {
            deferred.reject(data);
        });        
        return deferred.promise;
    };

    return imageSvc;
});