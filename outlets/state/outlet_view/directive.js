outletApp.directive('wrapOwlcarousel', function () {
  return {
    restrict: 'E',
    link: function (scope, element) {
      var options = scope.$eval($(element).attr('data-options'));
      $(element).owlCarousel(options);
    }
  };
});
outletApp.directive('fancybox', function ($compile) {
  return {
    restrict: 'A',
    replace: false,
    link: function ($scope, element) {

      $scope.open_fancybox = function () {

        var el = angular.element(element.html()),

          compiled = $compile(el);
        $.fancybox.open(el);

        compiled($scope);

      };
    }
  };
});
outletApp.directive('backgroundImage', function () {
  return function (scope, element, attrs) {
    attrs.$observe('backgroundImage', function (value) {
      if (value) {
        var url = 'http://s3-us-west-2.amazonaws.com/twystmerchantpages/merchants/' + value + '/Background.png';
        element.css({'background': "url('" + url + "')"});
      }
    });
  };
});
outletApp.directive('slickSlider', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $timeout(function () {
        var options = scope.$eval(attrs.slickSlider);
        $(element).slick({
          infinite: true,
          slidesToShow: 7,
          slidesToScroll: 2,
          lazyLoad: 'ondemand',
          rtl: true,
          autoplay: true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 7,
                slidesToScroll: 7,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 700,
              settings: {
                slidesToShow: 5,
                slidesToScroll: 5
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4,
                dots: false
              }
            },
            {
              breakpoint: 539,
              settings: {
                slidesToShow: 4,
                slidesToScroll: 4
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                dots: false
              }
            }
          ]
        });
      });
    }
  };
});
outletApp.directive('sliderSlick', function ($timeout) {
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      $timeout(function () {
        var options = scope.$eval(attrs.sliderSlick);
        $(element).slick({
          infinite: true,
          slidesToShow: 3,
          slidesToScroll: 2,
          rtl: true,
          lazyLoad: 'ondemand',
          autoplay: false,
          accessibility: true,
          arrows: true,
          focusOnSelect: true,
          responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 990,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 670,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 1,
                dots: true
              }
            },
            {
              breakpoint: 480,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                centerMode: true,
                centerPadding: '60px',
                dots: true
              }

          },
          {
            breakpoint: 330,
            settings: {
              slidesToShow: 1,
              slidesToScroll: 1,
              dots: true,
              centerMode: true,
              centerPadding: '20px'
            }
          }
  ]
         });
     });
   }
 }
}); 
outletApp.directive('sliderSingle',function ($timeout){
 return {
   restrict: 'A',
   link: function (scope,element,attrs) {
     $timeout(function () {
        var options = scope.$eval(attrs.sliderSlick);
         $(element).slick({
          infinite: false,
          slidesToShow: 1,
          lazyLoad: 'ondemand',
          rtl: true,
          autoplay: false, 
          arrows: true,
          dots: true
         });
     });
   }
 }
}); 