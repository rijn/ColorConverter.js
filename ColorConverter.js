/*
 * Color Converter
 * js part
 * @author Rijn
 */

;
(function(window, document, undefined) {
    "use strict";

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
        min = function(_input) {
            var tempVal = _input[0];
            for (var i = 0; i < _input.length; i++) {
                if (tempVal > _input[i]) {
                    tempVal = _input[i];
                }
            }
            return tempVal;
        };

    var RGB2XYZ = function(_rgb) {
            return {
                X: (_rgb.B * 199049 + _rgb.G * 394494 + _rgb.R * 455033 + 524288) >> 20,
                Y: (_rgb.B * 75675 + _rgb.G * 749900 + _rgb.R * 223002 + 524288) >> 20,
                Z: (_rgb.B * 915161 + _rgb.G * 114795 + _rgb.R * 18621 + 524288) >> 20,
            };
        },
        XYZ2LAB = function(_xyz) {
            var BLACK = 20,
                YELLOW = 70,
                X = _xyz.X / (255 * 0.950456),
                Y = _xyz.Y / 255,
                Z = _xyz.Z / (255 * 1.088754),
                fX, fY, fZ, L, a, b;

            if (Y > 0.008856) {
                fY = Math.pow(Y, 1.0 / 3.0);
                L = 116.0 * fY - 16.0;
            } else {
                fY = 7.787 * Y + 16.0 / 116.0;
                L = 903.3 * Y;
            }

            if (X > 0.008856)
                fX = Math.pow(X, 1.0 / 3.0);
            else
                fX = 7.787 * X + 16.0 / 116.0;

            if (Z > 0.008856)
                fZ = Math.pow(Z, 1.0 / 3.0);
            else
                fZ = 7.787 * Z + 16.0 / 116.0;

            a = 500.0 * (fX - fY);
            b = 200.0 * (fY - fZ);

            if (L < BLACK) {
                a *= Math.exp((L - BLACK) / (BLACK / 4));
                b *= Math.exp((L - BLACK) / (BLACK / 4));
                L = BLACK;
            }
            if (b > YELLOW)
                b = YELLOW;

            return {
                L: L,
                a: a,
                b: b,
            }
        },
        LAB2XYZ = function(_lab) {
            var L = _lab.L,
                a = _lab.a,
                b = _lab.b,
                fX, fY, fZ, X, Y, Z;

            fY = Math.pow((L + 16.0) / 116.0, 3.0);
            if (fY < 0.008856)
                fY = L / 903.3;
            Y = fY;

            if (fY > 0.008856)
                fY = Math.pow(fY, 1.0 / 3.0);
            else
                fY = 7.787 * fY + 16.0 / 116.0;

            fX = a / 500.0 + fY;
            if (fX > 0.206893)
                X = Math.pow(fX, 3.0);
            else
                X = (fX - 16.0 / 116.0) / 7.787;

            fZ = fY - b / 200.0;
            if (fZ > 0.206893)
                Z = Math.pow(fZ, 3.0);
            else
                Z = (fZ - 16.0 / 116.0) / 7.787;

            X *= (0.950456 * 255);
            Y *= 255;
            Z *= (1.088754 * 255);

            return {
                X: X,
                Y: Y,
                Z: Z,
            }
        },
        XYZ2RGB = function(_xyz) {
            var Blue = (_xyz.X * 55460 - _xyz.Y * 213955 + _xyz.Z * 1207070) >> 20,
                Green = (_xyz.X * -965985 + _xyz.Y * 1967119 + _xyz.Z * 47442) >> 20,
                Red = (_xyz.X * 3229543 - _xyz.Y * 1611819 - _xyz.Z * 569148) >> 20;
            if (Red > 255) Red = 255;
            else if (Red < 0) Red = 0;
            if (Green > 255) Green = 255;
            else if (Green < 0) Green = 0;
            if (Blue > 255) Blue = 255;
            else if (Blue < 0) Blue = 0;
            return {
                R: Red,
                G: Green,
                B: Blue,
            };
        },
        RGB2CMYK = function(_rgb) {
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
                C: c * 100,
                M: m * 100,
                Y: y * 100,
                K: k * 100,
            };
        },
        CMYK2RGB = function(_cmyk) {
            var r, g, b;

            r = ((100 - _cmyk.K) * (100 - _cmyk.C)) / 10000 * 255;
            g = ((100 - _cmyk.K) * (100 - _cmyk.M)) / 10000 * 255;
            b = ((100 - _cmyk.K) * (100 - _cmyk.Y)) / 10000 * 255;

            return {
                R: r,
                G: g,
                B: b,
            };
        },
        Color2LAB = {
            Lab: function() {
                var input = flatten(arguments);
                if (input.length < 3) {
                    return false;
                }

                var _lab = {
                    L: input[0],
                    a: input[1],
                    b: input[2],
                };

                return _lab;
            },
            RGB: function() {
                var input = flatten(arguments),
                    rgbColor = [];
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
                        rgbColor[i] = parseInt(Number(input[i]));

                    }
                }

                for (var i in rgbColor) {
                    if (rgbColor[i] < 0) rgbColor[i] = 0;
                    if (rgbColor[i] > 255) rgbColor[i] = 255;
                };

                var _rgb = {
                    R: rgbColor[0],
                    G: rgbColor[1],
                    B: rgbColor[2],
                };

                return XYZ2LAB(RGB2XYZ(_rgb));
            },
            CMYK: function() {
                var input = flatten(arguments);
                if (input.length < 4) {
                    return false;
                }

                var _cmyk = {
                    C: input[0],
                    M: input[1],
                    Y: input[2],
                    K: input[3],
                };

                return XYZ2LAB(RGB2XYZ(CMYK2RGB(_cmyk)));
            },
        },
        LAB2Color = {
            Lab: function(_lab, mode) {
                mode = String(mode || 0).toLowerCase();
                switch (mode) {
                    case ('0'):
                    case ('function'):
                        return "Lab(" + _lab.L + "," + _lab.a + "," + _lab.b + ")";
                        break;
                    case ('1'):
                    case ('object'):
                        return _lab;
                        break;
                }
            },
            RGB: function(_lab, mode) {
                mode = String(mode || 0).toLowerCase();

                var _rgb = XYZ2RGB(LAB2XYZ(_lab)),
                    aColor = [
                        _rgb.R,
                        _rgb.G,
                        _rgb.B,
                    ];

                for (var i in aColor) {
                    aColor[i] = Math.round(Number(aColor[i]));
                    if (aColor[i] < 0) aColor[i] = 0;
                    if (aColor[i] > 255) aColor[i] = 255;
                };
                switch (mode) {
                    case ('0'):
                    case ('hex'):
                        var strHex = "";
                        for (var i = 0; i < aColor.length; i++) {
                            var hex = aColor[i].toString(16);
                            if (aColor[i] < 16) {
                                hex = "0" + hex;
                            }
                            strHex += hex;
                        }
                        return strHex;
                        break;
                    case ('1'):
                    case ('function'):
                        return "RGB(" + aColor.join(",") + ")";
                        break;
                    case ('2'):
                    case ('object'):
                        return {
                            R: aColor[0],
                            G: aColor[1],
                            B: aColor[2],
                        };
                        break;
                }
            },
            CMYK: function(_lab, mode) {
                mode = String(mode || 0).toLowerCase();

                var _cmyk = RGB2CMYK(XYZ2RGB(LAB2XYZ(_lab)));

                for (var i in _cmyk) {
                    _cmyk[i] = Math.round(Number(_cmyk[i]));
                    if (_cmyk[i] < 0) _cmyk[i] = 0;
                    if (_cmyk[i] > 100) _cmyk[i] = 100;
                };

                switch (mode) {
                    case ('0'):
                    case ('function'):
                        return "CMYK(" + _cmyk.C + "," + _cmyk.M + "," + _cmyk.Y + "," + _cmyk.K + ")";
                        break;
                    case ('1'):
                    case ('object'):
                        return _cmyk;
                        break;
                }
            },
        };

    function ColorConverter() {
        var self = this;
        self.colors = [];
    };

    ColorConverter.prototype = {
        constructor: ColorConverter,

        /*Import colors*/
        import: function() {
            var argu = flatten(arguments),
                output = [],
                self = this;
            self.colors = [];
            argu.forEach(function(code) {
                var res = eval("(Color2LAB." + code + ")");
                self.colors.push(res);
                output.push(!!res);
            });
            return output;
        },

        export: function() {
            var argu = flatten(arguments),
                output = [],
                self = this;
            self.colors.forEach(function(code) {
                output.push(eval("(LAB2Color." + (argu[0] || "RGB") + "(" + JSON.stringify(code) + ",'" + (argu[1] || 0) + "'))"));
            })
            return output;
        },

        push: function() {
            var argu = flatten([arguments]),
                output = [],
                self = this,
                res = eval("(Color2LAB." + argu[0] + ")");
            self.colors.push(res);
            return !!res;
        },

    }

    window.ColorConverter = ColorConverter;

})(window, document);
