(function() {
  'use strict';
  angular.module('app.data.app', ['ngCsv','multi-select']).factory('dataService', [
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

        dataSvc.getUserMetric = function (query) {

            var deferred = $q.defer();

            $http({
                url: '/api/v2/analytics_summary/users/',
                method: "POST",
                data: query
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            
            return deferred.promise;
        };

        dataSvc.getCheckinMetric = function (query) {

            var deferred = $q.defer();

            $http({
                url: '/api/v2/analytics_summary/checkins/',
                method: "POST",
                data: query
            }).success(function (data) {
                deferred.resolve(data.info);
            }).error(function (data) {
                deferred.resolve(data.info);
            });
            
            return deferred.promise;
        };

        dataSvc.getRedeemMetric = function (query) {

            var deferred = $q.defer();
            $http({
                url: '/api/v2/analytics_summary/redeems/',
                method: "POST",
                data: query
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
            'programs': [],
            'outlets': []
        }
    }]).controller('DataCtrl', [
    '$scope', '$location', '$modal', 'dataService', function($scope, $location, $modal, dataService) {
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
        $scope.show_data = {
            'user': false,
            'checkin': false,
            'redeem': false
        };

        $scope.$on("$locationChangeStart", function () {
            parseRoute($location.$$path);
            getPrograms();
            getOutlets();
        });

        $scope.$watch('selected.programs', function () {
            if($scope.selected.programs && $scope.selected.programs.length > 0){
                getNumberOfWeeks($scope.selected.programs);
                getMetric(getProgramIds($scope.selected.programs), getOutletIds($scope.selected.outlets));
            }
        }, true);

        $scope.$watch('selected.outlets', function () {
            if($scope.selected.outlets) {
                getMetric(getProgramIds($scope.selected.programs), getOutletIds($scope.selected.outlets));
            }
        }, true);

        function getProgramIds(programs) {
            var ids = [];
            programs.forEach(function (p) {
                ids.push(p._id);
            })
            return ids;
        }

        function getOutletIds(outlets) {
            var ids = [];
            outlets.forEach(function (p) {
                ids.push(p._id);
            })
            return ids;
        }

        function getNumberOfWeeks (programs) {
            $scope.weeks = 0;
            programs.forEach(function (p) {
                var earn_start = new Date(p.validity.earn_start);
                var earn_end = new Date(p.validity.earn_end);
                var week = Math.round((earn_end - earn_start) / (86400000*7));
                $scope.weeks += week;
            })
        }

        // $scope.$watch('selected.program', function () {
        //     if($scope.selected.program){
        //         var earn_start = new Date($scope.selected.program.validity.earn_start);
        //         var earn_end = new Date($scope.selected.program.validity.earn_end);
        //         $scope.max = Math.round((earn_end - earn_start) / 86400000);
        //         if(earn_end < new Date()) {
        //             $scope.dynamic = $scope.max;
        //         }
        //         else {
        //             $scope.dynamic = Math.round((new Date() - earn_start) / 86400000);
        //         }
        //         $scope.percent = Math.round($scope.dynamic / $scope.max * 100);
        //         getMetric($scope.selected.program, $scope.selected.outlet);
        //     }
        // }, true);

        // $scope.$watch('selected.outlet', function () {
        //     getMetric($scope.selected.program, $scope.selected.outlet);
        // });

        function getMetric(program_ids, outlet_ids, flag) {
            var q = {
                programs: program_ids,
            };
            if(outlet_ids && outlet_ids.length > 0) {
                q.outlets = outlet_ids;
            }
            if(program_ids && program_ids.length > 0) {
                getUserMetric(q);
                getCheckinMetric(q);
                getRedeemMetric(q);
            }
        }

        function getUserMetric(q) {
            $scope.show_data.user = false;
            dataService.getUserMetric(q).then(function(data) {
                $scope.user_data = data;
                getBarChartData(data.USER_BY_CHECKIN_NUMBER_METRIC);
                $scope.show_data.user = true;
            });
        }

        function getRedeemMetric(q) {
            $scope.show_data.redeem = false;
            dataService.getRedeemMetric(q).then(function(data) {
                $scope.redeem_data = data;
                areaChartDataForRedeemsByDate(data.REDEEMS_BY_DATE);
                barChartDataForRedeemsByDayOfWeek(data.REDEEMS_BY_DAY_OF_WEEK);
                $scope.show_data.redeem = true;
            });
        }

        function getCheckinMetric(q) {
            $scope.show_data.checkin = false;
            dataService.getCheckinMetric(q).then(function(data) {
                $scope.checkin_data = data;
                areaChartDataForCheckinsByDate(data.CHECKINS_BY_DATE);
                barChartDataForCheckinsByDayOfWeek(data.CHECKINS_BY_DAY_OF_WEEK);
                donutDataForCheckinType(data.CHECKINS_BY_MODE);
                donutDataForCheckinLocation(data.CHECKINS_BY_LOCATION);
                $scope.show_data.checkin = true;
            });
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
                openUserDataModal(data);
            });
        }
        
        function getRedeemData(query) {
            dataService.getRedeemData(query).then(function(data) {
                openRedeemDataModal(data)
            });
        }

        function getCheckinData(query) {
            dataService.getCheckinData(query).then(function(data) {
                openUserDataModal(data);
            });
        }

        function openRedeemDataModal(data) {
            if(data && data.length > 0) {
                var modalInstance = $modal.open({
                    templateUrl : './views/modals/analytics_redeem_data_modal.html',
                    controller  : 'AnalyticsRedeemModalDataCtrl',
                    backdrop    : 'static',
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }
        }

        function openUserDataModal(data) {
            if(data && data.length > 0) {
                var modalInstance = $modal.open({
                    templateUrl : './views/modals/analytics_user_data_modal.html',
                    controller  : 'AnalyticsUserModalDataCtrl',
                    backdrop    : 'static',
                    resolve: {
                        data: function () {
                            return data;
                        }
                    }
                });
            }
        }

        $scope.getCrossVisitingUsers = function() {
            var query = {
                'programs': getProgramIds($scope.selected.programs),
                'data_type': 'cross'
            };
            getData('user', query);
        }

        $scope.getUsersWithGtOneCheckins = function () {
            var query = {
                'programs': getProgramIds($scope.selected.programs),
                'data_type': 'multiple'
            };
            getData('user', query);
        }

        $scope.getAllUniqueUsers = function () {
            var query = {
                'programs': getProgramIds($scope.selected.programs),
                'data_type': 'unique'
            };
            getData('user', query);
        }

        $scope.getAllUsersWithRedeems = function () {
            var query = {
                'programs': getProgramIds($scope.selected.programs),
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
                        var programs = getProgramIds($scope.selected.programs);
                        var query = {
                            'programs': programs,
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
                        var programs = getProgramIds($scope.selected.programs);
                        var query = {
                            'programs': programs,
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
                    labels: ["Check-ins"],
                    xLabels: ["day"],
                    lineWidth: "2",
                    lineColors: $scope.color.primary,
                    clickCallback: function (index, options, src) {
                        var programs = getProgramIds($scope.selected.programs);
                        var query = {
                            'programs': programs,
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
                  labels: ["Check-ins"],
                  barColors: barColor,
                  clickCallback: function (index, options, src) {
                        var programs = getProgramIds($scope.selected.programs);
                        var query = {
                            'programs': programs,
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
                initSelectedProgram(status);
                if($scope.programs && $scope.programs.length > 0) {
                    $scope.programs.forEach(function (p) {
                        if(p.status === 'active') {
                            p.icon = '<i class="fa fa-lightbulb-o icon-green"></i>';
                        } else {
                            p.icon = '<i class="fa fa-lightbulb-o icon-red"></i>';
                        }                        
                    })
                }
            })
        }

        function getOutlets() {
            dataService.getOutlets('active').then(function(data) {
                $scope.outlets = data;
                initSelectedOutlet(status);
                if($scope.outlets && $scope.outlets.length > 0) {
                    $scope.outlets.forEach(function (p) {
                        p.name = p.basics.name;
                        p.loc = '(' + p.contact.location.locality_1[0] + ' )';
                    })
                }
            })
        }

        function initSelectedOutlet(status) {
            if(status === 'ALL') {
                $scope.selected.outlets = $scope.outlets;
            }
            $scope.selected.outlets.forEach(function (p) {
                p.ticked = true;
            });
        }

        function initSelectedProgram(status) {
            if(status === 'ALL') {
                $scope.selected.programs = $scope.programs;
            }
            else {
                $scope.selected.programs = [];
                $scope.selected.programs.push($scope.programs[0]);
            }
            $scope.selected.programs.forEach(function (p) {
                p.ticked = true;
            });
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
              barColors: barColor,
              clickCallback: function (index, options, src) {
                    var programs = getProgramIds($scope.selected.programs);
                    var query = {
                        'programs': programs,
                        'checkin_count': src._id,
                        'data_type': 'checkin_number'
                    };
                    getData('user', query);
                }
            }
          };
        }
    }]).controller('AnalyticsUserModalDataCtrl', function ($scope, $modalInstance, data) {
        $scope.users = data;
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.exportToExcel = function () {
            
        };
    }).controller('AnalyticsRedeemModalDataCtrl', function ($scope, $modalInstance, data) {
        $scope.redeems = data;
        getCsvForRedeems(data);
        function getCsvForRedeems(data) {
            $scope.redeem_csv = [];
            $scope.redeems.forEach(function (r) {
                for(var i = 0; i < r.vouchers.length; i++) {
                    var obj = {
                        'phone': r.phone,
                        'voucher': r.vouchers[i],
                        'reward': r.rewards[i]
                    };
                    $scope.redeem_csv.push(obj);
                }
            });
        };
        $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
        };

        $scope.exportToExcel = function () {
            
        };
    });

}).call(this);
