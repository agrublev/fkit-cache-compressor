export const LZString = (function() {
  function o(o, r) {
    if (!t[o]) {
      t[o] = {};
      for (var n = 0; n < o.length; n++) t[o][o.charAt(n)] = n;
    }
    return t[o][r];
  }
  var r = String.fromCharCode,
    n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
    t = {},
    i = {
      compressToBase64: function(o) {
        if (null == o) return "";
        var r = i._compress(o, 6, function(o) {
          return n.charAt(o);
        });
        switch (r.length % 4) {
          default:
          case 0:
            return r;
          case 1:
            return r + "===";
          case 2:
            return r + "==";
          case 3:
            return r + "=";
        }
      },
      decompressFromBase64: function(r) {
        return null == r
          ? ""
          : "" == r
          ? null
          : i._decompress(r.length, 32, function(e) {
              return o(n, r.charAt(e));
            });
      },
      compressToUTF16: function(o) {
        return null == o
          ? ""
          : i._compress(o, 15, function(o) {
              return r(o + 32);
            }) + " ";
      },
      decompressFromUTF16: function(o) {
        return null == o
          ? ""
          : "" == o
          ? null
          : i._decompress(o.length, 16384, function(r) {
              return o.charCodeAt(r) - 32;
            });
      },
      compressToUint8Array: function(o) {
        for (
          var r = i.compress(o),
            n = new Uint8Array(2 * r.length),
            e = 0,
            t = r.length;
          t > e;
          e++
        ) {
          var s = r.charCodeAt(e);
          (n[2 * e] = s >>> 8), (n[2 * e + 1] = s % 256);
        }
        return n;
      },
      decompressFromUint8Array: function(o) {
        if (null === o || void 0 === o) return i.decompress(o);
        for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++)
          n[e] = 256 * o[2 * e] + o[2 * e + 1];
        var s = [];
        return (
          n.forEach(function(o) {
            s.push(r(o));
          }),
          i.decompress(s.join(""))
        );
      },
      compressToEncodedURIComponent: function(o) {
        return null == o
          ? ""
          : i._compress(o, 6, function(o) {
              return e.charAt(o);
            });
      },
      decompressFromEncodedURIComponent: function(r) {
        return null == r
          ? ""
          : "" == r
          ? null
          : ((r = r.replace(/ /g, "+")),
            i._decompress(r.length, 32, function(n) {
              return o(e, r.charAt(n));
            }));
      },
      compress: function(o) {
        return i._compress(o, 16, function(o) {
          return r(o);
        });
      },
      _compress: function(o, r, n) {
        if (null == o) return "";
        var e,
          t,
          i,
          s = {},
          p = {},
          u = "",
          c = "",
          a = "",
          l = 2,
          f = 3,
          h = 2,
          d = [],
          m = 0,
          v = 0;
        for (i = 0; i < o.length; i += 1)
          if (
            ((u = o.charAt(i)),
            Object.prototype.hasOwnProperty.call(s, u) ||
              ((s[u] = f++), (p[u] = !0)),
            (c = a + u),
            Object.prototype.hasOwnProperty.call(s, c))
          )
            a = c;
          else {
            if (Object.prototype.hasOwnProperty.call(p, a)) {
              if (a.charCodeAt(0) < 256) {
                for (e = 0; h > e; e++)
                  (m <<= 1),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
                for (t = a.charCodeAt(0), e = 0; 8 > e; e++)
                  (m = (m << 1) | (1 & t)),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                    (t >>= 1);
              } else {
                for (t = 1, e = 0; h > e; e++)
                  (m = (m << 1) | t),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                    (t = 0);
                for (t = a.charCodeAt(0), e = 0; 16 > e; e++)
                  (m = (m << 1) | (1 & t)),
                    v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                    (t >>= 1);
              }
              l--, 0 == l && ((l = Math.pow(2, h)), h++), delete p[a];
            } else
              for (t = s[a], e = 0; h > e; e++)
                (m = (m << 1) | (1 & t)),
                  v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
            l--,
              0 == l && ((l = Math.pow(2, h)), h++),
              (s[c] = f++),
              (a = String(u));
          }
        if ("" !== a) {
          if (Object.prototype.hasOwnProperty.call(p, a)) {
            if (a.charCodeAt(0) < 256) {
              for (e = 0; h > e; e++)
                (m <<= 1), v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++;
              for (t = a.charCodeAt(0), e = 0; 8 > e; e++)
                (m = (m << 1) | (1 & t)),
                  v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
            } else {
              for (t = 1, e = 0; h > e; e++)
                (m = (m << 1) | t),
                  v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t = 0);
              for (t = a.charCodeAt(0), e = 0; 16 > e; e++)
                (m = (m << 1) | (1 & t)),
                  v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                  (t >>= 1);
            }
            l--, 0 == l && ((l = Math.pow(2, h)), h++), delete p[a];
          } else
            for (t = s[a], e = 0; h > e; e++)
              (m = (m << 1) | (1 & t)),
                v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
                (t >>= 1);
          l--, 0 == l && ((l = Math.pow(2, h)), h++);
        }
        for (t = 2, e = 0; h > e; e++)
          (m = (m << 1) | (1 & t)),
            v == r - 1 ? ((v = 0), d.push(n(m)), (m = 0)) : v++,
            (t >>= 1);
        for (;;) {
          if (((m <<= 1), v == r - 1)) {
            d.push(n(m));
            break;
          }
          v++;
        }
        return d.join("");
      },
      decompress: function(o) {
        return null == o
          ? ""
          : "" == o
          ? null
          : i._decompress(o.length, 32768, function(r) {
              return o.charCodeAt(r);
            });
      },
      _decompress: function(o, n, e) {
        var t,
          i,
          s,
          p,
          u,
          c,
          a,
          l,
          f = [],
          h = 4,
          d = 4,
          m = 3,
          v = "",
          w = [],
          A = { val: e(0), position: n, index: 1 };
        for (i = 0; 3 > i; i += 1) f[i] = i;
        for (p = 0, c = Math.pow(2, 2), a = 1; a != c; )
          (u = A.val & A.position),
            (A.position >>= 1),
            0 == A.position && ((A.position = n), (A.val = e(A.index++))),
            (p |= (u > 0 ? 1 : 0) * a),
            (a <<= 1);
        switch ((t = p)) {
          case 0:
            for (p = 0, c = Math.pow(2, 8), a = 1; a != c; )
              (u = A.val & A.position),
                (A.position >>= 1),
                0 == A.position && ((A.position = n), (A.val = e(A.index++))),
                (p |= (u > 0 ? 1 : 0) * a),
                (a <<= 1);
            l = r(p);
            break;
          case 1:
            for (p = 0, c = Math.pow(2, 16), a = 1; a != c; )
              (u = A.val & A.position),
                (A.position >>= 1),
                0 == A.position && ((A.position = n), (A.val = e(A.index++))),
                (p |= (u > 0 ? 1 : 0) * a),
                (a <<= 1);
            l = r(p);
            break;
          case 2:
            return "";
        }
        for (f[3] = l, s = l, w.push(l); ; ) {
          if (A.index > o) return "";
          for (p = 0, c = Math.pow(2, m), a = 1; a != c; )
            (u = A.val & A.position),
              (A.position >>= 1),
              0 == A.position && ((A.position = n), (A.val = e(A.index++))),
              (p |= (u > 0 ? 1 : 0) * a),
              (a <<= 1);
          switch ((l = p)) {
            case 0:
              for (p = 0, c = Math.pow(2, 8), a = 1; a != c; )
                (u = A.val & A.position),
                  (A.position >>= 1),
                  0 == A.position && ((A.position = n), (A.val = e(A.index++))),
                  (p |= (u > 0 ? 1 : 0) * a),
                  (a <<= 1);
              (f[d++] = r(p)), (l = d - 1), h--;
              break;
            case 1:
              for (p = 0, c = Math.pow(2, 16), a = 1; a != c; )
                (u = A.val & A.position),
                  (A.position >>= 1),
                  0 == A.position && ((A.position = n), (A.val = e(A.index++))),
                  (p |= (u > 0 ? 1 : 0) * a),
                  (a <<= 1);
              (f[d++] = r(p)), (l = d - 1), h--;
              break;
            case 2:
              return w.join("");
          }
          if ((0 == h && ((h = Math.pow(2, m)), m++), f[l])) v = f[l];
          else {
            if (l !== d) return null;
            v = s + s.charAt(0);
          }
          w.push(v),
            (f[d++] = s + v.charAt(0)),
            h--,
            (s = v),
            0 == h && ((h = Math.pow(2, m)), m++);
        }
      }
    };
  return i;
})();

let root;
const JSONCB = {};
let _nCode = -1;
let toString = {}.toString;

/**
 * set the correct root depending from the environment.
 * @type {Object}
 * @private
 */
root = this;
/**
 * Check if JSONCB is loaded in Node.js environment
 * @type {Boolean}
 * @private
 */
/**
 * Checks if the value exist in the array.
 * @param arr
 * @param v
 * @returns {boolean}
 */
function contains(arr, v) {
  var nIndex,
    nLen = arr.length;
  for (nIndex = 0; nIndex < nLen; nIndex++) {
    if (arr[nIndex][1] === v) {
      return true;
    }
  }
  return false;
}

/**
 * Removes duplicated values in an array
 * @param oldArray
 * @returns {Array}
 */
function unique(oldArray) {
  var nIndex,
    nLen = oldArray.length,
    aArr = [];
  for (nIndex = 0; nIndex < nLen; nIndex++) {
    if (!contains(aArr, oldArray[nIndex][1])) {
      aArr.push(oldArray[nIndex]);
    }
  }
  return aArr;
}

/**
 * Escapes a RegExp
 * @param text
 * @returns {*}
 */
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
}

/**
 * Returns if the obj is an object or not.
 * @param obj
 * @returns {boolean}
 * @private
 */
function _isObject(obj) {
  return toString.call(obj) === "[object Object]";
}

/**
 * Returns if the obj is an array or not
 * @param obj
 * @returns {boolean}
 * @private
 */
function _isArray(obj) {
  return toString.call(obj) === "[object Array]";
}

/**
 * Converts a bidimensional array to object
 * @param aArr
 * @returns {{}}
 * @private
 */
function _biDimensionalArrayToObject(aArr) {
  var obj = {},
    nIndex,
    nLen = aArr.length,
    oItem;
  for (nIndex = 0; nIndex < nLen; nIndex++) {
    oItem = aArr[nIndex];
    obj[oItem[0]] = oItem[1];
  }
  return obj;
}

/**
 * Convert a number to their ascii code/s.
 * @param index
 * @param totalChar
 * @param offset
 * @returns {Array}
 * @private
 */
function _numberToKey(index, totalChar, offset) {
  var sKeys =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=_!?()*",
    aArr = [],
    currentChar = index;
  totalChar = totalChar || sKeys.length;
  offset = offset || 0;
  while (currentChar >= totalChar) {
    aArr.push(sKeys.charCodeAt((currentChar % totalChar) + offset));
    currentChar = Math.floor(currentChar / totalChar - 1);
  }
  aArr.push(sKeys.charCodeAt(currentChar + offset));
  return aArr.reverse();
}

/**
 * Returns the string using an array of ASCII values
 * @param aKeys
 * @returns {string}
 * @private
 */
function _getSpecialKey(aKeys) {
  return String.fromCharCode.apply(String, aKeys);
}

/**
 * Traverse all the objects looking for keys and set an array with the new keys
 * @param json
 * @param aKeys
 * @returns {*}
 * @private
 */
function _getKeys(json, aKeys) {
  var aKey, sKey, oItem;

  for (sKey in json) {
    if (json.hasOwnProperty(sKey)) {
      oItem = json[sKey];
      if (_isObject(oItem) || _isArray(oItem)) {
        aKeys = aKeys.concat(unique(_getKeys(oItem, aKeys)));
      }
      if (isNaN(Number(sKey))) {
        if (!contains(aKeys, sKey)) {
          _nCode += 1;
          aKey = [];
          aKey.push(_getSpecialKey(_numberToKey(_nCode)), sKey);
          aKeys.push(aKey);
        }
      }
    }
  }
  return aKeys;
}

/**
 * Method to compress array objects
 * @private
 * @param json
 * @param aKeys
 */
function _compressArray(json, aKeys) {
  var nIndex, nLenKeys;

  for (nIndex = 0, nLenKeys = json.length; nIndex < nLenKeys; nIndex++) {
    json[nIndex] = JSONCB.compress(json[nIndex], aKeys);
  }
}

/**
 * Method to compress anything but array
 * @private
 * @param json
 * @param aKeys
 * @returns {*}
 */
function _compressOther(json, aKeys) {
  var oKeys, aKey, str, nLenKeys, nIndex, obj;
  aKeys = _getKeys(json, aKeys);
  aKeys = unique(aKeys);
  oKeys = _biDimensionalArrayToObject(aKeys);

  str = JSON.stringify(json);
  nLenKeys = aKeys.length;

  for (nIndex = 0; nIndex < nLenKeys; nIndex++) {
    aKey = aKeys[nIndex];
    str = str.replace(
      new RegExp(escapeRegExp('"' + aKey[1] + '"'), "g"),
      '"' + aKey[0] + '"'
    );
  }
  obj = JSON.parse(str);
  obj._ = oKeys;
  return obj;
}

/**
 * Method to decompress array objects
 * @private
 * @param json
 */
function _decompressArray(json) {
  var nIndex, nLenKeys;

  for (nIndex = 0, nLenKeys = json.length; nIndex < nLenKeys; nIndex++) {
    json[nIndex] = JSONCB.decompress(json[nIndex]);
  }
}

/**
 * Method to decompress anything but array
 * @private
 * @param jsonCopy
 * @returns {*}
 */
function _decompressOther(jsonCopy) {
  var oKeys, str, sKey;

  oKeys = JSON.parse(JSON.stringify(jsonCopy._));
  delete jsonCopy._;
  str = JSON.stringify(jsonCopy);
  for (sKey in oKeys) {
    if (oKeys.hasOwnProperty(sKey)) {
      str = str.replace(
        new RegExp('"' + sKey + '"', "g"),
        '"' + oKeys[sKey] + '"'
      );
    }
  }
  return str;
}

/**
 * Compress a RAW JSON
 * @param json
 * @param optKeys
 * @returns {*}
 */
JSONCB.compress = function(json, optKeys) {
  if (!optKeys) {
    _nCode = -1;
  }
  var aKeys = optKeys || [],
    obj;

  if (_isArray(json)) {
    _compressArray(json, aKeys);
    obj = json;
  } else {
    obj = _compressOther(json, aKeys);
  }
  return obj;
};
/**
 * Use LZString to get the compressed string.
 * @param json
 * @param bCompress
 * @returns {String}
 */
JSONCB.pack = function(json, bCompress) {
  var str = JSON.stringify(bCompress ? JSONCB.compress(json) : json);
  return Base64.encode(
    String.fromCharCode.apply(String, gzip.zip(str, { level: 9 }))
  );
};
/**
 * Decompress a compressed JSON
 * @param json
 * @returns {*}
 */
JSONCB.decompress = function(json) {
  var str,
    jsonCopy = JSON.parse(JSON.stringify(json));
  if (_isArray(jsonCopy)) {
    _decompressArray(jsonCopy);
  } else {
    str = _decompressOther(jsonCopy);
  }
  return str ? JSON.parse(str) : jsonCopy;
};
function getArr(str) {
  var nIndex = 0,
    nLen = str.length,
    arr = [];
  for (; nIndex < nLen; nIndex++) {
    arr.push(str.charCodeAt(nIndex));
  }
  return arr;
}

/**
 * Returns the JSON object from the LZW string
 * @param gzipped
 * @param bDecompress
 * @returns {Object}
 */
JSONCB.unpack = function(gzipped, bDecompress) {
  var aArr = getArr(Base64.decode(gzipped)),
    str = String.fromCharCode.apply(String, gzip.unzip(aArr, { level: 9 })),
    json = JSON.parse(str);
  return bDecompress ? JSONCB.decompress(json) : json;
};
/*
 * Expose Hydra to be used in node.js, as AMD module or as dashboard
 */
export const JSONC = JSONCB;
