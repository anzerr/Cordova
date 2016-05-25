"use strict";

var _app;
(function($) {
	document.addEventListener('deviceready', function() {
        $.require([
            'js/angular-1.5.5/angular-route.js',
            'js/chart/js/highcharts.js',
        ]).then(function() {
            $.app = angular.module('app', [
                'ngRoute'
            ]);

            return ($.require([
                'js/chart/js/highcharts-more.js',
                'js/chart/js/modules/data.js',
                'js/chart/js/modules/exporting.js',

                'js/controller/main.js',
                'js/controller/upload.js',
                'js/controller/graph/graph.js',
                'js/controller/graph/graphFull.js',
                'js/controller/graph/graphRose.js'
            ]));
        }).then(function() {
            $.app.config(['$routeProvider', function($routeProvider) {
                console.log('here');
                $routeProvider.when('/', {
                    templateUrl: 'js/view/main.html',
                    controller: 'mainCtrl'
                }).when('/upload', {
                    templateUrl: 'js/view/upload.html',
                    controller: 'uploadCtrl'
                }).when('/graph/:key/simple', {
                    templateUrl: 'js/view/graph.html',
                    controller: 'graphCtrl'
                }).when('/graph/:key/full', {
                    templateUrl: 'js/view/graph.html',
                    controller: 'graphFullCtrl'
                }).when('/graph/:key/rose', {
                    templateUrl: 'js/view/graphRose.html',
                    controller: 'graphRoseCtrl'
                }).otherwise({
                    redirectTo: '/'
                });
            }]);

            $.storage = {
                file: {},
                data: {}
            };

            angular.bootstrap(document, ['app']);
            jQuery('#logo').css({top:'50px', left:'50px'});
            setTimeout(function() {
                jQuery('#loadBlock').css({opacity:0, 'pointer-events':'none'});
                jQuery('#menu').css({left:'-50px'});
                jQuery('#pulse').remove();
            }, 1000);
        });
	}, false);
})(_app || (_app = {}));