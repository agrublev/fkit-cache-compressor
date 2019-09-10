const { JSONC, LZString } = require("./compress.js");
const lscache = require("lscache");
const prettyBytes = (num, precision = 3, addSpace = true) => {
  const UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  if (Math.abs(num) < 1) return num + (addSpace ? " " : "") + UNITS[0];
  const exponent = Math.min(
    Math.floor(Math.log10(num < 0 ? -num : num) / 3),
    UNITS.length - 1
  );
  const n = Number(
    ((num < 0 ? -num : num) / 1000 ** exponent).toPrecision(precision)
  );
  return (num < 0 ? "-" : "") + n + (addSpace ? " " : "") + UNITS[exponent];
};

const round = (n, decimals = 0) =>
  Number(`${Math.round(`${n}e${decimals}`)}e-${decimals}`);
let json = require("./sample.json");

const timeTaken = callback => {
  const ss = Date.now();
  const r = callback();
  const sd = Date.now();
  // console.warn(`Time taken ${round((sd - ss) / 1000, 2)}`);
  return [r, `Time taken ${round((sd - ss) / 1000, 2)}s`];
};
console.warn("-- Console ", JSON.stringify(json).length);
const compressedJSON = JSONC.compress(json);
const compressedJSONstring = JSON.stringify(compressedJSON);
console.warn("-- Console ", compressedJSONstring.length);
const ret = LZString.compress(compressedJSONstring);
console.warn(ret.length);
// lscache.set('response', '...', 2);
// lscache.setBucket('lib');
// lscache.set('path', '...', 2);
// lscache.flush(); //only removes 'path' which was set in the lib bucket
// export default class fkCompressor {
//   constructor(
//     options = {
//       /**
//        * Show development stats
//        */
//       dev: true,
//       /**
//        * Expire cache after
//        */
//       expiresAfterSeconds: 300
//     }
//   ) {
//     this.dev = options.dev;
//     var expiryMilliseconds = options.expiresAfterSeconds * 1000; //time units is seconds
//     lscache.setExpiryMilliseconds(expiryMilliseconds);
//   }
//   _compress = json => {
//     const compressedJSON = JSONC.compress(json);
//     const compressedJSONstring = JSON.stringify(compressedJSON);
//     return LZString.compress(compressedJSONstring);
//   };
//   _decompress = json => {
//     let comJson = LZString.decompress(json);
//     let decj = {};
//     try {
//       decj = JSON.parse(comJson);
//     } catch (e) {
//       console.warn("-- Console som", 52);
//     }
//     const decJson = JSONC.decompress(decj);
//     return decJson;
//   };
//   /**
//    * Compress json
//    * @param json
//    * @returns {Promise<unknown>}
//    */
//   compress = json => {
//     return new Promise(resolve => {
//       let original = JSON.stringify(json).length;
//
//       const compressed = timeTaken(() => this._compress(json));
//       let comp = this._compress(json);
//       let compressedS = JSON.stringify(comp).length;
//
//       if (this.dev) {
//         // log("**ASD** sad as_ASDASD_ iasd  `<sciprt>SRC</sciprt>`");
//         // log('this is red[c]');
//         // log(
//         //   `turn off dev by passing fkCompressor({dev:false})
//         // [c="background:#222930; color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"]${time}[c]
//         //
//         // [c="background:#222930;color: #ec530d;font-weight:300;border-bottom:1px solid #87a7c7; font-size:16px;line-height:20px"]Before compression size:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"]${prettyBytes(
//         //             original
//         //           )}[c]
//         //
//         // [c="background:#222930;color: #ec530d;border-bottom:1px solid #87a7c7;font-weight:300;font-size:16px;line-height:20px"]After compression:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"] ${prettyBytes(
//         //             compressedS
//         //           )}[c]
//         //
//         // [c="background:#222930;color: #ec530d;border-bottom:1px solid #87a7c7;font-weight:300;font-size:16px;line-height:20px"]Difference:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"] ${prettyBytes(
//         //             original - compressedS
//         //           )}[c]
//         //
//         // [c="background:#222930;color: #ec530d;border-bottom:1px solid #87a7c7;font-weight:300;font-size:16px;line-height:20px"]Approximately:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"] ${round(
//         //             ((original - compressedS) / original) * 100,
//         //             2
//         //           )}% [c]
//         //
//         // `
//
//         resolve(comp);
//       } else {
//         resolve(comp);
//       }
//     });
//   };
//   set = async (name = Date.now(), json = {}, exp = 2) => {
//     let self = this;
//     return new Promise(resolve => {
//       lscache.set(name, self._compress(json), exp);
//       resolve();
//     });
//   };
//   /**
//    * Decompress json
//    * @param json
//    * @returns {*}
//    */
//   decompress = json => {
//     return this._decompress(json);
//   };
//   /**
//    * Set an item
//    * @param name
//    * @param json
//    * @param exp
//    * @returns {Promise<unknown>}
//    */
//   set = async (
//     /**
//      * Unique name
//      * @type {string}
//      */
//     name = Date.now() + "",
//     /**
//      * Pass json object
//      * @type {object}
//      */
//     json = {},
//     /**
//      * Expires after minutes
//      * @type {number}
//      */
//     exp = 2
//   ) => {
//     let self = this;
//     return new Promise(resolve => {
//       lscache.set(name, self._compress(json), exp);
//       resolve();
//     });
//   };
//   setBucket = (bucketName = Date.now() + "") => {
//     lscache.setBucket(bucketName);
//   };
//   /**
//    * Clear all data
//    */
//   flush = () => {
//     lscache.flush();
//   };
//   /**
//    * Clear all expired data
//    */
//   flushExpired = () => {
//     lscache.flush();
//   };
//   /**
//    * Get an item
//    * @param name
//    * @returns {Promise<unknown>}
//    */
//   get = async name => {
//     return new Promise(resolve => {
//       let cachd = lscache.get(name);
//       if (cachd) {
//         let deco = this.decompress(cachd);
//         resolve(deco);
//       } else {
//         console.warn("Item expired or doesn't exist");
//         resolve({});
//       }
//     });
//   };
// }
