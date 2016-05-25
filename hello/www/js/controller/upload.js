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

    function genKey(l)
    {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < l; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }


    $.app.controller('uploadCtrl', ['$scope', '$http', '$location', function ($scope, $http, $location) {
        $scope.loadFile = function() {
            console.log($scope.upload.name);
            try {
                var key = $scope.upload.name;
                $.storage.file[key] = {
                    name: key,
                    date: new Date().getTime()
                };

                //window.localStorage.setItem('u' + key, $scope.upload);
                var out = [], tmp = $scope.upload.data.split('\n');
                for (var i in tmp) {
                    tmp[i] = tmp[i].split(/[\t]/g);
                }
                for (var i = 2; i < tmp.length; i++) {
                    var elem = {};
                    for (var x in tmp[1]) {
                        var cast = Number(tmp[i][x]);
                        elem[tmp[1][x]] = (tmp[i][x] != ' ')? ((!isNaN(cast)) ? cast : tmp[i][x]) : 0;
                    }
                    out.push(elem);
                }
                $.storage.data[key] = out;

                var out = [];
                for (var i in $.storage.file) {
                    if ($.storage.file[i]) {
                        out.push( $.storage.file[i]);
                    }
                }
                $scope.files = out;
            } catch(e) {
                console.log('something wrong with the file.', e);
            }
        };
        $scope.removeFile = function(key) {
            $.storage.file[key] = null;
            console.log(key, $.storage.file);
            var out = [];
            for (var i in $.storage.file) {
                if ($.storage.file[i]) {
                    out.push($.storage.file[i]);
                }
            }
            $scope.files = out;
            //window.localStorage.setItem('uploadedFiles', JSON.stringify($scope.files));
        };
        $scope.removeView = function(key) {
            console.log(key);
            $location.path('/graph/' + key);
        };

        var out = [];
        for (var i in $.storage.file) {
            if ($.storage.file[i]) {
                out.push( $.storage.file[i]);
            }
        }
        $scope.files = out;
    }]);
})(_app || (_app = {}));