'use strict';

twystApp.filter('capitalize', function () {
    return function (input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
});

twystApp.filter('atos', function () {
    return function (input) {
        if (input === undefined) { return false; }
        var rval = "";
        for (var i = 0; i < input.length - 1; i++) {
            rval += input[i] + ', ';
        }
        rval += input[input.length - 1];
        return rval;
    };
});