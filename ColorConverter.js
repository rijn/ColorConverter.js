/*
 * Color Converter
 * @author Rijn
 */

;
(function(window, document, undefined) {
    "use strict";

    /* Rewrite foreach method to support ie */
    Array.prototype.forEach = function(fun, context) {
        var len = this.length,
            context = arguments[1];
        if (typeof fun !== "function") {
            throw Error("unknown function");
        }
        for (var i = 0; i < len; i++) {
            fun.call(context, this[i], i, this);
        }
    };
    /* Get the last element from Array */
    Array.prototype.getLast = function() {
        return this instanceof Array ? this[this.length - 1] : false;
    };
    /* Serach object form Array */
    Array.prototype.search = function(str) {
        if (this instanceof Array) {
            var found = [];
            for (var i in this) {
                if (this[i] == str) {
                    found.push(i);
                }
            }
            var num = found.length;
            if (num == 0) return false;
            if (num == 1) return found[0];
            return found;
        } else {
            return false;
        }
    };
    /* Deep copy Object */
    Object.prototype.clone = function(oldObj) {
        if (typeof(this) != 'object') return this;
        if (this == null) return this;
        var newObj = this instanceof Array ? new Array() : new Object();
        for (var i in this)
            newObj[i] = this[i].clone();
        return newObj;
    };
    /* Check property */
    Object.prototype.check = function() {
        if (typeof this !== 'object') return false;
        var argu = flatten(arguments);
        for (var i = 0; i < argu.length; i++) {
            if (!this.hasOwnProperty(argu[i])) {
                return false;
            }
        };
        return true;
    };

    /* Flatten function */
    var flatten = function(input) {
            var has = function(obj, key) {
                    return obj != null && hasOwnProperty.call(obj, key);
                },
                isArrayLike = function(collection) {
                    var length = collection && collection.length;
                    return typeof length == 'number' && length >= 0;
                },
                /* if obj is array */
                isArray = function(obj) {
                    return toString.call(obj) === '[object Array]';
                },
                /* if obj is arguments*/
                isArguments = function(obj) {
                    return has(obj, 'callee');
                },
                output = [],
                idx = 0;
            /* flatten function from underscore */
            for (var i = 0, length = input && input.length; i < length; i++) {
                var value = input[i];
                if (isArrayLike(value) && (isArray(value) || isArguments(value))) {
                    value = flatten(value);
                    var j = 0,
                        len = value.length;
                    output.length += len;
                    while (j < len) {
                        output[idx++] = value[j++];
                    }
                } else {
                    output[idx++] = value;
                }
            }
            return output;
        },
        /* find the minimum or maximum element */
        min = function() {
            var _input = flatten([arguments]),
                tempVal = _input[0];
            for (var i = 0; i < _input.length; i++) {
                if (tempVal > _input[i]) {
                    tempVal = _input[i];
                }
            }
            return tempVal;
        },
        max = function() {
            var _input = flatten([arguments]),
                tempVal = _input[0];
            for (var i = 0; i < _input.length; i++) {
                if (tempVal < _input[i]) {
                    tempVal = _input[i];
                }
            }
            return tempVal;
        },
        /* AccOperation for Float */
        acc = {
            div: function(arg1, arg2) {
                var t1 = 0,
                    t2 = 0,
                    r1, r2;
                try {
                    t1 = arg1.toString().split(".")[1].length
                } catch (e) {}
                try {
                    t2 = arg2.toString().split(".")[1].length
                } catch (e) {}

                r1 = Number(arg1.toString().replace(".", ""))
                r2 = Number(arg2.toString().replace(".", ""))
                return acc.mul((r1 / r2), Math.pow(10, t2 - t1));

            },
            mul: function(arg1, arg2) {
                var m = 0,
                    s1 = arg1.toString(),
                    s2 = arg2.toString();
                try {
                    m += s1.split(".")[1].length
                } catch (e) {}
                try {
                    m += s2.split(".")[1].length
                } catch (e) {}
                return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m)
            },
            add: function(arg1, arg2) {
                var r1, r2, m;
                try {
                    r1 = arg1.toString().split(".")[1].length
                } catch (e) {
                    r1 = 0
                }
                try {
                    r2 = arg2.toString().split(".")[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2))
                return Number((arg1 * m + arg2 * m) / m);
            },
            sub: function(arg1, arg2) {
                var r1, r2, m, n;
                try {
                    r1 = arg1.toString().split(".")[1].length
                } catch (e) {
                    r1 = 0
                }
                try {
                    r2 = arg2.toString().split(".")[1].length
                } catch (e) {
                    r2 = 0
                }
                m = Math.pow(10, Math.max(r1, r2));
                n = (r1 >= r2) ? r1 : r2;
                return Number(((arg1 * m - arg2 * m) / m).toFixed(n));
            }
        },
        /* Color spaces defination */
        spaces = {
            constant: {
                Epsilon: 216 / 24389,
                Kappa: 24389 / 27,
                XYZ_WhiteRefrence: {
                    X: 95.047,
                    Y: 100.000,
                    Z: 108.883,
                },
                CubicRoot: function(n) {
                    return Math.pow(n, 1.0 / 3.0);
                },
            },
            RGB: {
                import: function() {
                    var input = flatten(arguments),
                        rgbColor = [];

                    if (input[0].check("R", "G", "B")) {
                        return {
                            RGB: input[0],
                        };
                    };

                    if (input.length < 3) {
                        var reg = /([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/;
                        var sColor = input[0].toLowerCase();
                        if (sColor && reg.test(sColor)) {
                            sColor = reg.exec(sColor)[0];
                            if (sColor.length === 3) {
                                var sColorNew = "";
                                for (var i = 0; i < 3; i += 1) {
                                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                                }
                                sColor = sColorNew;
                            }
                            var rgbColor = [];
                            for (var i = 0; i < 6; i += 2) {
                                rgbColor.push(parseInt("0x" + sColor.slice(i, i + 2)));
                            }
                        } else {
                            return false;
                        }
                    } else {
                        for (var i = 0; i < 3; i++) {
                            rgbColor[i] = Number(input[i]);
                        }
                    }

                    for (var i in rgbColor) {
                        if (rgbColor[i] < 0) return false;
                        if (rgbColor[i] > 255) return false;
                    };

                    return {
                        RGB: {
                            R: rgbColor[0],
                            G: rgbColor[1],
                            B: rgbColor[2],
                        },
                    };
                },
                XYZ: {
                    convert: function(_rgb) {
                        function PivotRgb(n) {
                            return (n > 0.04045 ? Math.pow((n + 0.055) / 1.055, 2.4) : n / 12.92) * 100.0;
                        }
                        _rgb.R = PivotRgb(_rgb.R / 255);
                        _rgb.G = PivotRgb(_rgb.G / 255);
                        _rgb.B = PivotRgb(_rgb.B / 255);

                        return {
                            X: _rgb.R * 0.412453 + _rgb.G * 0.357580 + _rgb.B * 0.180423,
                            Y: _rgb.R * 0.212671 + _rgb.G * 0.715160 + _rgb.B * 0.072169,
                            Z: _rgb.R * 0.019334 + _rgb.G * 0.119193 + _rgb.B * 0.950227,
                        };
                    },
                    cost: 1,
                },
                CMY: {
                    convert: function(_rgb) {
                        var c, m, y;

                        c = (255 - _rgb.R) / 255;
                        m = (255 - _rgb.G) / 255;
                        y = (255 - _rgb.B) / 255;

                        return {
                            C: c,
                            M: m,
                            Y: y,
                        };
                    },
                    cost: 0,
                },
                CMYK: {
                    convert: function(_rgb) {
                        var cmyMin = 0,
                            c, m, y, k;

                        k = 0;

                        c = (255 - _rgb.R) / 255;
                        m = (255 - _rgb.G) / 255;
                        y = (255 - _rgb.B) / 255;

                        k = min([c, m, y]);

                        if (k == 1.0) {
                            c = m = y = 0;
                        } else {
                            c = (c - k) / (1 - k);
                            m = (m - k) / (1 - k);
                            y = (y - k) / (1 - k);
                        }

                        return {
                            C: c,
                            M: m,
                            Y: y,
                            K: k,
                        };
                    },
                    cost: 0,
                },
                HSL: {
                    convert: function(_rgb) {
                        var R = _rgb.R / 255,
                            G = _rgb.G / 255,
                            B = _rgb.B / 255,
                            Min = min(R, G, B),
                            Max = max(R, G, B),
                            del_Max = Max - Min,
                            L = (Max + Min) / 2.0,
                            del_R, del_G, del_B,
                            H, S;

                        if (del_Max == 0) {
                            H = 0;
                            S = 0;
                        } else {
                            if (L < 0.5)
                                S = del_Max / (Max + Min);
                            else
                                S = del_Max / (2 - Max - Min);

                            del_R = (((Max - R) / 6.0) + (del_Max / 2.0)) / del_Max;
                            del_G = (((Max - G) / 6.0) + (del_Max / 2.0)) / del_Max;
                            del_B = (((Max - B) / 6.0) + (del_Max / 2.0)) / del_Max;

                            if (R == Max) H = del_B - del_G;
                            else if (G == Max) H = (1.0 / 3.0) + del_R - del_B;
                            else if (B == Max) H = (2.0 / 3.0) + del_G - del_R;

                            if (H < 0) H += 1;
                            if (H > 1) H -= 1;
                        };

                        return {
                            H: H * 360,
                            S: S,
                            L: L,
                        };
                    },
                    cost: 0,
                },
                HSV: {
                    convert: function(_rgb) {
                        var r = _rgb.R / 255,
                            g = _rgb.G / 255,
                            b = _rgb.B / 255,
                            minRGB = min(r, g, b),
                            maxRGB = max(r, g, b),
                            H, S, V;

                        if (minRGB == maxRGB) {
                            V = minRGB;
                            return {
                                H: 0,
                                S: 0,
                                V: V,
                            }
                        } else {
                            var d = (r == minRGB) ? g - b : ((b == minRGB) ? r - g : b - r),
                                h = (r == minRGB) ? 3 : ((b == minRGB) ? 1 : 5);
                            H = 60 * (h - d / (maxRGB - minRGB));
                            S = (maxRGB - minRGB) / maxRGB;
                            V = maxRGB;
                            return {
                                H: H,
                                S: S,
                                V: V,
                            }
                        }
                    },
                    cost: 0,
                },
            },
            CMY: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("C", "M", "Y")) {
                        return {
                            CMY: input[0],
                        };
                    };

                    if (input.length < 3) {
                        return false;
                    }
                    for (var i = 0; i < 3; i++) {
                        if (input[i] < 0 || input[i] > 1) return false;
                    }
                    return {
                        CMY: {
                            C: input[0],
                            M: input[1],
                            Y: input[2],
                        },
                    }
                },
                RGB: {
                    convert: function(_cmy) {
                        var r, g, b;

                        r = (1 - _cmy.C) * 255;
                        g = (1 - _cmy.M) * 255;
                        b = (1 - _cmy.Y) * 255;

                        return {
                            R: r,
                            G: g,
                            B: b,
                        };
                    },
                    cost: 0,
                },
            },
            RGBA: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("R", "G", "B", "A")) {
                        return {
                            RGBA: input[0],
                        };
                    };

                    if (input.length < 7) {
                        return false;
                    }
                    for (var i = 0; i < 7; i++) {
                        if (input[i] < 0 || input[i] > 255) return false;
                    }
                    if (input[3] > 1) return false;
                    return {
                        RGBA: {
                            FR: input[0],
                            FG: input[1],
                            FB: input[2],

                            Alpha: input[3],
                            BR: input[4],
                            BG: input[5],
                            BB: input[6],

                        },
                    }
                },
                RGB: {
                    convert: function(_rgba) {
                        return {
                            R: (1 - _rgba.Alpha) * _rgba.BR + _rgba.Alpha * _rgba.FR,
                            G: (1 - _rgba.Alpha) * _rgba.BG + _rgba.Alpha * _rgba.FG,
                            B: (1 - _rgba.Alpha) * _rgba.BB + _rgba.Alpha * _rgba.FB,
                        }
                    },
                    cost: 1,
                },
            },
            CMYK: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("C", "M", "Y", "K")) {
                        return {
                            CMYK: input[0],
                        };
                    };

                    if (input.length < 4) {
                        return false;
                    }
                    for (var i = 0; i < 4; i++) {
                        if (input[i] < 0 || input[i] > 1) return false;
                    }
                    return {
                        CMYK: {
                            C: input[0],
                            M: input[1],
                            Y: input[2],
                            K: input[3],
                        },
                    }
                },
                RGB: {
                    convert: function(_cmyk) {
                        var r, g, b;

                        r = ((1 - _cmyk.K) * (1 - _cmyk.C)) * 255;
                        g = ((1 - _cmyk.K) * (1 - _cmyk.M)) * 255;
                        b = ((1 - _cmyk.K) * (1 - _cmyk.Y)) * 255;

                        return {
                            R: r,
                            G: g,
                            B: b,
                        };
                    },
                    cost: 0,
                },
            },
            HSL: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("H", "S", "L")) {
                        return {
                            HSL: input[0],
                        };
                    };

                    if (input.length < 3) {
                        return false;
                    };

                    if (input[0] < 0 || input[0] > 360 || input[1] < 0 || input[2] < 0 || input[1] > 1 || input[2] > 1) return false;

                    return {
                        HSL: {
                            H: input[0],
                            S: input[1],
                            L: input[2],
                        },
                    };
                },
                RGB: {
                    convert: function(_hsl) {
                        var H = _hsl.H,
                            S = _hsl.S,
                            L = _hsl.L,
                            _r, _g, _b,

                            c = acc.mul(acc.sub(1, Math.abs(acc.sub(acc.mul(2, L), 1))), S),
                            h = H / 60,
                            x = acc.mul(c, (1 - Math.abs(h % 2 - 1))),
                            i = parseInt(h),
                            m = acc.sub(L, acc.div(c, 2));

                        switch (i) {
                            case 0:
                                _r = c;
                                _g = x;
                                _b = 0;
                                break;
                            case 1:
                                _r = x;
                                _g = c;
                                _b = 0;
                                break;
                            case 2:
                                _r = 0;
                                _g = c;
                                _b = x;
                                break;
                            case 3:
                                _r = 0;
                                _g = x;
                                _b = c;
                                break;
                            case 4:
                                _r = x;
                                _g = 0;
                                _b = c;
                                break;
                            case 5:
                                _r = c;
                                _g = 0;
                                _b = x;
                                break;
                        };

                        _r = acc.add(_r, m);
                        _g = acc.add(_g, m);
                        _b = acc.add(_b, m);

                        return {
                            R: _r * 255,
                            G: _g * 255,
                            B: _b * 255,
                        };
                    },
                    cost: 0,
                },
            },
            HSV: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("H", "S", "L")) {
                        return {
                            HSL: input[0],
                        };
                    };

                    if (input.length < 3) {
                        return false;
                    }

                    if (input[0] < 0 || input[0] > 360 || input[1] < 0 || input[2] < 0 || input[1] > 1 || input[2] > 1) return false;

                    return {
                        HSV: {
                            H: input[0],
                            S: input[1],
                            V: input[2],
                        },
                    }
                },
                RGB: {
                    convert: function(_hsv) {
                        var H = _hsv.H,
                            S = _hsv.S,
                            V = _hsv.V,
                            _r, _g, _b,

                            c = V * S,
                            h = H / 60,
                            x = c * (1 - Math.abs(h % 2 - 1)),
                            i = parseInt(h),
                            m = V - c;

                        switch (i) {
                            case 0:
                                _r = c;
                                _g = x;
                                _b = 0;
                                break;
                            case 1:
                                _r = x;
                                _g = c;
                                _b = 0;
                                break;
                            case 2:
                                _r = 0;
                                _g = c;
                                _b = x;
                                break;
                            case 3:
                                _r = 0;
                                _g = x;
                                _b = c;
                                break;
                            case 4:
                                _r = x;
                                _g = 0;
                                _b = c;
                                break;
                            case 5:
                                _r = c;
                                _g = 0;
                                _b = x;
                                break;
                        };
                        _r += m;
                        _g += m;
                        _b += m;
                        return {
                            R: _r * 255,
                            G: _g * 255,
                            B: _b * 255,
                        };
                    },
                    cost: 0,
                },
            },
            XYZ: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("X", "Y", "Z")) {
                        return {
                            XYZ: input[0],
                        };
                    };

                    if (input.length < 3) {
                        return false;
                    }

                    return {
                        XYZ: {
                            X: input[0],
                            Y: input[1],
                            Z: input[2],
                        },
                    }
                },
                RGB: {
                    convert: function(_xyz) {

                        function ToRgb(n) {
                            var result = 255 * n;
                            if (result < 0) return 0;
                            if (result > 255) return 255;
                            return result;
                        }

                        var x = _xyz.X / 100.0,
                            y = _xyz.Y / 100.0,
                            z = _xyz.Z / 100.0,

                            r = x * 3.2406 + y * -1.5372 + z * -0.4986,
                            g = x * -0.9689 + y * 1.8758 + z * 0.0415,
                            b = x * 0.0557 + y * -0.2040 + z * 1.0570;

                        r = r > 0.0031308 ? 1.055 * Math.pow(r, 1 / 2.4) - 0.055 : 12.92 * r;
                        g = g > 0.0031308 ? 1.055 * Math.pow(g, 1 / 2.4) - 0.055 : 12.92 * g;
                        b = b > 0.0031308 ? 1.055 * Math.pow(b, 1 / 2.4) - 0.055 : 12.92 * b;

                        return {
                            R: ToRgb(r),
                            G: ToRgb(g),
                            B: ToRgb(b),
                        };
                    },
                    cost: 1,
                },
                Lab: {
                    convert: function(_xyz) {

                        function PivotXyz(n) {
                            return n > spaces.constant.Epsilon ? spaces.constant.CubicRoot(n) : (spaces.constant.Kappa * n + 16) / 116;
                        }

                        var white = spaces.constant.XYZ_WhiteRefrence,
                            x = PivotXyz(_xyz.X / white.X),
                            y = PivotXyz(_xyz.Y / white.Y),
                            z = PivotXyz(_xyz.Z / white.Z);

                        return {
                            L: Math.max(0, 116 * y - 16),
                            a: 500 * (x - y),
                            b: 200 * (y - z),
                        }
                    },
                    cost: 1,
                },
                LUV: {
                    convert: function(_xyz) {

                        function GetDenominator(xyz) {
                            return xyz.X + 15.0 * xyz.Y + 3.0 * xyz.Z;
                        }

                        var white = spaces.constant.XYZ_WhiteRefrence,
                            y = _xyz.Y / white.Y,
                            L = y > spaces.constant.Epsilon ? 116.0 * spaces.constant.CubicRoot(y) - 16.0 : spaces.constant.Kappa * y,
                            targetDenominator = GetDenominator(_xyz),
                            referenceDenominator = GetDenominator(white),
                            xTarget = targetDenominator == 0 ? 0 : ((4.0 * _xyz.X / targetDenominator) - (4.0 * white.X / referenceDenominator)),
                            yTarget = targetDenominator == 0 ? 0 : ((9.0 * _xyz.Y / targetDenominator) - (9.0 * white.Y / referenceDenominator)),
                            U = 13.0 * L * xTarget,
                            V = 13.0 * L * yTarget;

                        return {
                            L: L,
                            U: U,
                            V: V,
                        }
                    },
                    cost: 1,
                },
            },
            Lab: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("L", "a", "b")) {
                        return {
                            Lab: input[0],
                        };
                    };

                    if (input.length < 3) {
                        return false;
                    }

                    return {
                        Lab: {
                            L: input[0],
                            a: input[1],
                            b: input[2],
                        },
                    };
                },
                XYZ: {
                    convert: function(_lab) {
                        var y = (_lab.L + 16.0) / 116.0,
                            x = _lab.a / 500.0 + y,
                            z = y - _lab.b / 200.0,
                            white = spaces.constant.XYZ_WhiteRefrence,
                            x3 = x * x * x,
                            z3 = z * z * z;
                        return {
                            X: white.X * (x3 > spaces.constant.Epsilon ? x3 : (x - 16.0 / 116.0) / 7.787),
                            Y: white.Y * (_lab.L > (spaces.constant.Kappa * spaces.constant.Epsilon) ? Math.pow(((_lab.L + 16.0) / 116.0), 3) : _lab.L / spaces.constant.Kappa),
                            Z: white.Z * (z3 > spaces.constant.Epsilon ? z3 : (z - 16.0 / 116.0) / 7.787),
                        };
                    },
                    cost: 1,
                },
                LCH: {
                    convert: function(_lab) {
                        var h = Math.atan2(_lab.b, _lab.a);

                        if (h > 0) {
                            h = (h / Math.PI) * 180.0;
                        } else {
                            h = 360 - (Math.abs(h) / Math.PI) * 180.0;
                        }

                        if (h < 0) {
                            h += 360.0;
                        } else if (h >= 360) {
                            h -= 360.0;
                        }

                        return {
                            L: _lab.L,
                            C: Math.sqrt(_lab.a * _lab.a + _lab.b * _lab.b),
                            H: h,
                        }
                    },
                    cost: 1,
                },
            },
            LCH: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("L", "C", "H")) {
                        return {
                            LCH: input[0],
                        };
                    };

                    if (input.length < 3) {
                        return false;
                    }

                    return {
                        LCH: {
                            L: input[0],
                            C: input[1],
                            H: input[2],
                        },
                    };
                },
                Lab: {
                    convert: function(_lch) {
                        var hRadians = _lch.H * Math.PI / 180.0;
                        return {
                            L: _lch.L,
                            a: Math.cos(hRadians) * _lch.C,
                            b: Math.sin(hRadians) * _lch.C,
                        };
                    },
                    cost: 1,
                },
            },
            LUV: {
                import: function() {
                    var input = flatten(arguments);

                    if (input[0].check("L", "U", "V")) {
                        return {
                            LUV: input[0],
                        };
                    };

                    if (input.length < 3) {
                        return false;
                    }

                    return {
                        LUV: {
                            L: input[0],
                            U: input[1],
                            V: input[2],
                        },
                    };
                },
                XYZ: {
                    convert: function(_luv) {

                        function GetDenominator(xyz) {
                            return xyz.X + 15.0 * xyz.Y + 3.0 * xyz.Z;
                        }

                        var white = spaces.constant.XYZ_WhiteRefrence,
                            c = -1.0 / 3.0,
                            uPrime = (4.0 * white.X) / GetDenominator(white),
                            vPrime = (9.0 * white.Y) / GetDenominator(white),
                            a = (1.0 / 3.0) * ((52.0 * _luv.L) / (_luv.U + 13 * _luv.L * uPrime) - 1.0),
                            imteL_16_116 = (_luv.L + 16.0) / 116.0,
                            y = _luv.L > spaces.constant.Kappa * spaces.constant.Epsilon ? imteL_16_116 * imteL_16_116 * imteL_16_116 : _luv.L / spaces.constant.Kappa,
                            b = -5.0 * y,
                            d = y * ((39.0 * _luv.L) / (_luv.V + 13.0 * _luv.L * vPrime) - 5.0),
                            x = (d - b) / (a - c),
                            z = x * a + b;
                        return {
                            X: 100 * x,
                            Y: 100 * y,
                            Z: 100 * z,
                        };
                    },
                    cost: 1,
                },
            },
        };

    var defaults = {
        colors: [],
    };

    /* Main function */
    function ColorConverter(options) {
        var self = this;
        self.colors = [];

        if (!(self instanceof ColorConverter)) {
            return new ColorConverter(options);
        };

        self.options = options || {};

        for (var i in defaults) {
            if (self.options[i] == null) {
                self.options[i] = defaults[i];
            };
        };

        if (!!self.options.colors) {
            self.import(self.options.colors);
        };
    };

    /* Extend functions */
    ColorConverter.prototype = {

        constructor: ColorConverter,

        import: function() {
            var argu = Array.prototype.slice.call(arguments)[0],
                output = [],
                self = this;

            for (var i = 0; i < argu.length; i++) {

                var _temp = flatten(argu[i]);
                /*split temp*/
                var _format = _temp.shift(),
                    _para = _temp;

                if (!spaces.hasOwnProperty(_format)) {
                    throw Error("Unsupport color spaces");
                };

                var _obj = eval("(spaces." + _format + ".import)");

                if (_obj === undefined) {
                    throw Error("Cannot convert from " + _format);
                };

                var _res = _obj.call(this, _para);

                if (!!_res) {
                    self.colors.push(_res);
                    output.push(self.colors.length - 1);
                } else {
                    output.push(false);
                };
            };

            return output;
        },

        export: function() {
            var argu = flatten(arguments),
                format = argu.shift(),
                list = argu,
                output = [],
                self = this;

            if (!list.length) {
                for (var i in self.colors) {
                    if (self.colors.hasOwnProperty(i)) {
                        list.push(i);
                    };
                };
            };

            list.forEach(function(_i) {

                var _code = self.colors[_i];

                if (_code === undefined) {
                    throw Error("Undefined color");
                };

                var _key = (function(_code) {
                        for (var i in _code) {
                            return i;
                        }
                    })(_code),
                    _temp = _code[_key],
                    _tokens = [{
                        _path: [_key],
                        _cost: 0,
                        _terminal: false,
                    }],
                    _target = format,
                    _depth = 0;



                while (!(function(tokens, target) {
                        var flag = false;
                        for (var key in tokens) {
                            if (tokens.hasOwnProperty(key)) {
                                if (!tokens[key]._terminal) {
                                    return false;
                                };
                            };
                        };
                        return true;
                    })(_tokens, _target) && _depth < 10) {

                    var _deplicate = [];

                    for (var key in _tokens) {
                        if (_tokens.hasOwnProperty(key)) {

                            var _on = _tokens[key],
                                _nowkey = _on._path.getLast();

                            if (spaces.hasOwnProperty(_nowkey)) {

                                var _obj = eval("(spaces." + _nowkey + ")");

                                for (var key in _obj) {
                                    if (_obj.hasOwnProperty(key)) {

                                        var _temp = _on.clone();

                                        if (_on._path.search(key) || _on._path.getLast() == _target) {
                                            _temp._terminal = true;
                                        } else {
                                            _temp._path.push(key);
                                            _temp._cost += eval("(spaces." + _nowkey + "." + key + ".cost)");
                                        };

                                        _deplicate.push(_temp);
                                    };
                                };

                                _obj = null;

                            };
                        };
                    };

                    _tokens = _deplicate;
                    _deplicate = null;

                    _depth++;
                };

                if (!_tokens.length) {
                    throw Error("No path to target");
                };

                var _sort = [];

                for (var key in _tokens) {
                    if (_tokens.hasOwnProperty(key) && _tokens[key] && _tokens[key]._path.getLast() == _target) {
                        _sort.push(_tokens[key]);
                    };
                };

                _sort.sort(function(a, b) {
                    return a.cost > b.cost ? -1 : 1;
                });

                if (!!_sort.length) {

                    var _rp = _sort[0]._path,
                        _temp = eval("(_code." + _rp[0] + ")");

                    for (var i = 1; i < _rp.length; i++) {
                        _temp = eval("(spaces." + _rp[i - 1] + "." + _rp[i] + ".convert(" + JSON.stringify(_temp) + "))");
                    };

                    output.push(_temp);

                }

            })
            return output;
        },

        reset: function() {
            var self = this;
            self.colors = [];
            return true;
        },

    }

    window.ColorConverter = ColorConverter;

})(window, document);
