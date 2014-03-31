'use strict';

twystApp.controller('AnonCtrl', function($scope, $location, $modal, authService) {

    $scope.getInTouch = function () {
        var modalInstance = $modal.open({
            templateUrl : './templates/anon/register.html',
            controller  : 'GetInTouchCtrl',
            backdrop    : true
        });
    };
});

twystApp.controller('GetInTouchCtrl', function ($scope, $modalInstance, $http) {
    $scope.merchant = {};

    $scope.cancel = function () {
        $modalInstance.dismiss('cancel');
    };

    $scope.addMerchant = function () {
        if (($scope.merchant.establishment_name !== "") ||
                ($scope.merchant.person_name !== "") ||
                ($scope.merchant.phone_number !== "")) {
            $http.post('/api/v1/beta/merchants',
                {   establishment_name  : $scope.merchant.establishment_name,
                    person_name         : $scope.merchant.person_name,
                    phone_number        : $scope.merchant.phone_number,
                    email               : $scope.merchant.email
                })
                .success(function (data, status, header, config) {
                    $scope.merchant.thank_you = true;
                })
                .error(function (data, status, header, config) {
                    $scope.merchant.error = true;
                });
        }
    };
});

twystApp.controller('CarouselCtrl', function ($scope) {
    $scope.slideInterval = 3000;
    var i = 0,
        slides = $scope.slides = [];
    $scope.addSlide = function () {
        slides.push({
            title   : "Cloud Hosted",
            image   : "../../../common/images/carousel/0_with_our_cloud_hosted.jpg",
            text    : "With our simple and flexible cloud hosted service..."
        });
        slides.push({
            title   : "Flexible programs",
            image   : "../../../common/images/carousel/1_programs.jpg",
            text    : "...you can create powerful and flexible programs..."
        });
        slides.push({
            title   : "Targeted",
            image   : "../../../common/images/carousel/2_target_at_customers.jpg",
            text    : "...that target your new and existing customers"
        });
        slides.push({
            title   : "Phone app",
            image   : "../../../common/images/carousel/4_who_access_on_phone.jpg",
            text    : "...who receive notifications on their phones..."
        });
        slides.push({
            title   : "Relevant and Personal",
            image   : "../../../common/images/carousel/5_to_see_relevant_vouchers.jpg",
            text    : "...to view relevant and personalized offers..."
        });
        slides.push({
            title   : "Location aware",
            image   : "../../../common/images/carousel/6_in_locations_that_matter_to_them.jpg",
            text    : "...at places near them!"
        });
        slides.push({
            title   : "Easy check-in",
            image   : "../../../common/images/carousel/7_and_checkin_to_your_outlet.jpg",
            text    : "When they check-in to your outlet..."
        });
        slides.push({
            title   : "Custom rewards",
            image   : "../../../common/images/carousel/8_to_earn_rewards.jpg",
            text    : "...they receive rewards..."
        });
        slides.push({
            title   : "Satisfaction",
            image   : "../../../common/images/carousel/9_which_makes_them_happy.jpg",
            text    : "...which makes them happy..."
        });
        slides.push({
            title   : "Retention",
            image   : "../../../common/images/carousel/10_and_gets_you_repeats.jpg",
            text    : "...and drives more frequent footfalls to your stores..."
        });
        slides.push({
            title   : "Web console",
            image   : "../../../common/images/carousel/12_to_gain_insights.jpg",
            text    : "...which you can monitor easily from a web console..."
        });
        slides.push({
            title   : "Better Insights",
            image   : "../../../common/images/carousel/11_which_you_can_monitor.jpg",
            text    : "... and gain insights about your users..."
        });
    };
    for (i = 0; i < 4; i = i + 1) {
        $scope.addSlide();
    }
});