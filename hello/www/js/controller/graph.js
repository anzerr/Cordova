(function($) {
    $.app.controller('graphCtrl', ['$scope', '$routeParams', function ($scope, $routeParams) {
        var data = $.storage.data[$routeParams.key] || [];

        $scope.type = '';
        $scope.typeList = [];

        for (var i in data[0]) {
            $scope.typeList.push({value: i, displayName: i});
        }

        $scope.updateGraph = function() {
            console.log($scope.type);

            var out = [];
            for (var i in data) {
                out.push(data[i][$scope.type]);
            }
            updateGraph([{
                name: $scope.type,
                data: out
            }]);
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
                        for (var i = 0; i < 24; i++) {
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