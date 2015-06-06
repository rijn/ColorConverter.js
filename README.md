# Color-Converter

Convert color between multiply color space.

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

### Export colors

Export colors with a converted data.

```
CC.export("Lab", "Function");   // "Lab(0,0,0)"
CC.export("Lab", "Object");     // {L:0,a:0,b:0}
CC.export("CMYK", "Function");  // "CMYK(0,0,0,0)"
CC.export("RGB", "Hex");        // "000000"
```

Support formats shown as follows

```
Lab  => Function, Object
CMYK => Function, Object
RGB  => Function, Object, Hex
```

## Currently Supported Color Spaces

* Lab
* RGB
* CMYK