(function($) {
    $.app.controller('graphRoseCtrl', ['$scope', '$routeParams', '$location', function ($scope, $routeParams, $location) {

        $scope.graphView = function(type) {
            $location.path('/graph/' + $routeParams.key + '/' + type);
        };
    }]);
})(_app || (_app = {}));