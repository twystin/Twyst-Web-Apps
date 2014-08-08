 angular.module('d3onut',['d3'])
    .directive('donutChart', ['d3service', function (d3service) {
        return {
            restrict: 'EA',
            scope: {data: '='},
            link: function (scope, element, attr) {
                d3service.d3().then(function(d3){
                 var data = scope.data;
                var el = element[0];
                var width = 100;
                height = width;

                var chart = d3.select(el)
                    .append('svg')
                    .attr("width", width)
                    .attr("height", height)
                    .append("g")
                    .attr("transform", "translate(" + (width / 2) + "," + (height / 2) + ")");


                var radius = Math.min(width, height) / 2;

                var color = d3.scale.ordinal()
                    .range(["#3399FF", "#e1e1e1", "#b6b6b6"]);

                var arc = d3.svg.arc()
                    .outerRadius(radius / 2)
                    .innerRadius(radius - 15);

                var pie = d3.layout.pie()
                    .sort(null)
                    .startAngle(1.1 * Math.PI)
                    .endAngle(3.1 * Math.PI)
                    .value(function (d) {
                    return d.value;
                });


                var g = chart.selectAll(".arc")
                    .data(pie(data))
                    .enter().append("g")
                    .attr("class", "arc");

                g.append("path")
                    .attr("fill", function (d, i) {
                    return color(i);
                })
                    .transition()
                    .ease("exp")
                    .duration(2000)
                    .attrTween("d", tweenPie);

                function tweenPie(b) {
                    var i = d3.interpolate({
                        startAngle: 1.1 * Math.PI,
                        endAngle: 1.1 * Math.PI
                    }, b);
                    return function (t) {
                        return arc(i(t));
                    };
}

                        } );
            }
        }
    }])