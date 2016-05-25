(function($) {
    $.app.controller('graphCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
        var data = $.storage.data[$routeParams.key] || [];

        $scope.type = '';
        $scope.typeList = [];

        for (var i in data) {
            $scope.typeList.push({value: i, displayName: i});
        }

        $scope.graphView = function(type) {
            $location.path('/graph/' + $routeParams.key + '/' + type);
        };

        $scope.updateGraph = function() {
            updateGraph([
                {
                    name: 'avg',
                    data: data[$scope.type].avg
                },
                {
                    name: 'max',
                    data:data[$scope.type]. max
                },
                {
                    name: 'min',
                    data: data[$scope.type].min
                }
            ]);
        };

        var updateGraph = function(data) {
            jQuery('#container').highcharts({
                title: {
                    text: 'Daily Average ' + $scope.type,
                    x: -20 //center
                },
                xAxis: {
                    categories: (function() {
                        var out = [];
                        for (var i = 0; i <= 24; i++) {
                            out.push(i + ':00');
                        }
                        return (out);
                    })()
                },
                yAxis: {
                    title: {
                        text: 'Temperature (°C)'
                    },
                    plotLines: [{
                        value: 0,
                        width: 1,
                        color: '#808080'
                    }]
                },
                tooltip: {
                    valueSuffix: '°C'
                },
                legend: {
                    layout: 'vertical',
                    align: 'right',
                    verticalAlign: 'middle',
                    borderWidth: 0
                },
                series: data
            });
        };
    }]);
})(_app || (_app = {}));