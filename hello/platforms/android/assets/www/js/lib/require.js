"use strict";

var _app;
(function($) {

    var load = function(path) {
        var p = new $.promise();
        var script = document.createElement('script');
        script.src = path;
        script.onload = function () {
            p.resolve();
        };
        document.head.appendChild(script);

        return (p);
    };

	$.require = function(a) {
        var wait = [], path = ($.is.array(a)) ? a : [a];
        for (var i in path) {
            wait.push(load(path[i]));
        }
        return ($.all(wait));
    };
})(_app || (_app = {}));