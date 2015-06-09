# ColorConverter.js

A JavaScript library that makes converting between color spaces.

## Demo

[ColorConverter.js](http://lab.pixelnfinite.com/ColorConverter.js/)

## Getting Started

import the js library.

`<script src="./ColorConverter.js"></script>`

## Color Conversions

### Initialization

`var CC = new ColorConverter();`

### Import colors

You can push colors through `import` method.

```
/* import a array of colors */
cc.import([
    ["HSL", 180, 0.5, 0.1],
    ["RGB", 180, 50, 50],
    ["RGB", "ffffff"],
    ["CMYK", 0, 0, 0],
    ...
]);
```

CC will return a array of import result like:

`[true, true, true, false, ...]`

### Export colors

Export colors with a converted data.

```
CC.export("Lab");         // {L:0,a:0,b:0}
CC.export("RGB",[0,1]);   // {R:180,G:50,B:50},{R:180,G:50,B:50}
CC.export("RGB",1,2);     // {R:0,G:0,B:0},{R:0,G:0,B:0}
```

### Reset colors

delete the colors.

```
CC.reset();        // true
```

## Extend function

### negate

```
function negate(_space, _color) {
    var cc = new ColorConverter();
    cc.import([
        [_space, _color],
    ]);
    var _rgb = cc.export("RGB")[0];
    for (var i in _rgb) {
        if (_rgb.hasOwnProperty(i)) {
            _rgb[i] = 255 - _rgb[i];
        }
    }
    cc.reset();
    cc.import([
        ["RGB", _rgb],
    ]);
    return cc.export(_space);
};

console.log(
    negate("CMYK", {
        C: 0,
        M: 0.1,
        Y: 0.2,
        K: 0.3
    })[0]
);
```

### lighten / darken

```
function lighten(_space, _color, _ratio) {
    var cc = new ColorConverter();
    cc.import([
        [_space, _color],
    ]);
    var _hsl = cc.export("HSL")[0];
    _hsl.L += _hsl.L * _ratio;
    cc.reset();
    cc.import([
        ["HSL", _hsl],
    ]);
    return cc.export("RGB");
};

console.log(
    lighten("RGB",
        {
            R: 12,
            G: 34,
            B: 56,
        },
        -0.5  /* if ratio < 0 it will be darken function */
    )[0]
);
```

### saturate / desaturate

```
function saturate(_space, _color, _ratio) {
    var cc = new ColorConverter();
    cc.import([
        [_space, _color],
    ]);
    var _hsl = cc.export("HSL")[0];
    _hsl.S += _hsl.S * _ratio;
    cc.reset();
    cc.import([
        ["HSL", _hsl],
    ]);
    return cc.export("RGB");
};

console.log(
    saturate("RGB",
        {
            R: 12,
            G: 34,
            B: 56,
        },
        -0.5  /* if ratio < 0 it will be desaturate function */
    )[0]
);
```

### rotate

```
function rotate(_space, _color, _degrees) {
    var cc = new ColorConverter();
    cc.import([
        [_space, _color],
    ]);
    var _hsl = cc.export("HSL")[0];
    _hsl.H = (_hsl.H + _degrees) % 360;
    _hsl.H = _hsl.H < 0 ? 360 + _hsl.H : _hsl.H;
    cc.reset();
    cc.import([
        ["HSL", _hsl],
    ]);
    return cc.export(_space);
};

console.log(
    rotate("CMYK", {
        C: 0,
        M: 0.1,
        Y: 0.2,
        K: 0.3
    }, 15)[0]
);
```

## Currently Supported Color Spaces

* RGB
* RGBA => RGB
* CMY
* CMYK
* HSV (HSB)
* HSL
* XYZ
* Lab (CIELab)
* LCH
* LUV