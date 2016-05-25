(function($) {
    $.app.directive('fileread', [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function(scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = {
                                name: changeEvent.target.files[0].name,
                                data: loadEvent.target.result
                            };
                        });
                    };
                    reader.readAsText/*readAsDataURL*/(changeEvent.target.files[0]);
                });
            }
        }
    }]);

    function genKey(l) {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < l; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }

    var parse = function(data) {
        var tmp = data.split('\n');
        for (var i in tmp) {
            tmp[i] = tmp[i].split(/[\t]/g);
        }
        this._raw = tmp;
    };
    parse.prototype = {
        _farmGraph: function(progress, done) {
            var self = this, key = [];
            for (var i in self._flat[0]) {
                if (typeof(self._flat[0][i]) != 'string') {
                    key.push(i);
                }
            }

            var out = {}, max = 10, part = function(i) {
                console.log(i, key.length);
                if (i < key.length) {
                    for (var x = i; x < Math.min(key.length, i + max); x++) {
                        out[key[x]] = self.format(self._flat, key[x]);
                    }
                    console.log(i, key.length);
                    setTimeout(function () {
                        progress(i, key.length);
                        part(Math.min(key.length, i + max))
                    }, 100);
                } else {
                    self._graph = out;
                    done(out);
                }
            };
            part(0);
            return (this);
        },
        farm: function(progress, done) {
            console.log(this._raw);
            var max = 100, out = [], self = this, part = function(xi) {
                for (var i = xi; i < Math.min(self._raw.length, xi + max); i++) {
                    var elem = {};
                    for (var x in self._raw[1]) {
                        var cast = Number(self._raw[i][x]);
                        elem[self._raw[1][x]] = (self._raw[i][x] != ' ')? ((!isNaN(cast)) ? cast : self._raw[i][x]) : 0;
                    }
                    out.push(elem);
                }

                if (i < self._raw.length) {
                    setTimeout(function () {
                        progress(i, self._raw.length);

                        part(Math.min(self._raw.length, i + max))
                    }, 100);
                } else {
                    self._flat = out;
                    console.log(out);
                    self._farmGraph(progress, done);
                }
            };
            part(2);
            return (this);
        },
        format: function(data, type) {
            var out = {}, count = {}, max = {}, min = {};
            for (var i in data) {
                if (typeof(data[i].CREATEDATE) == 'string') {
                    var tim = parseInt(data[i].CREATEDATE.split(' ')[1]);
                    out[tim] = (out[tim] || 0) + data[i][type];
                    count[tim] = (count[tim] || 0) + 1;

                    if (!max[tim]) {
                        max[tim] = data[i][type];
                    } else {
                        max[tim] = Math.max(max[tim], data[i][type]);
                    }

                    if (!min[tim]) {
                        min[tim] = data[i][type];
                    } else {
                        min[tim] = Math.min(min[tim], data[i][type]);
                    }
                }
            }

            var avg = [];
            for (var i in out) {
                avg.push(out[i] / count[i]);
            }
            var max1 = [];
            for (var i in max) {
                max1.push(max[i]);
            }
            var min1 = [];
            for (var i in min) {
                min1.push(min[i]);
            }

            return ({
                avg: avg,
                min: min1,
                max: max1
            });
        }
    };

    $.app.controller('uploadCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.loadFile = function() {
            console.log($scope.upload.name);
            try {
                var key = $scope.upload.name;
                $.storage.file[key] = {
                    name: key,
                    date: new Date().getTime()
                };

                var t = new parse($scope.upload.data);
                t.farm(function(x, y) {
                    console.log(x, y);
                    $scope.$apply(function () {
                        $scope.loading = {
                            status: true,
                            per: (Number(x) / Number(y)) * 100
                        };
                    });
                }, function(e) {
                    $.storage.data[key] = e;
                    console.log(e);
                    window.localStorage.setItem('file' + key, JSON.stringify(e));
                    $scope.$apply(function () {
                        $scope.loading = {
                            status: false,
                            cur: 100,
                            max: 100
                        };

                        var out = [];
                        for (var i in $.storage.file) {
                            if ($.storage.file[i]) {
                                out.push($.storage.file[i]);
                            }
                        }

                        console.log($.storage.file);
                        window.localStorage.setItem('file', JSON.stringify($.storage.file));
                        $scope.files = out;
                    });
                });
            } catch(e) {
                console.log('something wrong with the file.', e);
            }
        };
        $scope.removeFile = function(key) {
            $.storage.file[key] = null;
            window.localStorage.setItem('file', JSON.stringify($.storage.file));
            var out = [];
            for (var i in $.storage.file) {
                if ($.storage.file[i]) {
                    out.push($.storage.file[i]);
                }
            }
            $scope.files = out;
            //window.localStorage.setItem('uploadedFiles', JSON.stringify($scope.files));
        };
        $scope.graphView = function(key, type) {
            if (!$.storage.data[key]) {
                try {
                    $.storage.data[key] = JSON.parse(window.localStorage.getItem('file' + key)) || {};
                } catch (e) {
                    console.log(e, 'file' + key);
                }
            }
            console.log('l', $.storage.data[key]);

            console.log(key);
            $location.path('/graph/' + key + '/' + type);
        };
        try {
            $.storage.file = JSON.parse(window.localStorage.getItem('file')) || {};
        } catch (e) {

        }

        var out = [];
        for (var i in $.storage.file) {
            if ($.storage.file[i]) {
                out.push($.storage.file[i]);
            }
        }
        $scope.files = out;
    }]);
})(_app || (_app = {}));