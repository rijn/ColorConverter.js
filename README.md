# ColorConverter.js

A JavaScript library that makes converting between color spaces.

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

## Currently Supported Color Spaces

* Lab
* RGB
* CMYK
* HSV(HSB)
* HSL