/*! angular-slick  v0.1.9 */
"use strict";
angular.module("slick", []).directive("slick", ["$timeout", function(a) {
    return {
        restrict: "AEC",
        scope: {
            initOnload: "@",
            data: "=",
            currentIndex: "=",
            accessibility: "@",
            arrows: "@",
            autoplay: "@",
            autoplaySpeed: "@",
            centerMode: "@",
            centerPadding: "@",
            cssEase: "@",
            dots: "@",
            draggable: "@",
            easing: "@",
            fade: "@",
            infinite: "@",
            lazyLoad: "@",
            onBeforeChange: "@",
            onAfterChange: "@",
            onInit: "@",
            onReInit: "@",
            pauseOnHover: "@",
            responsive: "&",
            slide: "@",
            slidesToShow: "@",
            slidesToScroll: "@",
            speed: "@",
            swipe: "@",
            touchMove: "@",
            touchThreshold: "@",
            vertical: "@"
        },
        link: function(b, c) {
            var d, e;
            return d = function() {
                return a(function() {
                    var a, d;
                    return d = $(c), null != b.currentIndex && (a = b.currentIndex), d.slick({
                        accessibility: "false" !== b.accessibility,
                        arrows: "false" !== b.arrows,
                        autoplay: "true" === b.autoplay,
                        autoplaySpeed: null != b.autoplaySpeed ? parseInt(b.autoplaySpeed, 10) : 3e3,
                        centerMode: "true" === b.centerMode,
                        centerPadding: b.centerPadding || "50px",
                        cssEase: b.cssEase || "ease",
                        dots: "true" === b.dots,
                        draggable: "false" !== b.draggable,
                        easing: b.easing || "linear",
                        fade: "true" === b.fade,
                        infinite: "false" !== b.infinite,
                        lazyLoad: b.lazyLoad || "ondemand",
                        onBeforeChange: b.onBeforeChange || null,
                        onAfterChange: function(c, d) {
                            return b.onAfterChange && b.onAfterChange(), null != a ? b.$apply(function() {
                                return a = d, b.currentIndex = d
                            }) : void 0
                        },
                        onInit: function(c) {
                            return b.onInit && b.onInit(), null != a ? c.slideHandler(a) : void 0
                        },
                        onReInit: b.onReInit || null,
                        pauseOnHover: "false" !== b.pauseOnHover,
                        responsive: b.responsive() || null,
                        slide: b.slide || "div",
                        slidesToShow: null != b.slidesToShow ? parseInt(b.slidesToShow, 10) : 1,
                        slidesToScroll: null != b.slidesToScroll ? parseInt(b.slidesToScroll, 10) : 1,
                        speed: null != b.speed ? parseInt(b.speed, 10) : 300,
                        swipe: "false" !== b.swipe,
                        touchMove: "false" !== b.touchMove,
                        touchThreshold: b.touchThreshold ? parseInt(b.touchThreshold, 10) : 5,
                        vertical: "true" === b.vertical
                    }), b.$watch("currentIndex", function(b) {
                        return null != a && null != b && b !== a ? d.slickGoTo(b) : void 0
                    })
                })
            }, b.initOnload ? (e = !1, b.$watch("data", function(a) {
                return null == a || e ? void 0 : (d(), e = !0)
            })) : d()
        }
    }
}]);