<!DOCTYPE html>
<html ng-app="colorconverter">

<head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=9; IE=8; IE=7; IE=EDGE" />
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimal-ui">
    <title>ColorConverter.js - pixelnfinite</title>
    <meta name="description" content="A JavaScript library that makes converting between color spaces." />
    <meta name="keywords" content="jsKeyword,js,keyword,自动完成,模糊搜索,大量检索" />
    <link href="http://cdn.bootcss.com/bootstrap/3.3.4/css/bootstrap.min.css" rel="stylesheet">
    <link rel="stylesheet" type="text/css" href="http://pixelnfinite.com/navigation.css" />
    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="http://cdn.bootcss.com/html5shiv/3.7.2/html5shiv.min.js"></script>
      <script src="http://cdn.bootcss.com/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->
    <script src="http://cdn.bootcss.com/angular.js/1.4.0-rc.2/angular.min.js" type="text/javascript"></script>
    <script src="./ColorConverter.js"></script>
    <script>
    angular.module('colorconverter', [])
        .controller('ColorInputController', function($scope) {
            var ColorInput = this;
            $scope.spaces = [{
                name: "RGB",
                para: [{
                    key: "R",
                    value: 0,
                }, {
                    key: "G",
                    value: 0,
                }, {
                    key: "B",
                    value: 0,
                }, ]
            }, {
                name: "CMYK",
                para: [{
                    key: "C",
                    value: 0,
                }, {
                    key: "M",
                    value: 0,
                }, {
                    key: "Y",
                    value: 0,
                }, {
                    key: "K",
                    value: 0,
                }, ]
            }, {
                name: "HSL",
                para: [{
                    key: "H",
                    value: 0,
                }, {
                    key: "S",
                    value: 0,
                }, {
                    key: "L",
                    value: 0,
                }, ]
            }, {
                name: "HSV",
                para: [{
                    key: "H",
                    value: 0,
                }, {
                    key: "S",
                    value: 0,
                }, {
                    key: "V",
                    value: 0,
                }, ]
            }, {
                name: "XYZ",
                para: [{
                    key: "X",
                    value: 0,
                }, {
                    key: "Y",
                    value: 0,
                }, {
                    key: "Z",
                    value: 0,
                }, ]
            }, {
                name: "Lab",
                para: [{
                    key: "L",
                    value: 0,
                }, {
                    key: "a",
                    value: 0,
                }, {
                    key: "b",
                    value: 0,
                }, ]
            }, ];

            var cc = new ColorConverter();

            $scope.dataChange = function() {
                var _change = this.space.name,
                    _val = (function(space, value) {
                        for (var i in space) {
                            if (space[i].name == value) {
                                return space[i];
                            }
                        }
                    })($scope.spaces, _change),
                    _para = (function(obj) {
                        var _temp = [];
                        for (var i = 0; i < obj.para.length; i++) {
                            _temp.push(Number(obj.para[i].value));
                        }
                        return _temp;
                    })(_val);

                cc.reset();
                cc.import([
                    [_change, _para],
                ]);
                for (var i in $scope.spaces) {
                    if ($scope.spaces.hasOwnProperty(i)) {
                        var _space = $scope.spaces[i],
                            _res = cc.export(_space.name)[0];
                        if(_space.name == _change) continue;
                        for (var k in _res) {
                            for (var j = 0; j < _space.para.length; j++) {
                                if (k == _space.para[j].key) {
                                    _space.para[j].value = Number(_res[k]);
                                }
                            }
                        }
                    }
                }
            }
        });
    </script>
</head>

<body>
    <?php include "../navigation.php";?>
    <div class="container">
        <div class="page-header">
            <h1>ColorConverter.js <small><small><a href="https://github.com/rijn/ColorConverter.js">Source code on GitHub</a></small></small></h1>
        </div>
        A JavaScript library that makes converting between color spaces.
    </div>
    <div class="container">
        <div class="page-header">
            <h1><small>Demo</small></h1>
        </div>
        <div class="row" ng-controller="ColorInputController">
            <div class="col-md-2" ng-repeat="space in spaces">
                <div class="panel panel-default">
                    <div class="panel-heading">{{space.name}}</div>
                    <div class="panel-body">
                        <form>
                            <div class="form-group" ng-repeat="para in space.para">
                                <label class="sr-only">{{para.key}}</label>
                                <div class="input-group">
                                    <div class="input-group-addon">{{para.key}}</div>
                                    <input type="text" class="form-control" ng-model="para.value" ng-change="dataChange()">
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="page-header">
            <h1><small>Quick start</small></h1>
        </div>
        <p>Include ColorConverter.js to your page.</p>
        <pre>&lt;script src="ColorConverter.js"&gt;&lt;/script&gt;</pre>
        <p style="padding-top:40px">Than initialize the library.</p>
        <pre>var CC = new ColorConverter();</pre>
    </div>

    <div class="container">
        <div class="page-header">
            <h1><small>Copyright && License</small></h1>
        </div>
        <p>Code and documentation copyright 2015 Rijn, pixelnfinite.com.</p>
        <p>Code released under the MIT license.</p>
    </div>
    <div class="container">
        <div class="page-header">
            <h5>&copy; Rijn, pixelnfinite.com, 2015.</h5>
        </div>
    </div>
</body>

</html>
