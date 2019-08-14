!function(e,r){"object"==typeof exports&&"object"==typeof module?module.exports=r():"function"==typeof define&&define.amd?define([],r):"object"==typeof exports?exports.fkCompressor=r():e.fkCompressor=r()}(window,function(){return function(e){var r={};function n(t){if(r[t])return r[t].exports;var o=r[t]={i:t,l:!1,exports:{}};return e[t].call(o.exports,o,o.exports,n),o.l=!0,o.exports}return n.m=e,n.c=r,n.d=function(e,r,t){n.o(e,r)||Object.defineProperty(e,r,{enumerable:!0,get:t})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,r){if(1&r&&(e=n(e)),8&r)return e;if(4&r&&"object"==typeof e&&e&&e.__esModule)return e;var t=Object.create(null);if(n.r(t),Object.defineProperty(t,"default",{enumerable:!0,value:e}),2&r&&"string"!=typeof e)for(var o in e)n.d(t,o,function(r){return e[r]}.bind(null,o));return t},n.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(r,"a",r),r},n.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},n.p="",n(n.s=1)}([function(e,r,n){var t,o,i;o=[],void 0===(i="function"==typeof(t=function(){var e,r,n="lscache-",t="-cacheexpiration",o=10,i=6e4,c=O(i),u="",s=!1;function a(){var r="__lscachetest__";if(void 0!==e)return e;try{if(!localStorage)return!1}catch(e){return!1}try{v(r,"__lscachetest__"),m(r),e=!0}catch(r){e=!(!f(r)||!localStorage.length)}return e}function f(e){return e&&("QUOTA_EXCEEDED_ERR"===e.name||"NS_ERROR_DOM_QUOTA_REACHED"===e.name||"QuotaExceededError"===e.name)}function p(){return void 0===r&&(r=null!=window.JSON),r}function l(e){return e+t}function h(){return Math.floor((new Date).getTime()/i)}function d(e){return localStorage.getItem(n+u+e)}function v(e,r){localStorage.removeItem(n+u+e),localStorage.setItem(n+u+e,r)}function m(e){localStorage.removeItem(n+u+e)}function g(e){for(var r=new RegExp("^"+n+u.replace(/[[\]{}()*+?.\\^$|]/g,"\\$&")+"(.*)"),o=localStorage.length-1;o>=0;--o){var i=localStorage.key(o);(i=(i=i&&i.match(r))&&i[1])&&i.indexOf(t)<0&&e(i,l(i))}}function y(e){var r=l(e);m(e),m(r)}function w(e){var r=l(e),n=d(r);if(n){var t=parseInt(n,o);if(h()>=t)return m(e),m(r),!0}}function S(e,r){s&&"console"in window&&"function"==typeof window.console.warn&&(window.console.warn("lscache - "+e),r&&window.console.warn("lscache - The error was: "+r.message))}function O(e){return Math.floor(864e13/e)}return{set:function(e,r,n){if(!a())return!1;if(!p())return!1;try{r=JSON.stringify(r)}catch(e){return!1}try{v(e,r)}catch(n){if(!f(n))return S("Could not add item with key '"+e+"'",n),!1;var t,i=[];g(function(e,r){var n=d(r);n=n?parseInt(n,o):c,i.push({key:e,size:(d(e)||"").length,expiration:n})}),i.sort(function(e,r){return r.expiration-e.expiration});for(var u=(r||"").length;i.length&&u>0;)t=i.pop(),S("Cache is full, removing item with key '"+e+"'"),y(t.key),u-=t.size;try{v(e,r)}catch(r){return S("Could not add item with key '"+e+"', perhaps it's too big?",r),!1}}return n?v(l(e),(h()+n).toString(o)):m(l(e)),!0},get:function(e){if(!a())return null;if(w(e))return null;var r=d(e);if(!r||!p())return r;try{return JSON.parse(r)}catch(e){return r}},remove:function(e){a()&&y(e)},supported:function(){return a()},flush:function(){a()&&g(function(e){y(e)})},flushExpired:function(){a()&&g(function(e){w(e)})},setBucket:function(e){u=e},resetBucket:function(){u=""},getExpiryMilliseconds:function(){return i},setExpiryMilliseconds:function(e){c=O(i=e)},enableWarnings:function(e){s=e}}})?t.apply(r,o):t)||(e.exports=i)},function(e,r,n){"use strict";n.r(r);var t=function(){function e(e,r){if(!o[e]){o[e]={};for(var n=0;n<e.length;n++)o[e][e.charAt(n)]=n}return o[e][r]}var r=String.fromCharCode,n="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",o={},i={compressToBase64:function(e){if(null==e)return"";var r=i._compress(e,6,function(e){return n.charAt(e)});switch(r.length%4){default:case 0:return r;case 1:return r+"===";case 2:return r+"==";case 3:return r+"="}},decompressFromBase64:function(r){return null==r?"":""==r?null:i._decompress(r.length,32,function(t){return e(n,r.charAt(t))})},compressToUTF16:function(e){return null==e?"":i._compress(e,15,function(e){return r(e+32)})+" "},decompressFromUTF16:function(e){return null==e?"":""==e?null:i._decompress(e.length,16384,function(r){return e.charCodeAt(r)-32})},compressToUint8Array:function(e){for(var r=i.compress(e),n=new Uint8Array(2*r.length),t=0,o=r.length;o>t;t++){var c=r.charCodeAt(t);n[2*t]=c>>>8,n[2*t+1]=c%256}return n},decompressFromUint8Array:function(e){if(null==e)return i.decompress(e);for(var n=new Array(e.length/2),t=0,o=n.length;o>t;t++)n[t]=256*e[2*t]+e[2*t+1];var c=[];return n.forEach(function(e){c.push(r(e))}),i.decompress(c.join(""))},compressToEncodedURIComponent:function(e){return null==e?"":i._compress(e,6,function(e){return t.charAt(e)})},decompressFromEncodedURIComponent:function(r){return null==r?"":""==r?null:(r=r.replace(/ /g,"+"),i._decompress(r.length,32,function(n){return e(t,r.charAt(n))}))},compress:function(e){return i._compress(e,16,function(e){return r(e)})},_compress:function(e,r,n){if(null==e)return"";var t,o,i,c={},u={},s="",a="",f="",p=2,l=3,h=2,d=[],v=0,m=0;for(i=0;i<e.length;i+=1)if(s=e.charAt(i),Object.prototype.hasOwnProperty.call(c,s)||(c[s]=l++,u[s]=!0),a=f+s,Object.prototype.hasOwnProperty.call(c,a))f=a;else{if(Object.prototype.hasOwnProperty.call(u,f)){if(f.charCodeAt(0)<256){for(t=0;h>t;t++)v<<=1,m==r-1?(m=0,d.push(n(v)),v=0):m++;for(o=f.charCodeAt(0),t=0;8>t;t++)v=v<<1|1&o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o>>=1}else{for(o=1,t=0;h>t;t++)v=v<<1|o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o=0;for(o=f.charCodeAt(0),t=0;16>t;t++)v=v<<1|1&o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o>>=1}0==--p&&(p=Math.pow(2,h),h++),delete u[f]}else for(o=c[f],t=0;h>t;t++)v=v<<1|1&o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o>>=1;0==--p&&(p=Math.pow(2,h),h++),c[a]=l++,f=String(s)}if(""!==f){if(Object.prototype.hasOwnProperty.call(u,f)){if(f.charCodeAt(0)<256){for(t=0;h>t;t++)v<<=1,m==r-1?(m=0,d.push(n(v)),v=0):m++;for(o=f.charCodeAt(0),t=0;8>t;t++)v=v<<1|1&o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o>>=1}else{for(o=1,t=0;h>t;t++)v=v<<1|o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o=0;for(o=f.charCodeAt(0),t=0;16>t;t++)v=v<<1|1&o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o>>=1}0==--p&&(p=Math.pow(2,h),h++),delete u[f]}else for(o=c[f],t=0;h>t;t++)v=v<<1|1&o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o>>=1;0==--p&&(p=Math.pow(2,h),h++)}for(o=2,t=0;h>t;t++)v=v<<1|1&o,m==r-1?(m=0,d.push(n(v)),v=0):m++,o>>=1;for(;;){if(v<<=1,m==r-1){d.push(n(v));break}m++}return d.join("")},decompress:function(e){return null==e?"":""==e?null:i._decompress(e.length,32768,function(r){return e.charCodeAt(r)})},_decompress:function(e,n,t){var o,i,c,u,s,a,f,p=[],l=4,h=4,d=3,v="",m=[],g={val:t(0),position:n,index:1};for(o=0;3>o;o+=1)p[o]=o;for(c=0,s=Math.pow(2,2),a=1;a!=s;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=t(g.index++)),c|=(u>0?1:0)*a,a<<=1;switch(c){case 0:for(c=0,s=Math.pow(2,8),a=1;a!=s;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=t(g.index++)),c|=(u>0?1:0)*a,a<<=1;f=r(c);break;case 1:for(c=0,s=Math.pow(2,16),a=1;a!=s;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=t(g.index++)),c|=(u>0?1:0)*a,a<<=1;f=r(c);break;case 2:return""}for(p[3]=f,i=f,m.push(f);;){if(g.index>e)return"";for(c=0,s=Math.pow(2,d),a=1;a!=s;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=t(g.index++)),c|=(u>0?1:0)*a,a<<=1;switch(f=c){case 0:for(c=0,s=Math.pow(2,8),a=1;a!=s;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=t(g.index++)),c|=(u>0?1:0)*a,a<<=1;p[h++]=r(c),f=h-1,l--;break;case 1:for(c=0,s=Math.pow(2,16),a=1;a!=s;)u=g.val&g.position,g.position>>=1,0==g.position&&(g.position=n,g.val=t(g.index++)),c|=(u>0?1:0)*a,a<<=1;p[h++]=r(c),f=h-1,l--;break;case 2:return m.join("")}if(0==l&&(l=Math.pow(2,d),d++),p[f])v=p[f];else{if(f!==h)return null;v=i+i.charAt(0)}m.push(v),p[h++]=i+v.charAt(0),i=v,0==--l&&(l=Math.pow(2,d),d++)}}};return i}(),o={},i=-1,c={}.toString;function u(e,r){var n,t=e.length;for(n=0;n<t;n++)if(e[n][1]===r)return!0;return!1}function s(e){var r,n=e.length,t=[];for(r=0;r<n;r++)u(t,e[r][1])||t.push(e[r]);return t}function a(e){return"[object Array]"===c.call(e)}function f(e,r,n){var t="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=_!?()*",o=[],i=e;for(r=r||t.length,n=n||0;i>=r;)o.push(t.charCodeAt(i%r+n)),i=Math.floor(i/r-1);return o.push(t.charCodeAt(i+n)),o.reverse()}function p(e){return String.fromCharCode.apply(String,e)}function l(e,r){var n,t,o,l,h,d;for(r=function e(r,n){var t,o,l,h;for(o in r)r.hasOwnProperty(o)&&(l=r[o],h=l,("[object Object]"===c.call(h)||a(l))&&(n=n.concat(s(e(l,n)))),isNaN(Number(o))&&(u(n,o)||((t=[]).push(p(f(i+=1)),o),n.push(t))));return n}(e,r),n=function(e){var r,n,t={},o=e.length;for(r=0;r<o;r++)t[(n=e[r])[0]]=n[1];return t}(r=s(r)),o=JSON.stringify(e),l=r.length,h=0;h<l;h++)t=r[h],o=o.replace(new RegExp(('"'+t[1]+'"').replace(/[-[\]{}()*+?.,\\^$|#\s]/g,"\\$&"),"g"),'"'+t[0]+'"');return(d=JSON.parse(o))._=n,d}o.compress=function(e,r){r||(i=-1);var n,t=r||[];return a(e)?(!function(e,r){var n,t;for(n=0,t=e.length;n<t;n++)e[n]=o.compress(e[n],r)}(e,t),n=e):n=l(e,t),n},o.pack=function(e,r){var n=JSON.stringify(r?o.compress(e):e);return Base64.encode(String.fromCharCode.apply(String,gzip.zip(n,{level:9})))},o.decompress=function(e){var r,n=JSON.parse(JSON.stringify(e));return a(n)?function(e){var r,n;for(r=0,n=e.length;r<n;r++)e[r]=o.decompress(e[r])}(n):r=function(e){var r,n,t;for(t in r=JSON.parse(JSON.stringify(e._)),delete e._,n=JSON.stringify(e),r)r.hasOwnProperty(t)&&(n=n.replace(new RegExp('"'+t+'"',"g"),'"'+r[t]+'"'));return n}(n),r?JSON.parse(r):n},o.unpack=function(e,r){var n=function(e){for(var r=0,n=e.length,t=[];r<n;r++)t.push(e.charCodeAt(r));return t}(Base64.decode(e)),t=String.fromCharCode.apply(String,gzip.unzip(n,{level:9})),i=JSON.parse(t);return r?o.decompress(i):i};var h=o,d=n(0),v=n.n(d);n.d(r,"fkCompressor",function(){return x});var m=void 0;function g(e,r,n,t,o,i,c){try{var u=e[i](c),s=u.value}catch(e){return void n(e)}u.done?r(s):Promise.resolve(s).then(t,o)}function y(e){return function(){var r=this,n=arguments;return new Promise(function(t,o){var i=e.apply(r,n);function c(e){g(i,t,o,c,u,"next",e)}function u(e){g(i,t,o,c,u,"throw",e)}c(void 0)})}}var w,S,O=function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0;return Number("".concat(Math.round("".concat(e,"e").concat(r)),"e-").concat(r))},x={init:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{dev:!0,expiresAfterSeconds:300};m.dev=e.dev;var r=1e3*e.expiresAfterSeconds;v.a.setExpiryMilliseconds(r)},_compress:function(e){var r=h.compress(e),n=JSON.stringify(r);return t.compress(n)},_decompress:function(e){var r=t.decompress(e),n={};try{n=JSON.parse(r)}catch(e){console.warn("-- Console som",52)}return h.decompress(n)},compress:function(e){return new Promise(function(r){JSON.stringify(e).length,n=function(){return m._compress(e)},t=Date.now(),o=n(),i=Date.now(),"Time taken ".concat(O((i-t)/1e3,2),"s");var n,t,o,i,c=m._compress(e);JSON.stringify(c).length;m.dev,r(c)})},decompress:function(e){return m._decompress(e)},set:(S=y(regeneratorRuntime.mark(function e(){var r,n,t,o,i=arguments;return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return r=i.length>0&&void 0!==i[0]?i[0]:Date.now()+"",n=i.length>1&&void 0!==i[1]?i[1]:{},t=i.length>2&&void 0!==i[2]?i[2]:2,o=m,e.abrupt("return",new Promise(function(e){v.a.set(r,o._compress(n),t),e()}));case 5:case"end":return e.stop()}},e)})),function(){return S.apply(this,arguments)}),setBucket:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:Date.now()+"";v.a.setBucket(e)},flush:function(){v.a.flush()},flushExpired:function(){v.a.flush()},get:(w=y(regeneratorRuntime.mark(function e(r){return regeneratorRuntime.wrap(function(e){for(;;)switch(e.prev=e.next){case 0:return e.abrupt("return",new Promise(function(e){var n=v.a.get(r);n?e(m.decompress(n)):(console.warn("Item expired or doesn't exist"),e({}))}));case 1:case"end":return e.stop()}},e)})),function(e){return w.apply(this,arguments)})}}])});