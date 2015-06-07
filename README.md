# ColorConverter.js

A JavaScript library that makes converting between color spaces.

## Getting Started

import the js library.

`<script src="./ColorConverter.js"></script>`

## Color Conversions

### Initialization

`var CC = new ColorConverter();`

### Import colors

You can push a array of colors through `import` method.

```
colors = [
    "RGB('ffffff');",
    "RGB('#FFFFFF');",
    "RGB(255, 255, 255);",
    "CMYK(0, 0, 0, 0);",
    "Lab(0, 0, 0);",
];

CC.import(colors);
```

CC will return a array of import result like:

`[true, true, false, true, ...]`

or import one color with `push` method.

```
CC.push("RGB('#fff')");   // true
```

### Export colors

Export colors with a converted data.

```
CC.export("Lab");   // {L:0,a:0,b:0}
CC.export("RGB");   // {R:0,G:0,B:0}
```

## Currently Supported Color Spaces

* Lab
* RGB
* CMYK
* HSV(HSB)
* HSL