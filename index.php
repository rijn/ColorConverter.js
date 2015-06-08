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
                    res:"0~255",
                }, {
                    key: "G",
                    value: 0,
                    res:"0~255",
                }, {
                    key: "B",
                    value: 0,
                    res:"0~255",
                }, ]
            }, {
                name: "HSV",
                remark:"(HSB)",
                para: [{
                    key: "H",
                    value: 0,res:"0~360",
                }, {
                    key: "S",
                    value: 0,res:"0~1",
                }, {
                    key: "V",
                    value: 0,res:"0~1",
                }, ]
            }, {
                name: "HSL",
                para: [{
                    key: "H",
                    value: 0,res:"0~360",
                }, {
                    key: "S",
                    value: 0,res:"0~1",
                }, {
                    key: "L",
                    value: 0,res:"0~1",
                }, ]
            }, {
                name: "XYZ",
                para: [{
                    key: "X",
                    value: 0,res:"0~95.05",
                }, {
                    key: "Y",
                    value: 0,res:"0~100",
                }, {
                    key: "Z",
                    value: 0,res:"0~108.9",
                }, ]
            }, {
                name: "Lab",
                remark:"(CIE)",
                para: [{
                    key: "L",
                    value: 0,res:"0~100",
                }, {
                    key: "a",
                    value: 0,res:"-128~127",
                }, {
                    key: "b",
                    value: 0,res:"-128~127",
                }, ]
            }, {
                name: "LCH",
                para: [{
                    key: "L",
                    value: 0,res:"0~100",
                }, {
                    key: "C",
                    value: 0,res:"0~100",
                }, {
                    key: "H",
                    value: 0,res:"0~360",
                }, ]
            }, {
                name: "LUV",
                para: [{
                    key: "L",
                    value: 0,res:"0~100",
                }, {
                    key: "U",
                    value: 0,res:"-134~224",
                }, {
                    key: "V",
                    value: 0,res:"-140~122",
                }, ]
            }, {
                name: "CMY",
                para: [{
                    key: "C",
                    value: 0,
                    res:"0~1",
                }, {
                    key: "M",
                    value: 0,res:"0~1",
                }, {
                    key: "Y",
                    value: 0,res:"0~1",
                },]
            },{
                name: "CMYK",
                para: [{
                    key: "C",
                    value: 0,
                    res:"0~1",
                }, {
                    key: "M",
                    value: 0,res:"0~1",
                }, {
                    key: "Y",
                    value: 0,res:"0~1",
                }, {
                    key: "K",
                    value: 0,res:"0~1",
                }, ]
            },{
                name: "RGBA",
                remark:"=> RGB",
                para: [{
                    key: "FR",
                    value: 0,
                    res:"0~255",
                }, {
                    key: "FG",
                    value: 0,res:"0~255",
                }, {
                    key: "FB",
                    value: 0,res:"0~255",
                }, {
                    key: "Alpha",
                    value: 0,res:"0~1",
                }, {
                    key: "BR",
                    value: 0,
                    res:"0~255",
                }, {
                    key: "BG",
                    value: 0,res:"0~255",
                }, {
                    key: "BB",
                    value: 0,res:"0~255",
                },]
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
            <div class="col-md-3" ng-repeat="space in spaces">
                <div class="panel panel-default">
                    <div class="panel-heading">{{space.name}} {{space.remark||""}}</div>
                    <div class="panel-body">
                        <form>
                            <div class="form-group" ng-repeat="para in space.para">
                                <label class="sr-only">{{para.key}}</label>
                                <div class="input-group">
                                    <div class="input-group-addon">{{para.key}}</div>
                                    <input type="number" class="form-control" ng-model="para.value" ng-change="dataChange()">
                                    <div class="input-group-addon">{{para.res}}</div>
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
        <pre>&lt;script src="ColorConverter.min.js"&gt;&lt;/script&gt;</pre>
    </div>

    <div class="container">
        <div class="page-header">
            <h1><small>Color Conversions</small></h1>
        </div>
        <h2><small>Initialization</small></h2>
        <pre>var CC = new ColorConverter();</pre>

        <h2><small>Import colors</small></h2>
        <p>You can push colors through <code>import</code> method.</p>
        <pre>/* import a array of colors */
cc.import([
    ["HSL", 180, 0.5, 0.1],
    ["RGB", 180, 50, 50],
    ["RGB", "ffffff"],
    ["CMYK", 0, 0, 0],
    ...
]);</pre>
        <p>CC will return a array of import result like</p>
        <pre>[true, true, true, false, ...]</pre>

        <h2><small>Export colors</small></h2>
        <p>Export colors with a converted data.</p>
        <pre>CC.export("Lab");         // {L:0,a:0,b:0}
CC.export("RGB",[0,1]);   // {R:180,G:50,B:50},{R:180,G:50,B:50}
CC.export("RGB",1,2);     // {R:0,G:0,B:0},{R:0,G:0,B:0}</pre>

        <h2><small>Reset colors</small></h2>
        <p>delete the colors.</p>
        <pre>CC.reset();        // true</pre>

    </div>

    <div class="container">
        <div class="page-header">
            <h1><small>Currently Supported Color Spaces</small></h1>
        </div>
        <pre>Lab
RGB
CMYK
HSV(HSB)
HSL</pre>
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
