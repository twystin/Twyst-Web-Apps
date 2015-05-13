'use strict';
twystApp.factory('dealService', function ($http, $q) {

    var DealSvc = {};

    DealSvc.create = function(deal) {
        console.log('deal '+ JSON.stringify(deal))
        var defer = $q.defer();
        $http.post(
            '/api/v1/deals', deal
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    DealSvc.update = function(deal) {
        console.log(JSON.stringify(deal) + 'ooooooooo')
        var defer = $q.defer();
        $http.put(
            '/api/v1/deals', deal
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    DealSvc.read = function(deal) {

        var defer = $q.defer();
        $http.get(
            '/api/v1/deals'
        ).success(function (data) {
            defer.resolve(data);
        });
        console.log(defer.promise)
        return defer.promise;
    }

    DealSvc.readOne = function(id) {

        var defer = $q.defer();
        $http.get(
            '/api/v1/deals/'+ id
        ).success(function (data) {
            defer.resolve(data);
        });
        return defer.promise;
    }

    return DealSvc;
}).
controller('DealCtrl', function ($http, outletService, authService, OPERATE_HOURS, $scope, $location, $routeParams, dealService) {
    $scope.deal = {
        outlets: []
    };
    
    $scope.avail_hours = OPERATE_HOURS;
    $scope.validationArray = [true, true, true, true, true, true, true, true];
    $scope.week = ['monday' ,'tuesday' ,'wednesday' ,'thursday' ,'friday', 'saturday', 'sunday'];
    
    $scope.create = function () {
        $scope.deal.avaiable_at = {};

        $scope.deal.avaiable_at = {
          1: {
            s: {
                h: $scope.avail_hours.monday.timings[0].open.hr,
                m: $scope.avail_hours.monday.timings[0].open.min
            },
            e: {
                h: $scope.avail_hours.monday.timings[0].close.hr,
                m: $scope.avail_hours.monday.timings[0].close.min
            },
            closed: $scope.avail_hours.monday.closed
          },
          2: {
            s: {
                h: $scope.avail_hours.tuesday.timings[0].open.hr,
                m: $scope.avail_hours.tuesday.timings[0].open.min
            },
            e: {
                h: $scope.avail_hours.tuesday.timings[0].close.hr,
                m: $scope.avail_hours.tuesday.timings[0].close.min
            },
            closed: $scope.avail_hours.tuesday.closed
          },
          3: {
            s: {
                h: $scope.avail_hours.wednesday.timings[0].open.hr,
                m: $scope.avail_hours.wednesday.timings[0].open.min
            },
            e: {
                h: $scope.avail_hours.wednesday.timings[0].close.hr,
                m: $scope.avail_hours.wednesday.timings[0].close.min
            },
            closed: $scope.avail_hours.wednesday.closed
          },
          4: {
            s: {
                h: $scope.avail_hours.thursday.timings[0].open.hr,
                m: $scope.avail_hours.thursday.timings[0].open.min
            },
            e: {
                h: $scope.avail_hours.thursday.timings[0].close.hr,
                m: $scope.avail_hours.thursday.timings[0].close.min
            },
            closed: $scope.avail_hours.thursday.closed
          },
          5: {
            s: {
                h: $scope.avail_hours.friday.timings[0].open.hr,
                m: $scope.avail_hours.friday.timings[0].open.min
            },
            e: {
                h: $scope.avail_hours.friday.timings[0].close.hr,
                m: $scope.avail_hours.friday.timings[0].close.min
            },
            closed: $scope.avail_hours.friday.closed
          },
          6: {
            s: {
                h: $scope.avail_hours.saturday.timings[0].open.hr,
                m: $scope.avail_hours.saturday.timings[0].open.min
            },
            e: {
                h: $scope.avail_hours.saturday.timings[0].close.hr,
                m: $scope.avail_hours.saturday.timings[0].close.min
            },
            closed: $scope.avail_hours.saturday.closed
          },
          7: {
            s: {
                h: $scope.avail_hours.sunday.timings[0].open.hr,
                m: $scope.avail_hours.sunday.timings[0].open.min
            },
            e: {
                h: $scope.avail_hours.sunday.timings[0].close.hr,
                m: $scope.avail_hours.sunday.timings[0].close.min
            },
            closed: $scope.avail_hours.sunday.closed
          }
        } 
        dealService.create($scope.deal).then(function(data) {
            if(data.status = "success"){
                $location.path("/deal");
            }
        })   
    };

    $scope.update = function () {
        
        $scope.deal.avaiable_at = $scope.avail_hours;
        console.log(JSON.stringify($scope.deal) + "xdvidfj")
        dealService.update($scope.deal).then(function(data) {
            if(data.status = "success"){
                $location.path("/deal");
            }
        })   
    };

    $scope.read = function () {
        dealService.read().then(function(data) {
            console.log(JSON.stringify(data) + 'okokokok')
            $scope.deals = data;
        });
    };

    $scope.readOne = function () {
        var id = $routeParams.deal_id;
        dealService.readOne(id).then(function(data) {
            setdealForUpdate(data);
        });  
    };

    function setdealForUpdate(data) {
        $scope.deal = data;
        $scope.avail_hours = $scope.deal.avaiable_at;
        $scope.deal.outlets = $scope.deal.outlets.map(function (o) {
            return o._id;
        });
        
    }

    $scope.timingsValidation = function () {
        var flag = 0;
        for (var i = 0; i < 7; i++){
            flag = 0;
            if ($scope.avail_hours[$scope.week[i]].closed == false && 
                $scope.avail_hours[$scope.week[i]].timings.length > 1){
                for (var j = 0; j < $scope.avail_hours[$scope.week[i]].timings.length-1; j++){
                    for (var k = j + 1 ; k < $scope.avail_hours[$scope.week[i]].timings.length; k++){
                        if ((sendTime(1, i, j) < sendTime(0, i, k)) && (sendTime(0, i, j) > sendTime(1, i, k))){
                            
                            flag=1;
                        }
                    }
                }
            }
        if (flag==1){
            $scope.validationArray[i] = false;
        }
        else{
            $scope.validationArray[i] = true;
        }
        }

    }

    function sendTime(i, w, t){
        //1 for open
        if (i==1){
            return ($scope.avail_hours[$scope.week[w]].timings[t].open.hr * 60 *1 +
            $scope.avail_hours[$scope.week[w]].timings[t].open.min * 1);
        }
        //0 for close
        else if (i==0){
            return ($scope.avail_hours[$scope.week[w]].timings[t].close.hr * 60 *1 +
            $scope.avail_hours[$scope.week[w]].timings[t].close.min * 1);
        }
    }

    $scope.applyToAllDays = function(time) {
        for(var i = 0; i < $scope.week.length; i++) {
            $scope.avail_hours[$scope.week[i]].closed = time.closed;
            var timings = [];
            for(var j = 0; j < time.timings.length; j++) {
                var t = {
                    open: {
                        hr: time.timings[j].open.hr,
                        min: time.timings[j].open.min
                    },
                    close: {
                        hr: time.timings[j].close.hr,
                        min: time.timings[j].close.min
                    }
                };
                timings.push(t);
            }
            $scope.avail_hours[$scope.week[i]].timings = timings;
        }
    }

    $scope.toggleOutlets = function (fruit) {
        if ($scope.program.outlets.indexOf(fruit) === -1) {
            $scope.program.outlets.push(fruit);
        } else {
            $scope.program.outlets.splice($scope.program.outlets.indexOf(fruit), 1);
        }

    };

    $scope.outletQuery = function() {
        outletService.query().then(function (data) {
            $scope.outlets = data.info;
            $scope.all_outlets = data.info;
        }, function (err) {
            console.log(err);
        })
    };

    $scope.outlet_for = {};
    $scope.$watch('outlet_for._timings', function () {
        if(!$scope.outlet_for._timings || $scope.outlet_for._timings === "NONE") {
            $scope.avail_hours = OPERATE_HOURS;
        }
        else {
            $scope.avail_hours = $scope.outlet_for._timings.business_hours;
        }
    }, true);

    $scope.toggleOutlets = function (fruit) {
        if ($scope.deal.outlets.indexOf(fruit) === -1) {
            $scope.deal.outlets.push(fruit);
        } else {
            $scope.deal.outlets.splice($scope.deal.outlets.indexOf(fruit), 1);
        }

    };


});