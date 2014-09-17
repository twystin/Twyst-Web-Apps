(function() {
  'use strict';
  angular.module('app.data.app', []).factory('dataService', [
    '$http', '$rootScope', '$q', function($http, $rootScope, $q) {
        var dataSvc = {};
        
        dataSvc.getPrograms = function (status) {

            var deferred = $q.defer();
            status = status || '';
            $http({
                url: '/api/v2/programs?status=' + status,
                method: "GET",
                data: ''
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            
            return deferred.promise;
        };

        dataSvc.getOutlets = function (status) {

            var deferred = $q.defer();
            status = status || '';
            $http({
                url: '/api/v2/outlets?status=' + status,
                method: "GET",
                data: ''
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            
            return deferred.promise;
        };

        dataSvc.getUserMetric = function (program, outlet) {

            var deferred = $q.defer();

            $http({
                url: '/api/v2/analytics_summary/users/' + program + '/' + outlet,
                method: "GET",
                data: ''
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            
            return deferred.promise;
        };

        dataSvc.getCheckinMetric = function (program, outlet) {

            var deferred = $q.defer();

            $http({
                url: '/api/v2/analytics_summary/checkins/' + program + '/' + outlet,
                method: "GET",
                data: ''
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            
            return deferred.promise;
        };

        dataSvc.getRedeemMetric = function (program, outlet) {

            var deferred = $q.defer();
            $http({
                url: '/api/v2/analytics_summary/redeems/' + program + '/' + outlet,
                method: "GET",
                data: ''
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            
            return deferred.promise;
        };

        dataSvc.getUserData = function (query) {
            var deferred = $q.defer();
            $http({
                url: '/api/v2/analytics_data/users/',
                method: "POST",
                data: query
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            return deferred.promise;
        }

        dataSvc.getCheckinData = function (query) {
            var deferred = $q.defer();
            $http({
                url: '/api/v2/analytics_data/checkins/',
                method: "POST",
                data: query
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            return deferred.promise;
        }

        dataSvc.getRedeemData = function (query) {
            var deferred = $q.defer();
            $http({
                url: '/api/v2/analytics_data/redeems/',
                method: "POST",
                data: query
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            return deferred.promise;
        }
        
        return dataSvc;
    }
  ]).controller('StatusCtrl', [
    '$scope', '$location', 'dataService', function($scope, $location, dataService) {
        $scope.selected = {
            program: null,
            outlet: null
        }
    }]).controller('DataCtrl', [
    '$scope', '$location', 'dataService', function($scope, $location, dataService) {
        
        $scope.Math = window.Math;
        var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        var all_status = {
            'all_time': 'ALL',
            'previous_programs': 'archived',
            'current_programs': 'active'
        };
        var status;
        $scope.programs = [];
        $scope.outlets = [];
        $scope.type = "success";
        $scope.max = 100;

        $scope.$on("$locationChangeStart", function () {
            parseRoute($location.$$path);
            getPrograms();
            getOutlets();
        });

        $scope.$watch('selected.program', function () {
            if($scope.selected.program){
                var earn_start = new Date($scope.selected.program.validity.earn_start);
                var earn_end = new Date($scope.selected.program.validity.earn_end);
                $scope.max = Math.round((earn_end - earn_start) / 86400000);
                if(earn_end < new Date()) {
                    $scope.dynamic = $scope.max;
                }
                else {
                    $scope.dynamic = Math.round((new Date() - earn_start) / 86400000);
                }
                $scope.percent = Math.round($scope.dynamic / $scope.max * 100);
                getMetric($scope.selected.program, $scope.selected.outlet);
            }
        }, true);

        $scope.$watch('selected.outlet', function () {
            getMetric($scope.selected.program, $scope.selected.outlet);
        });

        function getMetric(program, outlet, flag) {
            getCheckinMetric(program, outlet);
            getUserMetric(program, outlet);
            getRedeemMetric(program, outlet);
        }

        function getUserMetric(program, outlet) {
            if(program) {
                $scope.user_data = null;
                var program_id = program._id;
                var outlet_id = outlet ? outlet._id : 'ALL';
                dataService.getUserMetric(program_id, outlet_id).then(function(data) {
                    $scope.user_data = data;
                    getBarChartData(data.USER_BY_CHECKIN_NUMBER_METRIC);
                });
            }
        }

        function getRedeemMetric(program, outlet) {
            if(program) {
                $scope.redeem_data = null;
                var program_id = program._id;
                var outlet_id = outlet ? outlet._id : 'ALL';
                dataService.getRedeemMetric(program_id, outlet_id).then(function(data) {
                    $scope.redeem_data = data;
                    areaChartDataForRedeemsByDate(data.REDEEMS_BY_DATE);
                    barChartDataForRedeemsByDayOfWeek(data.REDEEMS_BY_DAY_OF_WEEK);
                });
            }
        }

        function getCheckinMetric(program, outlet) {
            if(program) {
                $scope.checkin_data = null;
                var program_id = program._id;
                var outlet_id = outlet ? outlet._id : 'ALL';
                dataService.getCheckinMetric(program_id, outlet_id).then(function(data) {
                    $scope.checkin_data = data;
                    areaChartDataForCheckinsByDate(data.CHECKINS_BY_DATE);
                    barChartDataForCheckinsByDayOfWeek(data.CHECKINS_BY_DAY_OF_WEEK);
                    donutDataForCheckinType(data.CHECKINS_BY_MODE);
                    donutDataForCheckinLocation(data.CHECKINS_BY_LOCATION);
                });
            }
        }

        function getData (data_type, query) {
            var functions = {
                'checkin': getCheckinData,
                'redeem': getRedeemData,
                'user': getUserData
            };

            functions[data_type](query);
        }

        function getUserData(query) {
            dataService.getUserData(query).then(function(data) {
                console.log(data)
            });
        }
        
        function getRedeemData(query) {
            dataService.getRedeemData(query).then(function(data) {
                console.log(data)
            });
        }

        function getCheckinData(query) {
            dataService.getCheckinData(query).then(function(data) {
                console.log(data)
            });
        }

        $scope.getCrossVisitingUsers = function() {
            var query = {
                'programs': ['537b648fc1844b7c5400000f'],
                'data_type': 'cross'
            };
            getData('user', query);
        }

        $scope.getUsersWithGtOneCheckins = function () {
            var query = {
                'programs': ['537b648fc1844b7c5400000f'],
                'data_type': 'multiple'
            };
            getData('user', query);
        }

        $scope.getAllUniqueUsers = function () {
            var query = {
                'programs': ['537b648fc1844b7c5400000f'],
                'data_type': 'unique'
            };
            getData('user', query);
        }

        $scope.getAllUsersWithRedeems = function () {
            var query = {
                'programs': ['537b648fc1844b7c5400000f'],
                'data_type': 'total'
            };
            getData('redeem', query);
        };

        function areaChartDataForRedeemsByDate (data) {
            $scope.redeem_trend = {
                data: data,
                type: "area",
                options: {
                    xkey: "actual_date",
                    ykeys: ["count"],
                    labels: ["Redeems"],
                    xLabels: ["day"],
                    lineWidth: "2",
                    lineColors: $scope.color.primary,
                    clickCallback: function (index, options, src) {
                        var query = {
                            'programs': ['537b648fc1844b7c5400000f'],
                            'date': new Date(src.actual_date).getTime(),
                            'data_type': 'date'
                        };
                        getData('redeem', query);
                    }
                }
            };
        }

        function barChartDataForRedeemsByDayOfWeek(data) {
            var barColor = [$scope.color.infoAlt];
            data.forEach(function(d) {
                d._id = days[d._id-1];
            })
            $scope.redeems_by_day_of_week = {
                data: data,
                type: "bar",
                options: {
                  xkey: "_id",
                  ykeys: ["count"],
                  labels: ["Redeems"],
                  barColors: barColor,
                  clickCallback: function (index, options, src) {
                        var query = {
                            'programs': ['537b648fc1844b7c5400000f'],
                            'day': days.indexOf(src._id) + 1,
                            'data_type': 'week'
                        };
                        getData('redeem', query);
                    }
                }
            };
        }

        function areaChartDataForCheckinsByDate (data) {
            $scope.checkin_trend = {
                data: data,
                type: "area",
                options: {
                    xkey: "actual_date",
                    ykeys: ["count"],
                    labels: ["Checkins"],
                    xLabels: ["day"],
                    lineWidth: "2",
                    lineColors: $scope.color.primary,
                    clickCallback: function (index, options, src) {
                        var query = {
                            'programs': ['537b648fc1844b7c5400000f'],
                            'date': new Date(src.actual_date).getTime(),
                            'data_type': 'date'
                        };
                        getData('checkin', query);
                    }
                }
            };
        }

        function barChartDataForCheckinsByDayOfWeek(data) {
            var days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
            var barColor = [$scope.color.infoAlt];
            data.forEach(function(d) {
                d._id = days[d._id-1];
            })
            $scope.checkin_by_day_of_week = {
                data: data,
                type: "bar",
                options: {
                  xkey: "_id",
                  ykeys: ["count"],
                  labels: ["Checkins"],
                  barColors: barColor,
                  clickCallback: function (index, options, src) {
                        var query = {
                            'programs': ['537b648fc1844b7c5400000f'],
                            'day': days.indexOf(src._id) + 1,
                            'data_type': 'week'
                        };
                        getData('checkin', query);
                    }
                }
            };
        }

        var donutColor = [$scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger];
        function donutDataForCheckinType(data) {
            data.forEach(function (d) {
                d.label = d._id;
                d.data = d.count;
            });
            $scope.checkin_by_type = {};
              $scope.checkin_by_type.data = data;
              $scope.checkin_by_type.options = {
                series: {
                  pie: {
                    show: true,
                    innerRadius: 0.5
                  }
                },
                legend: {
                  show: true
                },
                grid: {
                  hoverable: true,
                  clickable: true
                },
                colors: [$scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger],
                tooltip: true,
                tooltipOpts: {
                  content: "%p.0%, %s",
                  defaultTheme: false
                }
              };
        }

        function donutDataForCheckinLocation(data) {
            data.forEach(function (d) {
                d.label = d._id;
                d.data = d.count;
            });
            $scope.checkin_by_location = {};
              $scope.checkin_by_location.data = data;
              $scope.checkin_by_location.options = {
                series: {
                  pie: {
                    show: true,
                    innerRadius: 0.5
                  }
                },
                legend: {
                  show: true
                },
                grid: {
                  hoverable: true,
                  clickable: true
                },
                colors: [$scope.color.success, $scope.color.info, $scope.color.warning, $scope.color.danger],
                tooltip: true,
                tooltipOpts: {
                  content: "%p.0%, %s",
                  defaultTheme: false
                }
              };
        }

        function parseRoute(complete_path) {
            var splitted_path = complete_path.split('/');
            status = all_status[splitted_path[1]];
        }

        function getPrograms() {
            dataService.getPrograms(status).then(function(data) {
                $scope.programs = data;
            })
        }

        function getOutlets() {
            dataService.getOutlets('active').then(function(data) {
                $scope.outlets = data;
            })
        }
        
        function getBarChartData(data) {
            var barData = data;
          var barColor = [$scope.color.infoAlt];
          $scope.bar1 = {
            data: barData,
            type: "bar",
            options: {
              xkey: "_id",
              ykeys: ["num"],
              labels: ["Users"],
              barColors: barColor
            }
          };
        }
    }]);

}).call(this);
