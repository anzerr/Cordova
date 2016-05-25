"use strict";

var _app;
(function($) {
	var obj = function() {};
	obj.prototype = {
		_type: {
			int: true,
			float: true,
			string: true,
			object: true,
			bool: true,
			array: true,
			time: true,
			func: true,
			function: true
		},
		type: function(k) {
			return ($.defined(this._type[k]) && this._type[k]);
		},
		
		int: function(a) {
			return (!isNaN(a) && Number(a) == a);
		},
		float: function(a) {
			return (this.int(a)); // does not check if it's a float or int
		},
		string: function(a) {
			return (typeof(a) === 'string');
		},
		object: function(a) {
			return (typeof(a) === 'object' && a != null);
		},
		bool: function(a) {
			return (typeof(a) === 'boolean');
		},
		array: function(a) {
			return (typeof(a) === 'object' && Array.isArray(a));
		},
		time: function(a) {
			return (this.string(a) || this.int(a));
		},
		func: function(a) {
			return (typeof(a) === 'function');
		},
		function: function(a) {
			return (this.func(a));
		},
	};

	$.is = new obj();
})(_app || (_app = {}));