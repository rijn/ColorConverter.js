;
(function() {

    function require(path, parent, orig) {
        var resolved = require.resolve(path);

        // lookup failed
        if (null == resolved) {
            orig = orig || path;
            parent = parent || 'root';
            var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
            err.path = orig;
            err.parent = parent;
            err.require = true;
            throw err;
        }

        var module = require.modules[resolved];

        // perform real require()
        // by invoking the module's
        // registered function
        if (!module._resolving && !module.exports) {
            var mod = {};
            mod.exports = {};
            mod.client = mod.component = true;
            module._resolving = true;
            module.call(this, mod.exports, require.relative(resolved), mod);
            delete module._resolving;
            module.exports = mod.exports;
        }

        return module.exports;
    }

    /**
     * Registered modules.
     */

    require.modules = {};

    /**
     * Registered aliases.
     */

    require.aliases = {};

    require.resolve = function(path) {
        if (path.charAt(0) === '/') path = path.slice(1);

        var paths = [
            path,
            path + '.js',
            path + '.json',
            path + '/index.js',
            path + '/index.json'
        ];

        for (var i = 0; i < paths.length; i++) {
            var path = paths[i];
            if (require.modules.hasOwnProperty(path)) return path;
            if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
        }
    };

    /**
     * Normalize `path` relative to the current path.
     *
     * @param {String} curr
     * @param {String} path
     * @return {String}
     * @api private
     */

    require.normalize = function(curr, path) {
        var segs = [];

        if ('.' != path.charAt(0)) return path;

        curr = curr.split('/');
        path = path.split('/');

        for (var i = 0; i < path.length; ++i) {
            if ('..' == path[i]) {
                curr.pop();
            } else if ('.' != path[i] && '' != path[i]) {
                segs.push(path[i]);
            }
        }

        return curr.concat(segs).join('/');
    };

    /**
     * Register module at `path` with callback `definition`.
     *
     * @param {String} path
     * @param {Function} definition
     * @api private
     */

    require.register = function(path, definition) {
        require.modules[path] = definition;
    };

    /**
     * Alias a module definition.
     *
     * @param {String} from
     * @param {String} to
     * @api private
     */

    require.alias = function(from, to) {
        if (!require.modules.hasOwnProperty(from)) {
            throw new Error('Failed to alias "' + from + '", it does not exist');
        }
        require.aliases[to] = from;
    };

    /**
     * Return a require function relative to the `parent` path.
     *
     * @param {String} parent
     * @return {Function}
     * @api private
     */

    require.relative = function(parent) {
        var p = require.normalize(parent, '..');

        /**
         * lastIndexOf helper.
         */

        function lastIndexOf(arr, obj) {
            var i = arr.length;
            while (i--) {
                if (arr[i] === obj) return i;
            }
            return -1;
        }

        /**
         * The relative require() itself.
         */

        function localRequire(path) {
            var resolved = localRequire.resolve(path);
            return require(resolved, parent, path);
        }

        /**
         * Resolve relative to the parent.
         */

        localRequire.resolve = function(path) {
            var c = path.charAt(0);
            if ('/' == c) return path.slice(1);
            if ('.' == c) return require.normalize(p, path);

            // resolve deps by returning
            // the dep in the nearest "deps"
            // directory
            var segs = parent.split('/');
            var i = lastIndexOf(segs, 'deps') + 1;
            if (!i) i = 0;
            path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
            return path;
        };

        /**
         * Check if module is defined at `path`.
         */

        localRequire.exists = function(path) {
            return require.modules.hasOwnProperty(localRequire.resolve(path));
        };

        return localRequire;
    };

    require.register("colorconverter/colorconverter.js", function(exports, require, module) {

        /* Expose `ColorConverter` */

        module.exports = ColorConverter;

        var defaults = {

        };

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
            if (this instanceof String) return this;
            if (typeof(this) != 'object') return this;
            if (this == null) return this;
            var newObj = this instanceof Array ? new Array() : new Object();

            for (var i in this)
                newObj[i] = this[i].clone();
            return newObj;
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
                RGB: {
                    XYZ: {
                        convert: function(_rgb) {
                            return {
                                X: (_rgb.B * 199049 + _rgb.G * 394494 + _rgb.R * 455033 + 524288) >> 20,
                                Y: (_rgb.B * 75675 + _rgb.G * 749900 + _rgb.R * 223002 + 524288) >> 20,
                                Z: (_rgb.B * 915161 + _rgb.G * 114795 + _rgb.R * 18621 + 524288) >> 20,
                            };
                        },
                        cost: 1,
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
                CMYK: {
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
                    RGB: {
                        convert: function(_xyz) {
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
                        cost: 1,
                    },
                    Lab: {
                        convert: function(_xyz) {
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
                        cost: 1,
                    },
                },
                Lab: {
                    XYZ: {
                        convert: function(_lab) {
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
                        cost: 1,
                    },
                    import: function() {
                        var input = flatten(arguments);
                        if (input.length < 3) {
                            return false;
                        }

                        var _lab = {
                            L: input[0],
                            a: input[1],
                            b: input[2],
                        };

                        return {
                            Lab: _lab,
                        };
                    },
                },
            },
            /* import color from string */
            ImportProcessor = {
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

                    return {
                        Lab: _lab,
                    };
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

                    return {
                        RGB: _rgb,
                    };
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

                    return {
                        CMYK: _cmyk,
                    }
                },
                HSL: function() {
                    var input = flatten(arguments);
                    if (input.length < 3) {
                        return false;
                    }

                    return {
                        HSL: {
                            H: input[0],
                            S: input[1],
                            L: input[2],
                        },
                    };
                },
                HSV: function() {
                    var input = flatten(arguments);
                    if (input.length < 3) {
                        return false;
                    }

                    return {
                        HSV: {
                            H: input[0],
                            S: input[1],
                            V: input[2],
                        },
                    }
                },
            };

        function ColorConverter(element, options) {
            if (!(this instanceof ColorConverter)) return new ColorConverter(element, options);

            this.element = element;
            this.options = options || {};

            for (var i in defaults) {
                if (this.options[i] == null) {
                    this.options[i] = defaults[i];
                }
            }

            this.colors = [];
        }

        ColorConverter.prototype = {

            constructor: ColorConverter,

            import: function() {
                var argu = flatten(arguments),
                    output = [],
                    self = this;

                argu.forEach(function(code) {
                    var res = eval("(spaces." + code + ".import)");
                    if (!!res) {
                        self.colors.push(res);
                        output.push(self.colors.length - 1);
                    } else {
                        output.push(false);
                    }
                });

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
                        }
                    }
                };

                list.forEach(function(_i) {

                    var _code = self.colors[_i];

                    if (_code === undefined) throw Error("Undefined color");

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
                                    if (!tokens[key]._terminal) return false;
                                }
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
                                            }

                                            _deplicate.push(_temp);
                                        }
                                    }

                                    _obj = null;

                                }
                            }
                        };

                        _tokens = _deplicate;
                        _deplicate = null;

                        _depth++;
                    };

                    var _sort = [];

                    for (var key in _tokens) {
                        if (_tokens.hasOwnProperty(key) && _tokens[key]._path.getLast() == _target) {
                            _sort.push(_tokens[key]);
                        };
                    };

                    _sort.sort(function(a, b) {
                        return a.cost > b.cost ? -1 : 1;
                    });

                    var _rp = _sort[0]._path,
                        _temp = eval("(_code." + _rp[0] + ")");

                    for (var i = 1; i < _rp.length; i++) {
                        _temp = eval("(spaces." + _rp[i - 1] + "." + _rp[i] + ".convert(" + JSON.stringify(_temp) + "))");
                    }

                    output.push(_temp);

                })
                return output;
            },

            reset: function() {
                var self = this;
                self.colors = [];
                return true;
            },

        }

    });

    require.alias("colorconverter/colorconverter.js", "colorconverter/index.js");
    if (typeof exports == "object") {
        module.exports = require("colorconverter");
    } else if (typeof define == "function" && define.amd) {
        define(function() {
            return require("colorconverter");
        });
    } else {
        this["ColorConverter"] = require("colorconverter");
    }
})();