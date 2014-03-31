'use strict';

twystClient.filter("mySearch", function(){
    return function(input, searchText) {
        var returnArray = [];
        if (!input) { return []; }
        var searchTextSplit = String(searchText).toLowerCase().split(' ');
        for(var x = 0; x < input.length; x++){
            var count = 0;
            for(var y = 0; y < searchTextSplit.length; y++){
                if((JSON.stringify(input[x])).toLowerCase().indexOf(searchTextSplit[y]) !== -1){
                    count++;
                }
            }
            if(count == searchTextSplit.length){
                returnArray.push(input[x]);
            }
        }
        return returnArray;
    }
});

twystClient.filter('capitalize', function () {
    return function (input) {
        return input.charAt(0).toUpperCase() + input.slice(1);
    };
});

twystClient.filter('shorttext', function () {
    return function (input, param) {
        var spaces = "", i = 0;

        if (input.length < param) {
            for (i = 0; i < param - input.length; i = i + 1) {
                spaces += " ";
            }
            return input + spaces;
        } else {
            return input.slice(0, param - 3) + '...';
        }
    };
});

twystClient.filter('dist', function () {
    return function (input) {
        if (!input) return '';
        if (Number(input) > 9.9) {
            return '>10'
        } else {
            var i = Math.floor(Number(input));
            var r = Number(input) - i;
            if (r === 0) {
                return String(i) + '.0';
            } else {
                return String(i) + String(r).splice(0,1);
            }
        }
    };
});

twystClient.filter('name', function () {
    return function (input) {
        var firstName = (input.split('.'))[0];
        return firstName.charAt(0).toUpperCase() + firstName.slice(1);
    };
});

twystClient.filter('oneforty', function () {
    return function (input) {
        if (!input) {
            return '';
        } else if (input.length < 137) {
            return input;
        } else {
            return input.splice(0, 137) + '...';
        }
    };
});


twystClient.filter('atos', function () {
    return function (input) {
        if (!input) { return "First, Second"; }
        var rval = "";
        for (var i = 0; i < 2; i++) {
            if (!input[i]) {
                rval += 'Test' + ', ';
            } else {
                rval += input[i] + ', ';
            }

        }
        //rval += input[input.length - 1];
        return rval;
    };
});