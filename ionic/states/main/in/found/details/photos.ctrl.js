twystApp.controller('PhotosCtrl', function($scope, dataSvc, item, logSvc) {
    logSvc.page("Photos");
    $scope.photo = dataSvc[item.item].info;

});
