(function($) {
    $.app.controller('graphFullCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {
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
            updateGraph(data[$scope.type].avg);
        };

        var updateGraph = function(data) {
            jQuery('#container').highcharts({
                chart: {
                    zoomType: 'x'
                },
                title: {
                    text: 'Full day ' + $scope.type
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
                        text: $scope.type
                    }
                },
                legend: {
                    enabled: false
                },
                plotOptions: {
                    area: {
                        fillColor: {
                            linearGradient: {
                                x1: 0,
                                y1: 0,
                                x2: 0,
                                y2: 1
                            },
                            stops: [
                                [0, Highcharts.getOptions().colors[0]],
                                [1, Highcharts.Color(Highcharts.getOptions().colors[0]).setOpacity(0).get('rgba')]
                            ]
                        },
                        marker: {
                            radius: 2
                        },
                        lineWidth: 1,
                        states: {
                            hover: {
                                lineWidth: 1
                            }
                        },
                        threshold: null
                    }
                },

                series: [{
                    type: 'area',
                    name: 'USD to EUR',
                    data: data
                }]
            });
        };
    }]);
})(_app || (_app = {}));