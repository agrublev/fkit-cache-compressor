// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"node_modules/regenerator-runtime/runtime.js":[function(require,module,exports) {
var global = arguments[3];
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

!(function(global) {
  "use strict";

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  var inModule = typeof module === "object";
  var runtime = global.regeneratorRuntime;
  if (runtime) {
    if (inModule) {
      // If regeneratorRuntime is defined globally and we're in a module,
      // make the exports object identical to regeneratorRuntime.
      module.exports = runtime;
    }
    // Don't bother evaluating the rest of this file if the runtime was
    // already defined globally.
    return;
  }

  // Define the runtime globally (as expected by generated code) as either
  // module.exports (if we're in a module) or a new, empty object.
  runtime = global.regeneratorRuntime = inModule ? module.exports : {};

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  runtime.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  IteratorPrototype[iteratorSymbol] = function () {
    return this;
  };

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = Gp.constructor = GeneratorFunctionPrototype;
  GeneratorFunctionPrototype.constructor = GeneratorFunction;
  GeneratorFunctionPrototype[toStringTagSymbol] =
    GeneratorFunction.displayName = "GeneratorFunction";

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      prototype[method] = function(arg) {
        return this._invoke(method, arg);
      };
    });
  }

  runtime.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  runtime.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      if (!(toStringTagSymbol in genFun)) {
        genFun[toStringTagSymbol] = "GeneratorFunction";
      }
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  runtime.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return Promise.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return Promise.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration. If the Promise is rejected, however, the
          // result for this iteration will be rejected with the same
          // reason. Note that rejections of yielded Promises are not
          // thrown back into the generator function, as is the case
          // when an awaited Promise is rejected. This difference in
          // behavior between yield and await is important, because it
          // allows the consumer to decide what to do with the yielded
          // rejection (swallow it and continue, manually .throw it back
          // into the generator, abandon iteration, whatever). With
          // await, by contrast, there is no opportunity to examine the
          // rejection reason outside the generator function, so the
          // only option is to throw it from the await expression, and
          // let the generator function handle the exception.
          result.value = unwrapped;
          resolve(result);
        }, reject);
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new Promise(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  AsyncIterator.prototype[asyncIteratorSymbol] = function () {
    return this;
  };
  runtime.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  runtime.async = function(innerFn, outerFn, self, tryLocsList) {
    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList)
    );

    return runtime.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        if (delegate.iterator.return) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  Gp[toStringTagSymbol] = "Generator";

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  Gp[iteratorSymbol] = function() {
    return this;
  };

  Gp.toString = function() {
    return "[object Generator]";
  };

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  runtime.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  runtime.values = values;

  function doneResult() {
    return { value: undefined, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined;
      }

      return ContinueSentinel;
    }
  };
})(
  // In sloppy mode, unbound `this` refers to the global object, fallback to
  // Function constructor if we're in global strict mode. That is sadly a form
  // of indirect eval which violates Content Security Policy.
  (function() { return this })() || Function("return this")()
);

},{}],"node_modules/regenerator-runtime/runtime-module.js":[function(require,module,exports) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

// This method of obtaining a reference to the global object needs to be
// kept identical to the way it is obtained in runtime.js
var g = (function() { return this })() || Function("return this")();

// Use `getOwnPropertyNames` because not all browsers support calling
// `hasOwnProperty` on the global `self` object in a worker. See #183.
var hadRuntime = g.regeneratorRuntime &&
  Object.getOwnPropertyNames(g).indexOf("regeneratorRuntime") >= 0;

// Save the old regeneratorRuntime in case it needs to be restored later.
var oldRuntime = hadRuntime && g.regeneratorRuntime;

// Force reevalutation of runtime.js.
g.regeneratorRuntime = undefined;

module.exports = require("./runtime");

if (hadRuntime) {
  // Restore the original runtime.
  g.regeneratorRuntime = oldRuntime;
} else {
  // Remove the global property added by runtime.js.
  try {
    delete g.regeneratorRuntime;
  } catch(e) {
    g.regeneratorRuntime = undefined;
  }
}

},{"./runtime":"node_modules/regenerator-runtime/runtime.js"}],"node_modules/@babel/runtime/regenerator/index.js":[function(require,module,exports) {
module.exports = require("regenerator-runtime");

},{"regenerator-runtime":"node_modules/regenerator-runtime/runtime-module.js"}],"node_modules/core-js/library/modules/es6.object.to-string.js":[function(require,module,exports) {

},{}],"node_modules/core-js/library/modules/_to-integer.js":[function(require,module,exports) {
// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};

},{}],"node_modules/core-js/library/modules/_defined.js":[function(require,module,exports) {
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};

},{}],"node_modules/core-js/library/modules/_string-at.js":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var defined = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};

},{"./_to-integer":"node_modules/core-js/library/modules/_to-integer.js","./_defined":"node_modules/core-js/library/modules/_defined.js"}],"node_modules/core-js/library/modules/_library.js":[function(require,module,exports) {
module.exports = true;

},{}],"node_modules/core-js/library/modules/_global.js":[function(require,module,exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef

},{}],"node_modules/core-js/library/modules/_core.js":[function(require,module,exports) {
var core = module.exports = { version: '2.6.9' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef

},{}],"node_modules/core-js/library/modules/_a-function.js":[function(require,module,exports) {
module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};

},{}],"node_modules/core-js/library/modules/_ctx.js":[function(require,module,exports) {
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};

},{"./_a-function":"node_modules/core-js/library/modules/_a-function.js"}],"node_modules/core-js/library/modules/_is-object.js":[function(require,module,exports) {
module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};

},{}],"node_modules/core-js/library/modules/_an-object.js":[function(require,module,exports) {
var isObject = require('./_is-object');
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};

},{"./_is-object":"node_modules/core-js/library/modules/_is-object.js"}],"node_modules/core-js/library/modules/_fails.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};

},{}],"node_modules/core-js/library/modules/_descriptors.js":[function(require,module,exports) {
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_fails":"node_modules/core-js/library/modules/_fails.js"}],"node_modules/core-js/library/modules/_dom-create.js":[function(require,module,exports) {
var isObject = require('./_is-object');
var document = require('./_global').document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};

},{"./_is-object":"node_modules/core-js/library/modules/_is-object.js","./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_ie8-dom-define.js":[function(require,module,exports) {
module.exports = !require('./_descriptors') && !require('./_fails')(function () {
  return Object.defineProperty(require('./_dom-create')('div'), 'a', { get: function () { return 7; } }).a != 7;
});

},{"./_descriptors":"node_modules/core-js/library/modules/_descriptors.js","./_fails":"node_modules/core-js/library/modules/_fails.js","./_dom-create":"node_modules/core-js/library/modules/_dom-create.js"}],"node_modules/core-js/library/modules/_to-primitive.js":[function(require,module,exports) {
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};

},{"./_is-object":"node_modules/core-js/library/modules/_is-object.js"}],"node_modules/core-js/library/modules/_object-dp.js":[function(require,module,exports) {
var anObject = require('./_an-object');
var IE8_DOM_DEFINE = require('./_ie8-dom-define');
var toPrimitive = require('./_to-primitive');
var dP = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_ie8-dom-define":"node_modules/core-js/library/modules/_ie8-dom-define.js","./_to-primitive":"node_modules/core-js/library/modules/_to-primitive.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js"}],"node_modules/core-js/library/modules/_property-desc.js":[function(require,module,exports) {
module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};

},{}],"node_modules/core-js/library/modules/_hide.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};

},{"./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_property-desc":"node_modules/core-js/library/modules/_property-desc.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js"}],"node_modules/core-js/library/modules/_has.js":[function(require,module,exports) {
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};

},{}],"node_modules/core-js/library/modules/_export.js":[function(require,module,exports) {

var global = require('./_global');
var core = require('./_core');
var ctx = require('./_ctx');
var hide = require('./_hide');
var has = require('./_has');
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;

},{"./_global":"node_modules/core-js/library/modules/_global.js","./_core":"node_modules/core-js/library/modules/_core.js","./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_has":"node_modules/core-js/library/modules/_has.js"}],"node_modules/core-js/library/modules/_redefine.js":[function(require,module,exports) {
module.exports = require('./_hide');

},{"./_hide":"node_modules/core-js/library/modules/_hide.js"}],"node_modules/core-js/library/modules/_iterators.js":[function(require,module,exports) {
module.exports = {};

},{}],"node_modules/core-js/library/modules/_cof.js":[function(require,module,exports) {
var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};

},{}],"node_modules/core-js/library/modules/_iobject.js":[function(require,module,exports) {
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};

},{"./_cof":"node_modules/core-js/library/modules/_cof.js"}],"node_modules/core-js/library/modules/_to-iobject.js":[function(require,module,exports) {
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject');
var defined = require('./_defined');
module.exports = function (it) {
  return IObject(defined(it));
};

},{"./_iobject":"node_modules/core-js/library/modules/_iobject.js","./_defined":"node_modules/core-js/library/modules/_defined.js"}],"node_modules/core-js/library/modules/_to-length.js":[function(require,module,exports) {
// 7.1.15 ToLength
var toInteger = require('./_to-integer');
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};

},{"./_to-integer":"node_modules/core-js/library/modules/_to-integer.js"}],"node_modules/core-js/library/modules/_to-absolute-index.js":[function(require,module,exports) {
var toInteger = require('./_to-integer');
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};

},{"./_to-integer":"node_modules/core-js/library/modules/_to-integer.js"}],"node_modules/core-js/library/modules/_array-includes.js":[function(require,module,exports) {
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject');
var toLength = require('./_to-length');
var toAbsoluteIndex = require('./_to-absolute-index');
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};

},{"./_to-iobject":"node_modules/core-js/library/modules/_to-iobject.js","./_to-length":"node_modules/core-js/library/modules/_to-length.js","./_to-absolute-index":"node_modules/core-js/library/modules/_to-absolute-index.js"}],"node_modules/core-js/library/modules/_shared.js":[function(require,module,exports) {

var core = require('./_core');
var global = require('./_global');
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: require('./_library') ? 'pure' : 'global',
  copyright: '© 2019 Denis Pushkarev (zloirock.ru)'
});

},{"./_core":"node_modules/core-js/library/modules/_core.js","./_global":"node_modules/core-js/library/modules/_global.js","./_library":"node_modules/core-js/library/modules/_library.js"}],"node_modules/core-js/library/modules/_uid.js":[function(require,module,exports) {
var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};

},{}],"node_modules/core-js/library/modules/_shared-key.js":[function(require,module,exports) {
var shared = require('./_shared')('keys');
var uid = require('./_uid');
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};

},{"./_shared":"node_modules/core-js/library/modules/_shared.js","./_uid":"node_modules/core-js/library/modules/_uid.js"}],"node_modules/core-js/library/modules/_object-keys-internal.js":[function(require,module,exports) {
var has = require('./_has');
var toIObject = require('./_to-iobject');
var arrayIndexOf = require('./_array-includes')(false);
var IE_PROTO = require('./_shared-key')('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};

},{"./_has":"node_modules/core-js/library/modules/_has.js","./_to-iobject":"node_modules/core-js/library/modules/_to-iobject.js","./_array-includes":"node_modules/core-js/library/modules/_array-includes.js","./_shared-key":"node_modules/core-js/library/modules/_shared-key.js"}],"node_modules/core-js/library/modules/_enum-bug-keys.js":[function(require,module,exports) {
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');

},{}],"node_modules/core-js/library/modules/_object-keys.js":[function(require,module,exports) {
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = require('./_object-keys-internal');
var enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};

},{"./_object-keys-internal":"node_modules/core-js/library/modules/_object-keys-internal.js","./_enum-bug-keys":"node_modules/core-js/library/modules/_enum-bug-keys.js"}],"node_modules/core-js/library/modules/_object-dps.js":[function(require,module,exports) {
var dP = require('./_object-dp');
var anObject = require('./_an-object');
var getKeys = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};

},{"./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_object-keys":"node_modules/core-js/library/modules/_object-keys.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js"}],"node_modules/core-js/library/modules/_html.js":[function(require,module,exports) {
var document = require('./_global').document;
module.exports = document && document.documentElement;

},{"./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_object-create.js":[function(require,module,exports) {
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = require('./_an-object');
var dPs = require('./_object-dps');
var enumBugKeys = require('./_enum-bug-keys');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_object-dps":"node_modules/core-js/library/modules/_object-dps.js","./_enum-bug-keys":"node_modules/core-js/library/modules/_enum-bug-keys.js","./_shared-key":"node_modules/core-js/library/modules/_shared-key.js","./_dom-create":"node_modules/core-js/library/modules/_dom-create.js","./_html":"node_modules/core-js/library/modules/_html.js"}],"node_modules/core-js/library/modules/_wks.js":[function(require,module,exports) {
var store = require('./_shared')('wks');
var uid = require('./_uid');
var Symbol = require('./_global').Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;

},{"./_shared":"node_modules/core-js/library/modules/_shared.js","./_uid":"node_modules/core-js/library/modules/_uid.js","./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_set-to-string-tag.js":[function(require,module,exports) {
var def = require('./_object-dp').f;
var has = require('./_has');
var TAG = require('./_wks')('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};

},{"./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_has":"node_modules/core-js/library/modules/_has.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_iter-create.js":[function(require,module,exports) {
'use strict';
var create = require('./_object-create');
var descriptor = require('./_property-desc');
var setToStringTag = require('./_set-to-string-tag');
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};

},{"./_object-create":"node_modules/core-js/library/modules/_object-create.js","./_property-desc":"node_modules/core-js/library/modules/_property-desc.js","./_set-to-string-tag":"node_modules/core-js/library/modules/_set-to-string-tag.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_to-object.js":[function(require,module,exports) {
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function (it) {
  return Object(defined(it));
};

},{"./_defined":"node_modules/core-js/library/modules/_defined.js"}],"node_modules/core-js/library/modules/_object-gpo.js":[function(require,module,exports) {
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = require('./_has');
var toObject = require('./_to-object');
var IE_PROTO = require('./_shared-key')('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};

},{"./_has":"node_modules/core-js/library/modules/_has.js","./_to-object":"node_modules/core-js/library/modules/_to-object.js","./_shared-key":"node_modules/core-js/library/modules/_shared-key.js"}],"node_modules/core-js/library/modules/_iter-define.js":[function(require,module,exports) {
'use strict';
var LIBRARY = require('./_library');
var $export = require('./_export');
var redefine = require('./_redefine');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var $iterCreate = require('./_iter-create');
var setToStringTag = require('./_set-to-string-tag');
var getPrototypeOf = require('./_object-gpo');
var ITERATOR = require('./_wks')('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && typeof IteratorPrototype[ITERATOR] != 'function') hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};

},{"./_library":"node_modules/core-js/library/modules/_library.js","./_export":"node_modules/core-js/library/modules/_export.js","./_redefine":"node_modules/core-js/library/modules/_redefine.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_iter-create":"node_modules/core-js/library/modules/_iter-create.js","./_set-to-string-tag":"node_modules/core-js/library/modules/_set-to-string-tag.js","./_object-gpo":"node_modules/core-js/library/modules/_object-gpo.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/es6.string.iterator.js":[function(require,module,exports) {
'use strict';
var $at = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});

},{"./_string-at":"node_modules/core-js/library/modules/_string-at.js","./_iter-define":"node_modules/core-js/library/modules/_iter-define.js"}],"node_modules/core-js/library/modules/_add-to-unscopables.js":[function(require,module,exports) {
module.exports = function () { /* empty */ };

},{}],"node_modules/core-js/library/modules/_iter-step.js":[function(require,module,exports) {
module.exports = function (done, value) {
  return { value: value, done: !!done };
};

},{}],"node_modules/core-js/library/modules/es6.array.iterator.js":[function(require,module,exports) {
'use strict';
var addToUnscopables = require('./_add-to-unscopables');
var step = require('./_iter-step');
var Iterators = require('./_iterators');
var toIObject = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');

},{"./_add-to-unscopables":"node_modules/core-js/library/modules/_add-to-unscopables.js","./_iter-step":"node_modules/core-js/library/modules/_iter-step.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_to-iobject":"node_modules/core-js/library/modules/_to-iobject.js","./_iter-define":"node_modules/core-js/library/modules/_iter-define.js"}],"node_modules/core-js/library/modules/web.dom.iterable.js":[function(require,module,exports) {

require('./es6.array.iterator');
var global = require('./_global');
var hide = require('./_hide');
var Iterators = require('./_iterators');
var TO_STRING_TAG = require('./_wks')('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}

},{"./es6.array.iterator":"node_modules/core-js/library/modules/es6.array.iterator.js","./_global":"node_modules/core-js/library/modules/_global.js","./_hide":"node_modules/core-js/library/modules/_hide.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_classof.js":[function(require,module,exports) {
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof');
var TAG = require('./_wks')('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};

},{"./_cof":"node_modules/core-js/library/modules/_cof.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_an-instance.js":[function(require,module,exports) {
module.exports = function (it, Constructor, name, forbiddenField) {
  if (!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)) {
    throw TypeError(name + ': incorrect invocation!');
  } return it;
};

},{}],"node_modules/core-js/library/modules/_iter-call.js":[function(require,module,exports) {
// call something on iterator step with safe closing on error
var anObject = require('./_an-object');
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js"}],"node_modules/core-js/library/modules/_is-array-iter.js":[function(require,module,exports) {
// check on default Array iterator
var Iterators = require('./_iterators');
var ITERATOR = require('./_wks')('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};

},{"./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/core.get-iterator-method.js":[function(require,module,exports) {
var classof = require('./_classof');
var ITERATOR = require('./_wks')('iterator');
var Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};

},{"./_classof":"node_modules/core-js/library/modules/_classof.js","./_wks":"node_modules/core-js/library/modules/_wks.js","./_iterators":"node_modules/core-js/library/modules/_iterators.js","./_core":"node_modules/core-js/library/modules/_core.js"}],"node_modules/core-js/library/modules/_for-of.js":[function(require,module,exports) {
var ctx = require('./_ctx');
var call = require('./_iter-call');
var isArrayIter = require('./_is-array-iter');
var anObject = require('./_an-object');
var toLength = require('./_to-length');
var getIterFn = require('./core.get-iterator-method');
var BREAK = {};
var RETURN = {};
var exports = module.exports = function (iterable, entries, fn, that, ITERATOR) {
  var iterFn = ITERATOR ? function () { return iterable; } : getIterFn(iterable);
  var f = ctx(fn, that, entries ? 2 : 1);
  var index = 0;
  var length, step, iterator, result;
  if (typeof iterFn != 'function') throw TypeError(iterable + ' is not iterable!');
  // fast case for arrays with default iterator
  if (isArrayIter(iterFn)) for (length = toLength(iterable.length); length > index; index++) {
    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
    if (result === BREAK || result === RETURN) return result;
  } else for (iterator = iterFn.call(iterable); !(step = iterator.next()).done;) {
    result = call(iterator, f, step.value, entries);
    if (result === BREAK || result === RETURN) return result;
  }
};
exports.BREAK = BREAK;
exports.RETURN = RETURN;

},{"./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_iter-call":"node_modules/core-js/library/modules/_iter-call.js","./_is-array-iter":"node_modules/core-js/library/modules/_is-array-iter.js","./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_to-length":"node_modules/core-js/library/modules/_to-length.js","./core.get-iterator-method":"node_modules/core-js/library/modules/core.get-iterator-method.js"}],"node_modules/core-js/library/modules/_species-constructor.js":[function(require,module,exports) {
// 7.3.20 SpeciesConstructor(O, defaultConstructor)
var anObject = require('./_an-object');
var aFunction = require('./_a-function');
var SPECIES = require('./_wks')('species');
module.exports = function (O, D) {
  var C = anObject(O).constructor;
  var S;
  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_a-function":"node_modules/core-js/library/modules/_a-function.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_invoke.js":[function(require,module,exports) {
// fast apply, http://jsperf.lnkit.com/fast-apply/5
module.exports = function (fn, args, that) {
  var un = that === undefined;
  switch (args.length) {
    case 0: return un ? fn()
                      : fn.call(that);
    case 1: return un ? fn(args[0])
                      : fn.call(that, args[0]);
    case 2: return un ? fn(args[0], args[1])
                      : fn.call(that, args[0], args[1]);
    case 3: return un ? fn(args[0], args[1], args[2])
                      : fn.call(that, args[0], args[1], args[2]);
    case 4: return un ? fn(args[0], args[1], args[2], args[3])
                      : fn.call(that, args[0], args[1], args[2], args[3]);
  } return fn.apply(that, args);
};

},{}],"node_modules/core-js/library/modules/_task.js":[function(require,module,exports) {


var ctx = require('./_ctx');
var invoke = require('./_invoke');
var html = require('./_html');
var cel = require('./_dom-create');
var global = require('./_global');
var process = global.process;
var setTask = global.setImmediate;
var clearTask = global.clearImmediate;
var MessageChannel = global.MessageChannel;
var Dispatch = global.Dispatch;
var counter = 0;
var queue = {};
var ONREADYSTATECHANGE = 'onreadystatechange';
var defer, channel, port;
var run = function () {
  var id = +this;
  // eslint-disable-next-line no-prototype-builtins
  if (queue.hasOwnProperty(id)) {
    var fn = queue[id];
    delete queue[id];
    fn();
  }
};
var listener = function (event) {
  run.call(event.data);
};
// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
if (!setTask || !clearTask) {
  setTask = function setImmediate(fn) {
    var args = [];
    var i = 1;
    while (arguments.length > i) args.push(arguments[i++]);
    queue[++counter] = function () {
      // eslint-disable-next-line no-new-func
      invoke(typeof fn == 'function' ? fn : Function(fn), args);
    };
    defer(counter);
    return counter;
  };
  clearTask = function clearImmediate(id) {
    delete queue[id];
  };
  // Node.js 0.8-
  if (require('./_cof')(process) == 'process') {
    defer = function (id) {
      process.nextTick(ctx(run, id, 1));
    };
  // Sphere (JS game engine) Dispatch API
  } else if (Dispatch && Dispatch.now) {
    defer = function (id) {
      Dispatch.now(ctx(run, id, 1));
    };
  // Browsers with MessageChannel, includes WebWorkers
  } else if (MessageChannel) {
    channel = new MessageChannel();
    port = channel.port2;
    channel.port1.onmessage = listener;
    defer = ctx(port.postMessage, port, 1);
  // Browsers with postMessage, skip WebWorkers
  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
  } else if (global.addEventListener && typeof postMessage == 'function' && !global.importScripts) {
    defer = function (id) {
      global.postMessage(id + '', '*');
    };
    global.addEventListener('message', listener, false);
  // IE8-
  } else if (ONREADYSTATECHANGE in cel('script')) {
    defer = function (id) {
      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function () {
        html.removeChild(this);
        run.call(id);
      };
    };
  // Rest old browsers
  } else {
    defer = function (id) {
      setTimeout(ctx(run, id, 1), 0);
    };
  }
}
module.exports = {
  set: setTask,
  clear: clearTask
};

},{"./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_invoke":"node_modules/core-js/library/modules/_invoke.js","./_html":"node_modules/core-js/library/modules/_html.js","./_dom-create":"node_modules/core-js/library/modules/_dom-create.js","./_global":"node_modules/core-js/library/modules/_global.js","./_cof":"node_modules/core-js/library/modules/_cof.js"}],"node_modules/core-js/library/modules/_microtask.js":[function(require,module,exports) {


var global = require('./_global');
var macrotask = require('./_task').set;
var Observer = global.MutationObserver || global.WebKitMutationObserver;
var process = global.process;
var Promise = global.Promise;
var isNode = require('./_cof')(process) == 'process';

module.exports = function () {
  var head, last, notify;

  var flush = function () {
    var parent, fn;
    if (isNode && (parent = process.domain)) parent.exit();
    while (head) {
      fn = head.fn;
      head = head.next;
      try {
        fn();
      } catch (e) {
        if (head) notify();
        else last = undefined;
        throw e;
      }
    } last = undefined;
    if (parent) parent.enter();
  };

  // Node.js
  if (isNode) {
    notify = function () {
      process.nextTick(flush);
    };
  // browsers with MutationObserver, except iOS Safari - https://github.com/zloirock/core-js/issues/339
  } else if (Observer && !(global.navigator && global.navigator.standalone)) {
    var toggle = true;
    var node = document.createTextNode('');
    new Observer(flush).observe(node, { characterData: true }); // eslint-disable-line no-new
    notify = function () {
      node.data = toggle = !toggle;
    };
  // environments with maybe non-completely correct, but existent Promise
  } else if (Promise && Promise.resolve) {
    // Promise.resolve without an argument throws an error in LG WebOS 2
    var promise = Promise.resolve(undefined);
    notify = function () {
      promise.then(flush);
    };
  // for other environments - macrotask based on:
  // - setImmediate
  // - MessageChannel
  // - window.postMessag
  // - onreadystatechange
  // - setTimeout
  } else {
    notify = function () {
      // strange IE + webpack dev server bug - use .call(global)
      macrotask.call(global, flush);
    };
  }

  return function (fn) {
    var task = { fn: fn, next: undefined };
    if (last) last.next = task;
    if (!head) {
      head = task;
      notify();
    } last = task;
  };
};

},{"./_global":"node_modules/core-js/library/modules/_global.js","./_task":"node_modules/core-js/library/modules/_task.js","./_cof":"node_modules/core-js/library/modules/_cof.js"}],"node_modules/core-js/library/modules/_new-promise-capability.js":[function(require,module,exports) {
'use strict';
// 25.4.1.5 NewPromiseCapability(C)
var aFunction = require('./_a-function');

function PromiseCapability(C) {
  var resolve, reject;
  this.promise = new C(function ($$resolve, $$reject) {
    if (resolve !== undefined || reject !== undefined) throw TypeError('Bad Promise constructor');
    resolve = $$resolve;
    reject = $$reject;
  });
  this.resolve = aFunction(resolve);
  this.reject = aFunction(reject);
}

module.exports.f = function (C) {
  return new PromiseCapability(C);
};

},{"./_a-function":"node_modules/core-js/library/modules/_a-function.js"}],"node_modules/core-js/library/modules/_perform.js":[function(require,module,exports) {
module.exports = function (exec) {
  try {
    return { e: false, v: exec() };
  } catch (e) {
    return { e: true, v: e };
  }
};

},{}],"node_modules/core-js/library/modules/_user-agent.js":[function(require,module,exports) {

var global = require('./_global');
var navigator = global.navigator;

module.exports = navigator && navigator.userAgent || '';

},{"./_global":"node_modules/core-js/library/modules/_global.js"}],"node_modules/core-js/library/modules/_promise-resolve.js":[function(require,module,exports) {
var anObject = require('./_an-object');
var isObject = require('./_is-object');
var newPromiseCapability = require('./_new-promise-capability');

module.exports = function (C, x) {
  anObject(C);
  if (isObject(x) && x.constructor === C) return x;
  var promiseCapability = newPromiseCapability.f(C);
  var resolve = promiseCapability.resolve;
  resolve(x);
  return promiseCapability.promise;
};

},{"./_an-object":"node_modules/core-js/library/modules/_an-object.js","./_is-object":"node_modules/core-js/library/modules/_is-object.js","./_new-promise-capability":"node_modules/core-js/library/modules/_new-promise-capability.js"}],"node_modules/core-js/library/modules/_redefine-all.js":[function(require,module,exports) {
var hide = require('./_hide');
module.exports = function (target, src, safe) {
  for (var key in src) {
    if (safe && target[key]) target[key] = src[key];
    else hide(target, key, src[key]);
  } return target;
};

},{"./_hide":"node_modules/core-js/library/modules/_hide.js"}],"node_modules/core-js/library/modules/_set-species.js":[function(require,module,exports) {

'use strict';
var global = require('./_global');
var core = require('./_core');
var dP = require('./_object-dp');
var DESCRIPTORS = require('./_descriptors');
var SPECIES = require('./_wks')('species');

module.exports = function (KEY) {
  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
  if (DESCRIPTORS && C && !C[SPECIES]) dP.f(C, SPECIES, {
    configurable: true,
    get: function () { return this; }
  });
};

},{"./_global":"node_modules/core-js/library/modules/_global.js","./_core":"node_modules/core-js/library/modules/_core.js","./_object-dp":"node_modules/core-js/library/modules/_object-dp.js","./_descriptors":"node_modules/core-js/library/modules/_descriptors.js","./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/_iter-detect.js":[function(require,module,exports) {
var ITERATOR = require('./_wks')('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};

},{"./_wks":"node_modules/core-js/library/modules/_wks.js"}],"node_modules/core-js/library/modules/es6.promise.js":[function(require,module,exports) {


'use strict';
var LIBRARY = require('./_library');
var global = require('./_global');
var ctx = require('./_ctx');
var classof = require('./_classof');
var $export = require('./_export');
var isObject = require('./_is-object');
var aFunction = require('./_a-function');
var anInstance = require('./_an-instance');
var forOf = require('./_for-of');
var speciesConstructor = require('./_species-constructor');
var task = require('./_task').set;
var microtask = require('./_microtask')();
var newPromiseCapabilityModule = require('./_new-promise-capability');
var perform = require('./_perform');
var userAgent = require('./_user-agent');
var promiseResolve = require('./_promise-resolve');
var PROMISE = 'Promise';
var TypeError = global.TypeError;
var process = global.process;
var versions = process && process.versions;
var v8 = versions && versions.v8 || '';
var $Promise = global[PROMISE];
var isNode = classof(process) == 'process';
var empty = function () { /* empty */ };
var Internal, newGenericPromiseCapability, OwnPromiseCapability, Wrapper;
var newPromiseCapability = newGenericPromiseCapability = newPromiseCapabilityModule.f;

var USE_NATIVE = !!function () {
  try {
    // correct subclassing with @@species support
    var promise = $Promise.resolve(1);
    var FakePromise = (promise.constructor = {})[require('./_wks')('species')] = function (exec) {
      exec(empty, empty);
    };
    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
    return (isNode || typeof PromiseRejectionEvent == 'function')
      && promise.then(empty) instanceof FakePromise
      // v8 6.6 (Node 10 and Chrome 66) have a bug with resolving custom thenables
      // https://bugs.chromium.org/p/chromium/issues/detail?id=830565
      // we can't detect it synchronously, so just check versions
      && v8.indexOf('6.6') !== 0
      && userAgent.indexOf('Chrome/66') === -1;
  } catch (e) { /* empty */ }
}();

// helpers
var isThenable = function (it) {
  var then;
  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
};
var notify = function (promise, isReject) {
  if (promise._n) return;
  promise._n = true;
  var chain = promise._c;
  microtask(function () {
    var value = promise._v;
    var ok = promise._s == 1;
    var i = 0;
    var run = function (reaction) {
      var handler = ok ? reaction.ok : reaction.fail;
      var resolve = reaction.resolve;
      var reject = reaction.reject;
      var domain = reaction.domain;
      var result, then, exited;
      try {
        if (handler) {
          if (!ok) {
            if (promise._h == 2) onHandleUnhandled(promise);
            promise._h = 1;
          }
          if (handler === true) result = value;
          else {
            if (domain) domain.enter();
            result = handler(value); // may throw
            if (domain) {
              domain.exit();
              exited = true;
            }
          }
          if (result === reaction.promise) {
            reject(TypeError('Promise-chain cycle'));
          } else if (then = isThenable(result)) {
            then.call(result, resolve, reject);
          } else resolve(result);
        } else reject(value);
      } catch (e) {
        if (domain && !exited) domain.exit();
        reject(e);
      }
    };
    while (chain.length > i) run(chain[i++]); // variable length - can't use forEach
    promise._c = [];
    promise._n = false;
    if (isReject && !promise._h) onUnhandled(promise);
  });
};
var onUnhandled = function (promise) {
  task.call(global, function () {
    var value = promise._v;
    var unhandled = isUnhandled(promise);
    var result, handler, console;
    if (unhandled) {
      result = perform(function () {
        if (isNode) {
          process.emit('unhandledRejection', value, promise);
        } else if (handler = global.onunhandledrejection) {
          handler({ promise: promise, reason: value });
        } else if ((console = global.console) && console.error) {
          console.error('Unhandled promise rejection', value);
        }
      });
      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
    } promise._a = undefined;
    if (unhandled && result.e) throw result.v;
  });
};
var isUnhandled = function (promise) {
  return promise._h !== 1 && (promise._a || promise._c).length === 0;
};
var onHandleUnhandled = function (promise) {
  task.call(global, function () {
    var handler;
    if (isNode) {
      process.emit('rejectionHandled', promise);
    } else if (handler = global.onrejectionhandled) {
      handler({ promise: promise, reason: promise._v });
    }
  });
};
var $reject = function (value) {
  var promise = this;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  promise._v = value;
  promise._s = 2;
  if (!promise._a) promise._a = promise._c.slice();
  notify(promise, true);
};
var $resolve = function (value) {
  var promise = this;
  var then;
  if (promise._d) return;
  promise._d = true;
  promise = promise._w || promise; // unwrap
  try {
    if (promise === value) throw TypeError("Promise can't be resolved itself");
    if (then = isThenable(value)) {
      microtask(function () {
        var wrapper = { _w: promise, _d: false }; // wrap
        try {
          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
        } catch (e) {
          $reject.call(wrapper, e);
        }
      });
    } else {
      promise._v = value;
      promise._s = 1;
      notify(promise, false);
    }
  } catch (e) {
    $reject.call({ _w: promise, _d: false }, e); // wrap
  }
};

// constructor polyfill
if (!USE_NATIVE) {
  // 25.4.3.1 Promise(executor)
  $Promise = function Promise(executor) {
    anInstance(this, $Promise, PROMISE, '_h');
    aFunction(executor);
    Internal.call(this);
    try {
      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
    } catch (err) {
      $reject.call(this, err);
    }
  };
  // eslint-disable-next-line no-unused-vars
  Internal = function Promise(executor) {
    this._c = [];             // <- awaiting reactions
    this._a = undefined;      // <- checked in isUnhandled reactions
    this._s = 0;              // <- state
    this._d = false;          // <- done
    this._v = undefined;      // <- value
    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
    this._n = false;          // <- notify
  };
  Internal.prototype = require('./_redefine-all')($Promise.prototype, {
    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
    then: function then(onFulfilled, onRejected) {
      var reaction = newPromiseCapability(speciesConstructor(this, $Promise));
      reaction.ok = typeof onFulfilled == 'function' ? onFulfilled : true;
      reaction.fail = typeof onRejected == 'function' && onRejected;
      reaction.domain = isNode ? process.domain : undefined;
      this._c.push(reaction);
      if (this._a) this._a.push(reaction);
      if (this._s) notify(this, false);
      return reaction.promise;
    },
    // 25.4.5.1 Promise.prototype.catch(onRejected)
    'catch': function (onRejected) {
      return this.then(undefined, onRejected);
    }
  });
  OwnPromiseCapability = function () {
    var promise = new Internal();
    this.promise = promise;
    this.resolve = ctx($resolve, promise, 1);
    this.reject = ctx($reject, promise, 1);
  };
  newPromiseCapabilityModule.f = newPromiseCapability = function (C) {
    return C === $Promise || C === Wrapper
      ? new OwnPromiseCapability(C)
      : newGenericPromiseCapability(C);
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Promise: $Promise });
require('./_set-to-string-tag')($Promise, PROMISE);
require('./_set-species')(PROMISE);
Wrapper = require('./_core')[PROMISE];

// statics
$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
  // 25.4.4.5 Promise.reject(r)
  reject: function reject(r) {
    var capability = newPromiseCapability(this);
    var $$reject = capability.reject;
    $$reject(r);
    return capability.promise;
  }
});
$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
  // 25.4.4.6 Promise.resolve(x)
  resolve: function resolve(x) {
    return promiseResolve(LIBRARY && this === Wrapper ? $Promise : this, x);
  }
});
$export($export.S + $export.F * !(USE_NATIVE && require('./_iter-detect')(function (iter) {
  $Promise.all(iter)['catch'](empty);
})), PROMISE, {
  // 25.4.4.1 Promise.all(iterable)
  all: function all(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var resolve = capability.resolve;
    var reject = capability.reject;
    var result = perform(function () {
      var values = [];
      var index = 0;
      var remaining = 1;
      forOf(iterable, false, function (promise) {
        var $index = index++;
        var alreadyCalled = false;
        values.push(undefined);
        remaining++;
        C.resolve(promise).then(function (value) {
          if (alreadyCalled) return;
          alreadyCalled = true;
          values[$index] = value;
          --remaining || resolve(values);
        }, reject);
      });
      --remaining || resolve(values);
    });
    if (result.e) reject(result.v);
    return capability.promise;
  },
  // 25.4.4.4 Promise.race(iterable)
  race: function race(iterable) {
    var C = this;
    var capability = newPromiseCapability(C);
    var reject = capability.reject;
    var result = perform(function () {
      forOf(iterable, false, function (promise) {
        C.resolve(promise).then(capability.resolve, reject);
      });
    });
    if (result.e) reject(result.v);
    return capability.promise;
  }
});

},{"./_library":"node_modules/core-js/library/modules/_library.js","./_global":"node_modules/core-js/library/modules/_global.js","./_ctx":"node_modules/core-js/library/modules/_ctx.js","./_classof":"node_modules/core-js/library/modules/_classof.js","./_export":"node_modules/core-js/library/modules/_export.js","./_is-object":"node_modules/core-js/library/modules/_is-object.js","./_a-function":"node_modules/core-js/library/modules/_a-function.js","./_an-instance":"node_modules/core-js/library/modules/_an-instance.js","./_for-of":"node_modules/core-js/library/modules/_for-of.js","./_species-constructor":"node_modules/core-js/library/modules/_species-constructor.js","./_task":"node_modules/core-js/library/modules/_task.js","./_microtask":"node_modules/core-js/library/modules/_microtask.js","./_new-promise-capability":"node_modules/core-js/library/modules/_new-promise-capability.js","./_perform":"node_modules/core-js/library/modules/_perform.js","./_user-agent":"node_modules/core-js/library/modules/_user-agent.js","./_promise-resolve":"node_modules/core-js/library/modules/_promise-resolve.js","./_wks":"node_modules/core-js/library/modules/_wks.js","./_redefine-all":"node_modules/core-js/library/modules/_redefine-all.js","./_set-to-string-tag":"node_modules/core-js/library/modules/_set-to-string-tag.js","./_set-species":"node_modules/core-js/library/modules/_set-species.js","./_core":"node_modules/core-js/library/modules/_core.js","./_iter-detect":"node_modules/core-js/library/modules/_iter-detect.js"}],"node_modules/core-js/library/modules/es7.promise.finally.js":[function(require,module,exports) {

// https://github.com/tc39/proposal-promise-finally
'use strict';
var $export = require('./_export');
var core = require('./_core');
var global = require('./_global');
var speciesConstructor = require('./_species-constructor');
var promiseResolve = require('./_promise-resolve');

$export($export.P + $export.R, 'Promise', { 'finally': function (onFinally) {
  var C = speciesConstructor(this, core.Promise || global.Promise);
  var isFunction = typeof onFinally == 'function';
  return this.then(
    isFunction ? function (x) {
      return promiseResolve(C, onFinally()).then(function () { return x; });
    } : onFinally,
    isFunction ? function (e) {
      return promiseResolve(C, onFinally()).then(function () { throw e; });
    } : onFinally
  );
} });

},{"./_export":"node_modules/core-js/library/modules/_export.js","./_core":"node_modules/core-js/library/modules/_core.js","./_global":"node_modules/core-js/library/modules/_global.js","./_species-constructor":"node_modules/core-js/library/modules/_species-constructor.js","./_promise-resolve":"node_modules/core-js/library/modules/_promise-resolve.js"}],"node_modules/core-js/library/modules/es7.promise.try.js":[function(require,module,exports) {
'use strict';
// https://github.com/tc39/proposal-promise-try
var $export = require('./_export');
var newPromiseCapability = require('./_new-promise-capability');
var perform = require('./_perform');

$export($export.S, 'Promise', { 'try': function (callbackfn) {
  var promiseCapability = newPromiseCapability.f(this);
  var result = perform(callbackfn);
  (result.e ? promiseCapability.reject : promiseCapability.resolve)(result.v);
  return promiseCapability.promise;
} });

},{"./_export":"node_modules/core-js/library/modules/_export.js","./_new-promise-capability":"node_modules/core-js/library/modules/_new-promise-capability.js","./_perform":"node_modules/core-js/library/modules/_perform.js"}],"node_modules/core-js/library/fn/promise.js":[function(require,module,exports) {
require('../modules/es6.object.to-string');
require('../modules/es6.string.iterator');
require('../modules/web.dom.iterable');
require('../modules/es6.promise');
require('../modules/es7.promise.finally');
require('../modules/es7.promise.try');
module.exports = require('../modules/_core').Promise;

},{"../modules/es6.object.to-string":"node_modules/core-js/library/modules/es6.object.to-string.js","../modules/es6.string.iterator":"node_modules/core-js/library/modules/es6.string.iterator.js","../modules/web.dom.iterable":"node_modules/core-js/library/modules/web.dom.iterable.js","../modules/es6.promise":"node_modules/core-js/library/modules/es6.promise.js","../modules/es7.promise.finally":"node_modules/core-js/library/modules/es7.promise.finally.js","../modules/es7.promise.try":"node_modules/core-js/library/modules/es7.promise.try.js","../modules/_core":"node_modules/core-js/library/modules/_core.js"}],"node_modules/@babel/runtime/core-js/promise.js":[function(require,module,exports) {
module.exports = require("core-js/library/fn/promise");
},{"core-js/library/fn/promise":"node_modules/core-js/library/fn/promise.js"}],"node_modules/@babel/runtime/helpers/asyncToGenerator.js":[function(require,module,exports) {
var _Promise = require("../core-js/promise");

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new _Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function step(key, arg) {
        try {
          var info = gen[key](arg);
          var value = info.value;
        } catch (error) {
          reject(error);
          return;
        }

        if (info.done) {
          resolve(value);
        } else {
          _Promise.resolve(value).then(_next, _throw);
        }
      }

      function _next(value) {
        step("next", value);
      }

      function _throw(err) {
        step("throw", err);
      }

      _next();
    });
  };
}

module.exports = _asyncToGenerator;
},{"../core-js/promise":"node_modules/@babel/runtime/core-js/promise.js"}],"node_modules/@babel/runtime/helpers/classCallCheck.js":[function(require,module,exports) {
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

module.exports = _classCallCheck;
},{}],"src/compress.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.JSONC = exports.LZString = void 0;

var LZString = function () {
  function o(o, r) {
    if (!t[o]) {
      t[o] = {};

      for (var n = 0; n < o.length; n++) {
        t[o][o.charAt(n)] = n;
      }
    }

    return t[o][r];
  }

  var r = String.fromCharCode,
      n = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
      t = {},
      i = {
    compressToBase64: function compressToBase64(o) {
      if (null == o) return "";

      var r = i._compress(o, 6, function (o) {
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
    decompressFromBase64: function decompressFromBase64(r) {
      return null == r ? "" : "" == r ? null : i._decompress(r.length, 32, function (e) {
        return o(n, r.charAt(e));
      });
    },
    compressToUTF16: function compressToUTF16(o) {
      return null == o ? "" : i._compress(o, 15, function (o) {
        return r(o + 32);
      }) + " ";
    },
    decompressFromUTF16: function decompressFromUTF16(o) {
      return null == o ? "" : "" == o ? null : i._decompress(o.length, 16384, function (r) {
        return o.charCodeAt(r) - 32;
      });
    },
    compressToUint8Array: function compressToUint8Array(o) {
      for (var r = i.compress(o), n = new Uint8Array(2 * r.length), e = 0, t = r.length; t > e; e++) {
        var s = r.charCodeAt(e);
        n[2 * e] = s >>> 8, n[2 * e + 1] = s % 256;
      }

      return n;
    },
    decompressFromUint8Array: function decompressFromUint8Array(o) {
      if (null === o || void 0 === o) return i.decompress(o);

      for (var n = new Array(o.length / 2), e = 0, t = n.length; t > e; e++) {
        n[e] = 256 * o[2 * e] + o[2 * e + 1];
      }

      var s = [];
      return n.forEach(function (o) {
        s.push(r(o));
      }), i.decompress(s.join(""));
    },
    compressToEncodedURIComponent: function compressToEncodedURIComponent(o) {
      return null == o ? "" : i._compress(o, 6, function (o) {
        return e.charAt(o);
      });
    },
    decompressFromEncodedURIComponent: function decompressFromEncodedURIComponent(r) {
      return null == r ? "" : "" == r ? null : (r = r.replace(/ /g, "+"), i._decompress(r.length, 32, function (n) {
        return o(e, r.charAt(n));
      }));
    },
    compress: function compress(o) {
      return i._compress(o, 16, function (o) {
        return r(o);
      });
    },
    _compress: function _compress(o, r, n) {
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

      for (i = 0; i < o.length; i += 1) {
        if (u = o.charAt(i), Object.prototype.hasOwnProperty.call(s, u) || (s[u] = f++, p[u] = !0), c = a + u, Object.prototype.hasOwnProperty.call(s, c)) a = c;else {
          if (Object.prototype.hasOwnProperty.call(p, a)) {
            if (a.charCodeAt(0) < 256) {
              for (e = 0; h > e; e++) {
                m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
              }

              for (t = a.charCodeAt(0), e = 0; 8 > e; e++) {
                m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
              }
            } else {
              for (t = 1, e = 0; h > e; e++) {
                m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
              }

              for (t = a.charCodeAt(0), e = 0; 16 > e; e++) {
                m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
              }
            }

            l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a];
          } else for (t = s[a], e = 0; h > e; e++) {
            m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
          }

          l--, 0 == l && (l = Math.pow(2, h), h++), s[c] = f++, a = String(u);
        }
      }

      if ("" !== a) {
        if (Object.prototype.hasOwnProperty.call(p, a)) {
          if (a.charCodeAt(0) < 256) {
            for (e = 0; h > e; e++) {
              m <<= 1, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++;
            }

            for (t = a.charCodeAt(0), e = 0; 8 > e; e++) {
              m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            }
          } else {
            for (t = 1, e = 0; h > e; e++) {
              m = m << 1 | t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t = 0;
            }

            for (t = a.charCodeAt(0), e = 0; 16 > e; e++) {
              m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
            }
          }

          l--, 0 == l && (l = Math.pow(2, h), h++), delete p[a];
        } else for (t = s[a], e = 0; h > e; e++) {
          m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
        }

        l--, 0 == l && (l = Math.pow(2, h), h++);
      }

      for (t = 2, e = 0; h > e; e++) {
        m = m << 1 | 1 & t, v == r - 1 ? (v = 0, d.push(n(m)), m = 0) : v++, t >>= 1;
      }

      for (;;) {
        if (m <<= 1, v == r - 1) {
          d.push(n(m));
          break;
        }

        v++;
      }

      return d.join("");
    },
    decompress: function decompress(o) {
      return null == o ? "" : "" == o ? null : i._decompress(o.length, 32768, function (r) {
        return o.charCodeAt(r);
      });
    },
    _decompress: function _decompress(o, n, e) {
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
          A = {
        val: e(0),
        position: n,
        index: 1
      };

      for (i = 0; 3 > i; i += 1) {
        f[i] = i;
      }

      for (p = 0, c = Math.pow(2, 2), a = 1; a != c;) {
        u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
      }

      switch (t = p) {
        case 0:
          for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) {
            u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
          }

          l = r(p);
          break;

        case 1:
          for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) {
            u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
          }

          l = r(p);
          break;

        case 2:
          return "";
      }

      for (f[3] = l, s = l, w.push(l);;) {
        if (A.index > o) return "";

        for (p = 0, c = Math.pow(2, m), a = 1; a != c;) {
          u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
        }

        switch (l = p) {
          case 0:
            for (p = 0, c = Math.pow(2, 8), a = 1; a != c;) {
              u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
            }

            f[d++] = r(p), l = d - 1, h--;
            break;

          case 1:
            for (p = 0, c = Math.pow(2, 16), a = 1; a != c;) {
              u = A.val & A.position, A.position >>= 1, 0 == A.position && (A.position = n, A.val = e(A.index++)), p |= (u > 0 ? 1 : 0) * a, a <<= 1;
            }

            f[d++] = r(p), l = d - 1, h--;
            break;

          case 2:
            return w.join("");
        }

        if (0 == h && (h = Math.pow(2, m), m++), f[l]) v = f[l];else {
          if (l !== d) return null;
          v = s + s.charAt(0);
        }
        w.push(v), f[d++] = s + v.charAt(0), h--, s = v, 0 == h && (h = Math.pow(2, m), m++);
      }
    }
  };
  return i;
}();

exports.LZString = LZString;
var root;
var JSONCB = {};

var _nCode = -1;

var toString = {}.toString;
/**
 * set the correct root depending from the environment.
 * @type {Object}
 * @private
 */

root = void 0;
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
  var sKeys = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=_!?()*",
      aArr = [],
      currentChar = index;
  totalChar = totalChar || sKeys.length;
  offset = offset || 0;

  while (currentChar >= totalChar) {
    aArr.push(sKeys.charCodeAt(currentChar % totalChar + offset));
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
    str = str.replace(new RegExp(escapeRegExp('"' + aKey[1] + '"'), "g"), '"' + aKey[0] + '"');
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
      str = str.replace(new RegExp('"' + sKey + '"', "g"), '"' + oKeys[sKey] + '"');
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


JSONCB.compress = function (json, optKeys) {
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


JSONCB.pack = function (json, bCompress) {
  var str = JSON.stringify(bCompress ? JSONCB.compress(json) : json);
  return Base64.encode(String.fromCharCode.apply(String, gzip.zip(str, {
    level: 9
  })));
};
/**
 * Decompress a compressed JSON
 * @param json
 * @returns {*}
 */


JSONCB.decompress = function (json) {
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


JSONCB.unpack = function (gzipped, bDecompress) {
  var aArr = getArr(Base64.decode(gzipped)),
      str = String.fromCharCode.apply(String, gzip.unzip(aArr, {
    level: 9
  })),
      json = JSON.parse(str);
  return bDecompress ? JSONCB.decompress(json) : json;
};
/*
 * Expose Hydra to be used in node.js, as AMD module or as dashboard
 */


var JSONC = JSONCB;
exports.JSONC = JSONC;
},{}],"node_modules/lscache/lscache.js":[function(require,module,exports) {
var define;
/**
 * lscache library
 * Copyright (c) 2011, Pamela Fox
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* jshint undef:true, browser:true, node:true */
/* global define */

(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory);
    } else if (typeof module !== "undefined" && module.exports) {
        // CommonJS/Node module
        module.exports = factory();
    } else {
        // Browser globals
        root.lscache = factory();
    }
}(this, function () {

  // Prefix for all lscache keys
  var CACHE_PREFIX = 'lscache-';

  // Suffix for the key name on the expiration items in localStorage
  var CACHE_SUFFIX = '-cacheexpiration';

  // expiration date radix (set to Base-36 for most space savings)
  var EXPIRY_RADIX = 10;

  // time resolution in milliseconds
  var expiryMilliseconds = 60 * 1000;
  // ECMAScript max Date (epoch + 1e8 days)
  var maxDate = calculateMaxDate(expiryMilliseconds);

  var cachedStorage;
  var cachedJSON;
  var cacheBucket = '';
  var warnings = false;

  // Determines if localStorage is supported in the browser;
  // result is cached for better performance instead of being run each time.
  // Feature detection is based on how Modernizr does it;
  // it's not straightforward due to FF4 issues.
  // It's not run at parse-time as it takes 200ms in Android.
  function supportsStorage() {
    var key = '__lscachetest__';
    var value = key;

    if (cachedStorage !== undefined) {
      return cachedStorage;
    }

    // some browsers will throw an error if you try to access local storage (e.g. brave browser)
    // hence check is inside a try/catch
    try {
      if (!localStorage) {
        return false;
      }
    } catch (ex) {
      return false;
    }

    try {
      setItem(key, value);
      removeItem(key);
      cachedStorage = true;
    } catch (e) {
        // If we hit the limit, and we don't have an empty localStorage then it means we have support
        if (isOutOfSpace(e) && localStorage.length) {
            cachedStorage = true; // just maxed it out and even the set test failed.
        } else {
            cachedStorage = false;
        }
    }
    return cachedStorage;
  }

  // Check to set if the error is us dealing with being out of space
  function isOutOfSpace(e) {
    return e && (
      e.name === 'QUOTA_EXCEEDED_ERR' ||
      e.name === 'NS_ERROR_DOM_QUOTA_REACHED' ||
      e.name === 'QuotaExceededError'
    );
  }

  // Determines if native JSON (de-)serialization is supported in the browser.
  function supportsJSON() {
    /*jshint eqnull:true */
    if (cachedJSON === undefined) {
      cachedJSON = (window.JSON != null);
    }
    return cachedJSON;
  }

  /**
   * Returns a string where all RegExp special characters are escaped with a \.
   * @param {String} text
   * @return {string}
   */
  function escapeRegExpSpecialCharacters(text) {
    return text.replace(/[[\]{}()*+?.\\^$|]/g, '\\$&');
  }

  /**
   * Returns the full string for the localStorage expiration item.
   * @param {String} key
   * @return {string}
   */
  function expirationKey(key) {
    return key + CACHE_SUFFIX;
  }

  /**
   * Returns the number of minutes since the epoch.
   * @return {number}
   */
  function currentTime() {
    return Math.floor((new Date().getTime())/expiryMilliseconds);
  }

  /**
   * Wrapper functions for localStorage methods
   */

  function getItem(key) {
    return localStorage.getItem(CACHE_PREFIX + cacheBucket + key);
  }

  function setItem(key, value) {
    // Fix for iPad issue - sometimes throws QUOTA_EXCEEDED_ERR on setItem.
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
    localStorage.setItem(CACHE_PREFIX + cacheBucket + key, value);
  }

  function removeItem(key) {
    localStorage.removeItem(CACHE_PREFIX + cacheBucket + key);
  }

  function eachKey(fn) {
    var prefixRegExp = new RegExp('^' + CACHE_PREFIX + escapeRegExpSpecialCharacters(cacheBucket) + '(.*)');
    // Loop in reverse as removing items will change indices of tail
    for (var i = localStorage.length-1; i >= 0 ; --i) {
      var key = localStorage.key(i);
      key = key && key.match(prefixRegExp);
      key = key && key[1];
      if (key && key.indexOf(CACHE_SUFFIX) < 0) {
        fn(key, expirationKey(key));
      }
    }
  }

  function flushItem(key) {
    var exprKey = expirationKey(key);

    removeItem(key);
    removeItem(exprKey);
  }

  function flushExpiredItem(key) {
    var exprKey = expirationKey(key);
    var expr = getItem(exprKey);

    if (expr) {
      var expirationTime = parseInt(expr, EXPIRY_RADIX);

      // Check if we should actually kick item out of storage
      if (currentTime() >= expirationTime) {
        removeItem(key);
        removeItem(exprKey);
        return true;
      }
    }
  }

  function warn(message, err) {
    if (!warnings) return;
    if (!('console' in window) || typeof window.console.warn !== 'function') return;
    window.console.warn("lscache - " + message);
    if (err) window.console.warn("lscache - The error was: " + err.message);
  }

  function calculateMaxDate(expiryMilliseconds) {
    return Math.floor(8.64e15/expiryMilliseconds);
  }

  var lscache = {
    /**
     * Stores the value in localStorage. Expires after specified number of minutes.
     * @param {string} key
     * @param {Object|string} value
     * @param {number} time
     * @return true if the value was inserted successfully
     */
    set: function(key, value, time) {
      if (!supportsStorage()) return false;

      // If we don't get a string value, try to stringify
      // In future, localStorage may properly support storing non-strings
      // and this can be removed.

      if (!supportsJSON()) return false;
      try {
        value = JSON.stringify(value);
      } catch (e) {
        // Sometimes we can't stringify due to circular refs
        // in complex objects, so we won't bother storing then.
        return false;
      }

      try {
        setItem(key, value);
      } catch (e) {
        if (isOutOfSpace(e)) {
          // If we exceeded the quota, then we will sort
          // by the expire time, and then remove the N oldest
          var storedKeys = [];
          var storedKey;
          eachKey(function(key, exprKey) {
            var expiration = getItem(exprKey);
            if (expiration) {
              expiration = parseInt(expiration, EXPIRY_RADIX);
            } else {
              // TODO: Store date added for non-expiring items for smarter removal
              expiration = maxDate;
            }
            storedKeys.push({
              key: key,
              size: (getItem(key) || '').length,
              expiration: expiration
            });
          });
          // Sorts the keys with oldest expiration time last
          storedKeys.sort(function(a, b) { return (b.expiration-a.expiration); });

          var targetSize = (value||'').length;
          while (storedKeys.length && targetSize > 0) {
            storedKey = storedKeys.pop();
            warn("Cache is full, removing item with key '" + key + "'");
            flushItem(storedKey.key);
            targetSize -= storedKey.size;
          }
          try {
            setItem(key, value);
          } catch (e) {
            // value may be larger than total quota
            warn("Could not add item with key '" + key + "', perhaps it's too big?", e);
            return false;
          }
        } else {
          // If it was some other error, just give up.
          warn("Could not add item with key '" + key + "'", e);
          return false;
        }
      }

      // If a time is specified, store expiration info in localStorage
      if (time) {
        setItem(expirationKey(key), (currentTime() + time).toString(EXPIRY_RADIX));
      } else {
        // In case they previously set a time, remove that info from localStorage.
        removeItem(expirationKey(key));
      }
      return true;
    },

    /**
     * Retrieves specified value from localStorage, if not expired.
     * @param {string} key
     * @return {string|Object}
     */
    get: function(key) {
      if (!supportsStorage()) return null;

      // Return the de-serialized item if not expired
      if (flushExpiredItem(key)) { return null; }

      // Tries to de-serialize stored value if its an object, and returns the normal value otherwise.
      var value = getItem(key);
      if (!value || !supportsJSON()) {
        return value;
      }

      try {
        // We can't tell if its JSON or a string, so we try to parse
        return JSON.parse(value);
      } catch (e) {
        // If we can't parse, it's probably because it isn't an object
        return value;
      }
    },

    /**
     * Removes a value from localStorage.
     * Equivalent to 'delete' in memcache, but that's a keyword in JS.
     * @param {string} key
     */
    remove: function(key) {
      if (!supportsStorage()) return;

      flushItem(key);
    },

    /**
     * Returns whether local storage is supported.
     * Currently exposed for testing purposes.
     * @return {boolean}
     */
    supported: function() {
      return supportsStorage();
    },

    /**
     * Flushes all lscache items and expiry markers without affecting rest of localStorage
     */
    flush: function() {
      if (!supportsStorage()) return;

      eachKey(function(key) {
        flushItem(key);
      });
    },

    /**
     * Flushes expired lscache items and expiry markers without affecting rest of localStorage
     */
    flushExpired: function() {
      if (!supportsStorage()) return;

      eachKey(function(key) {
        flushExpiredItem(key);
      });
    },

    /**
     * Appends CACHE_PREFIX so lscache will partition data in to different buckets.
     * @param {string} bucket
     */
    setBucket: function(bucket) {
      cacheBucket = bucket;
    },

    /**
     * Resets the string being appended to CACHE_PREFIX so lscache will use the default storage behavior.
     */
    resetBucket: function() {
      cacheBucket = '';
    },

    /**
     * @returns {number} The currently set number of milliseconds each time unit represents in
     *   the set() function's "time" argument.
     */
    getExpiryMilliseconds: function() {
      return expiryMilliseconds;
    },

    /**
     * Sets the number of milliseconds each time unit represents in the set() function's
     *   "time" argument.
     * Sample values:
     *  1: each time unit = 1 millisecond
     *  1000: each time unit = 1 second
     *  60000: each time unit = 1 minute (Default value)
     *  360000: each time unit = 1 hour
     * @param {number} milliseconds
     */
    setExpiryMilliseconds: function(milliseconds) {
        expiryMilliseconds = milliseconds;
        maxDate = calculateMaxDate(expiryMilliseconds);
    },

    /**
     * Sets whether to display warnings when an item is removed from the cache or not.
     */
    enableWarnings: function(enabled) {
      warnings = enabled;
    }
  };

  // Return the module
  return lscache;
}));

},{}],"src/fkcompressor.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _compress = require("./compress.js");

var _lscache = _interopRequireDefault(require("lscache"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var prettyBytes = function prettyBytes(num) {
  var precision = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;
  var addSpace = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var UNITS = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  if (Math.abs(num) < 1) return num + (addSpace ? " " : "") + UNITS[0];
  var exponent = Math.min(Math.floor(Math.log10(num < 0 ? -num : num) / 3), UNITS.length - 1);
  var n = Number(((num < 0 ? -num : num) / Math.pow(1000, exponent)).toPrecision(precision));
  return (num < 0 ? "-" : "") + n + (addSpace ? " " : "") + UNITS[exponent];
};

var round = function round(n) {
  var decimals = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
  return Number("".concat(Math.round("".concat(n, "e").concat(decimals)), "e-").concat(decimals));
};

var timeTaken = function timeTaken(callback) {
  var ss = Date.now();
  var r = callback();
  var sd = Date.now(); // console.warn(`Time taken ${round((sd - ss) / 1000, 2)}`);

  return [r, "Time taken ".concat(round((sd - ss) / 1000, 2), "s")];
}; // lscache.set('response', '...', 2);
// lscache.setBucket('lib');
// lscache.set('path', '...', 2);
// lscache.flush(); //only removes 'path' which was set in the lib bucket


var fkCompressor = function fkCompressor() {
  var _this = this;

  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {
    /**
     * Show development stats
     */
    dev: true,

    /**
     * Expire cache after
     */
    expiresAfterSeconds: 300
  };
  (0, _classCallCheck2.default)(this, fkCompressor);

  this._compress = function (json) {
    var compressedJSON = _compress.JSONC.compress(json);

    var compressedJSONstring = JSON.stringify(compressedJSON);
    return _compress.LZString.compress(compressedJSONstring);
  };

  this._decompress = function (json) {
    var comJson = _compress.LZString.decompress(json);

    var decj = {};

    try {
      decj = JSON.parse(comJson);
    } catch (e) {
      console.warn("-- Console som", 52);
    }

    var decJson = _compress.JSONC.decompress(decj);

    return decJson;
  };

  this.compress = function (json) {
    return new Promise(function (resolve) {
      var original = JSON.stringify(json).length;
      var compressed = timeTaken(function () {
        return _this._compress(json);
      });

      var comp = _this._compress(json);

      var compressedS = JSON.stringify(comp).length;

      if (_this.dev) {
        // log("**ASD** sad as_ASDASD_ iasd  `<sciprt>SRC</sciprt>`");
        // log('this is red[c]');
        // log(
        //   `turn off dev by passing fkCompressor({dev:false})
        // [c="background:#222930; color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"]${time}[c]
        //
        // [c="background:#222930;color: #ec530d;font-weight:300;border-bottom:1px solid #87a7c7; font-size:16px;line-height:20px"]Before compression size:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"]${prettyBytes(
        //             original
        //           )}[c]
        //
        // [c="background:#222930;color: #ec530d;border-bottom:1px solid #87a7c7;font-weight:300;font-size:16px;line-height:20px"]After compression:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"] ${prettyBytes(
        //             compressedS
        //           )}[c]
        //
        // [c="background:#222930;color: #ec530d;border-bottom:1px solid #87a7c7;font-weight:300;font-size:16px;line-height:20px"]Difference:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"] ${prettyBytes(
        //             original - compressedS
        //           )}[c]
        //
        // [c="background:#222930;color: #ec530d;border-bottom:1px solid #87a7c7;font-weight:300;font-size:16px;line-height:20px"]Approximately:[c]  [c="background:#222930;color: #273fec;font-weight:600;font-size:18px;line-height:20px;border-bottom:1px solid #87a7c7;"] ${round(
        //             ((original - compressedS) / original) * 100,
        //             2
        //           )}% [c]
        //
        // `
        resolve(comp);
      } else {
        resolve(comp);
      }
    });
  };

  this.set =
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee() {
    var name,
        json,
        exp,
        self,
        _args = arguments;
    return _regenerator.default.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            name = _args.length > 0 && _args[0] !== undefined ? _args[0] : Date.now();
            json = _args.length > 1 && _args[1] !== undefined ? _args[1] : {};
            exp = _args.length > 2 && _args[2] !== undefined ? _args[2] : 2;
            self = _this;
            return _context.abrupt("return", new Promise(function (resolve) {
              _lscache.default.set(name, self._compress(json), exp);

              resolve();
            }));

          case 5:
          case "end":
            return _context.stop();
        }
      }
    }, _callee);
  }));

  this.decompress = function (json) {
    return _this._decompress(json);
  };

  this.set =
  /*#__PURE__*/
  (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2() {
    var name,
        json,
        exp,
        self,
        _args2 = arguments;
    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            name = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : Date.now() + "";
            json = _args2.length > 1 && _args2[1] !== undefined ? _args2[1] : {};
            exp = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : 2;
            self = _this;
            return _context2.abrupt("return", new Promise(function (resolve) {
              _lscache.default.set(name, self._compress(json), exp);

              resolve();
            }));

          case 5:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2);
  }));

  this.setBucket = function () {
    var bucketName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Date.now() + "";

    _lscache.default.setBucket(bucketName);
  };

  this.flush = function () {
    _lscache.default.flush();
  };

  this.flushExpired = function () {
    _lscache.default.flush();
  };

  this.get =
  /*#__PURE__*/
  function () {
    var _ref3 = (0, _asyncToGenerator2.default)(
    /*#__PURE__*/
    _regenerator.default.mark(function _callee3(name) {
      return _regenerator.default.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              return _context3.abrupt("return", new Promise(function (resolve) {
                var cachd = _lscache.default.get(name);

                if (cachd) {
                  var deco = _this.decompress(cachd);

                  resolve(deco);
                } else {
                  console.warn("Item expired or doesn't exist");
                  resolve({});
                }
              }));

            case 1:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3);
    }));

    return function (_x) {
      return _ref3.apply(this, arguments);
    };
  }();

  this.dev = options.dev;
  var expiryMilliseconds = options.expiresAfterSeconds * 1000; //time units is seconds

  _lscache.default.setExpiryMilliseconds(expiryMilliseconds);
};

exports.default = fkCompressor;
},{"@babel/runtime/regenerator":"node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"node_modules/@babel/runtime/helpers/asyncToGenerator.js","@babel/runtime/helpers/classCallCheck":"node_modules/@babel/runtime/helpers/classCallCheck.js","./compress.js":"src/compress.js","lscache":"node_modules/lscache/lscache.js"}],"src/sample.json":[function(require,module,exports) {
module.exports = {
  "invoices_add_estimate": "Add Estimate",
  "Issue Tracker": "Issue Tracker",
  "c_hide": "Hide %s",
  "crm_item_type_contact": "contact",
  "dailyInterval2": "day(s)",
  "cal_fr": "Fr",
  "upsell_tasks_learn_more": "Learn more about our Premium Features",
  "addons_plur": "Add-ons",
  "mkplc_ccard": "Credit Card",
  "storage_plan_4": "More",
  "c_no_description": "No Description.",
  "type_for_subtasks_starts_hint": "Line %d, column %s (%s): Type for Subtask should start with '%s' symbols",
  "help_subtasks_app_title": "Subtasks",
  "manage_project_apps_updated": "Project applications were successfully updated.",
  "you_on_cust_plan_contact_us": "You are on the custom plan, please contact us to change plan",
  "mkplc_app_removed_from_groups": "Application has been successfully removed from all yours groups",
  "account_creation_unsuccessful": "Unable to Create Account",
  "Delete authorization info": "Delete authorization info",
  "files_no_perm_id_tpl": "You don't have permissions for file with id %d.",
  "You can access all available Data Feed Links": "You can access all available Data Feed Links",
  "disc_edit_discussion_title": "Edit Discussion",
  "Kanban and List view": "Kanban and List view",
  "passman_shared": "Shared",
  "start_business_trial_msg": "Start a 14 day free trial, no credit card required",
  "page_can_not_visited_twice": "You've requested page which can not be visited twice",
  "mkplc_no_module_subscr": "You don't have a subscription for this module.",
  "files_popup_update_title": "Update File",
  "All Clear": "All Clear",
  "tasks_progress_none": "No Progress",
  "manage_clone_project_move_monday_no_opt": "No - I will adjust myself",
  "c_yes": "Yes",
  "Can not wait?": "Can't wait?",
  "reports_created_vs_completed": "Created vs Completed",
  "Business hours range error": "Please choose some valid range for Business hours",
  "Access": "Access",
  "tasks_time_stop_work": "Stop work",
  "monthlyDayOfMonth1": "Day",
  "c_due_later": "due later",
  "manage_card_choice_title": "Which Task management method do you prefer?",
  "passman_manage_groups": "Manage Password Lists",
  "Edit own milestone": "Edit own milestone",
  "start_trial": "Start Trial",
  "cal_time_to": "Time To",
  "c_read_more": "Read more",
  "add_popup_text": "Add New Calendar",
  "invoice_create_invoice_success_msg": "New invoice created!",
  "Terms and Conditions": "Terms and Conditions",
  "logs_wiki_2": "{{user_full_name}} edited wiki {{title}}.",
  "Project Group Details": "Project Group Details",
  "files_source_title": "Source",
  "you_are_an_group_admin": "You are an Administrator in groups of this person. You can create projects in this system.",
  "Client View (HTML)": "Client View (HTML)",
  "My Account": "My Account",
  "How do you stay organized?": "How do you stay organized?",
  "Generate": "Generate",
  "Add to Milestone": "Add to Milestone",
  "disc_view_archived_link_title": "View Archived Discussion Lists",
  "files_no_files_try_sub_part3_in_subfolders_word": "in subfolders",
  "Please validate coupon first!": "Please validate coupon first!",
  "Milestones in calendar application": "Milestones in calendar application",
  "upsell_tasks_try_subtasks": "Try <b>Subtasks Pro</b> and be able to",
  "it_status_in_progress": "In Progress",
  "previous": "previous",
  "auth_email_confirmed": "Email successfuly confirmed!",
  "Last Updated": "Last Updated",
  "Delete with tasks": "Delete with tasks",
  "Edit own wiki": "Edit own wiki",
  "Check it out": "Check it out",
  "Already a user?": "Already a user?",
  "tasks_no_start_date_proj": "Tasks in this project do not support start date.",
  "All Projects": "All Projects",
  "Seems this Email In record has been deleted. Please refresh page.": "Seems this Email In record has been deleted. Please refresh page.",
  "Files linked from Dropbox": "Files linked from Dropbox",
  "calendar_delete_link": "This calendar link will be deleted. We advise to remove it from external calendars as well.",
  "All": "All",
  "Authorization info removed.": "Authorization info removed.",
  "manage_clone_project_group_id": "Project Group for new Project",
  "Freelancer": "Freelancer",
  "Projects selected are not gsync enabled.": "Projects selected are not GSync enabled.",
  "Expand groups": "Expand groups",
  "Create your first task": "Create your first task",
  "cf_confirm_msg_in_projects": "in %d %s",
  "c_due_date_set": "Due Date Set",
  "c_send": "Send",
  "Change Email Address": "Change Email Address",
  "Total": "Total",
  "cft_select_field_type_first": "Select field type first!",
  "Scroll to Last Comment": "Scroll to Last Comment",
  "c_file_embed_full_title": "Full",
  "logs_milestones_8_notify": "{{user_full_name}} completed milestone.",
  "files_filter_dropbox": "Dropbox",
  "next": "next",
  "wall_seems_status_deleted_msg": "Seems this status was deleted by other user",
  "Instantly sync your Freedcamp calendars to Google calendar": "Instantly sync your Freedcamp calendars to Google calendar",
  "As you already trialed some plan you can start new trial only for the bigger plan": "As you already trialed some plan you can start new trial only for the bigger plan",
  "disc_manage_groups_link_title": "Manage Discussion Lists",
  "Date, asc": "Date, asc",
  "group_archive_project_question": "Are you sure you want to archive all group projects?",
  "files_unknown_content_msg": "Content of the file does not match any supported extension.",
  "tasks_link_copy_clipboard_and_close": "Copy link to clipboard &amp; Close",
  "it_type_performance": "Performance",
  "crm_delete_lnk": "delete",
  "add_new_field_button": "Add Field",
  "help_apps_suggestions": "Application Suggestions",
  "team_name_projects": "Global Team <strong>%s</strong> - projects",
  "help_troubleshooting": "Troubleshooting FAQ",
  "There are no tasky todos matching your criteria": "There are no Tasky todos matching your criteria.",
  "Manage Project": "Manage Project",
  "dash_no_desc": "No Description",
  "try_business_plan": "Try Business Plan",
  "feature_milestones_desc": "Group lists of tasks and set a goal by a certain date, give your team something to look forward to",
  "manage_group_created_label": "Created",
  "Group members": "Group members",
  "tasky_short_descr": "Simple personal tasks that will not be shared with anyone else.",
  "Your message": "Your message",
  "Please enter a valid Email": "Please enter a valid Email",
  "shift_dates_affected_tasks_free": "Only tasks and subtasks having due dates will be rescheduled.",
  "Updated by": "Updated by",
  "upload_onedrive": "OneDrive",
  "tasks_add_subtask": "Add Subtask",
  "proj_descr_placeholder": "Project description (optional)",
  "request_access_explanation": "You are browsing a Freedcamp public project.",
  "copy_hint_invite_singular": "%s HINT%s: You can invite this user to the destination project and retry after.",
  "matches": "The %s field does not match the %s field.",
  "Calendars": "Calendars",
  "%s has just unarchived project %s, which is active now": "%s has just unarchived project %s, which is active now",
  "greater_than_date": "Entered date must be equal or greater than %s",
  "files_popup_file_descr_title": "File Description",
  "Manage notification subscriptions for other user item for himself": "Manage notification subscriptions for other user item for himself",
  "Enter name": "Enter name",
  "You do not have access to this project": "You don't have access to this project.",
  "passman_import_csv": "Import CSV",
  "logs_wiki_1_notify": "{{user_full_name}} added wiki.",
  "End date": "End date",
  "leave_reason_site_slow": "Site was too slow or sluggish",
  "passman_title": "Title",
  "c_decline": "Decline",
  "no_perm_to_task_only_mile": "You don't have permissions to delete tasks. Press \"Delete\" to delete only milestone.",
  "reduce_users_from_date": "You can reduce users from %s (%s).",
  "Delete other user wiki": "Delete other user wiki",
  "time_error_red_msg_1": "We've detected that some of your time entries contain invalid values.",
  "time_date": "Date",
  "Delete Item": "Delete Item",
  "manage_clone_project_people_remove_opt": "Remove all people",
  "c_app_wall": "Wall",
  "crm_contacts_phone_title": "Phone",
  "Contact Us": "Contact Us",
  "copy_move_task_title": "Copy or Move task: %s",
  "rsvp_created_by": "Created By",
  "crm_contacts_social_tumblr": "Tumblr",
  "tasks_complete_on": "Complete On",
  "help_contacting_customer_support": "Contacting Customer Support",
  "auth_confirmation_resent": "Verification email sent. Please check your email.",
  "and": "and",
  "recurr_msg_not_allowed": "Recurrence is not allowed.",
  "tasks_invalid_status": "Please enter a valid progress value!",
  "Great! We have specially designed apps just for you!": "Great! We have specially designed apps just for you!",
  "crm_calls_date_title": "Call Date",
  "You are deleting a Project Group.": "You are deleting a Project Group.",
  "includes you": "includes you",
  "Change due date for own milestone": "Change due date for own milestone",
  "logs_calendar_1": "{{user_full_name}} added event {{title}}.",
  "Confirm Password": "Confirm Password",
  "Please wait a moment and try again.": "Please wait a moment and try again.",
  "Delete folder": "Delete folder",
  "disc_comments_title": "Comments",
  "help_file_edit": "FileEdit",
  "Email notifications": "Email notifications",
  "Upgrade for more features": "Upgrade for more features",
  "files_back_to_files": "Back To Files",
  "files_list_folder_more_info_hint": "More info",
  "Can not find the comment": "Can't find the comment.",
  "c_we_notified": "We have been notified and will look into the problem. We apologize for any inconvenience.",
  "save_yourself_the_hassle": "Save yourself the hassle of paying every single month and make it easier on your wallet.",
  "mkplc_upgrd_storage": "Upgrade Storage",
  "Save changes": "Save changes",
  "c_cancel": "Cancel",
  "Monthly view": "Monthly view",
  "contact_support_to_change_own_domain": "You use own domain, contact help@freedcamp.com if you want to change it.",
  "Got it!": "Got it!",
  "help_files_app": "Files Application and File Upload",
  "tasks_drag_here_part2_to_complete": "to set it to complete",
  "wall_who_online": "Who's Online",
  "tasks_import_xls": "Import XLS",
  "Groups and Projects": "Groups & Projects",
  "passman_master_doesnt_match": "The Master Password does not match. Please try again.",
  "c_url_with_filters_copied": "Link containing current filter selection was copied to clipboard.",
  "crm_calls_direction_outbound": "Outbound",
  "storage_plan_8": "Basic - Yearly",
  "leave_reason_used_before": "What did you use before Freedcamp?",
  "c_app_public_projects": "Public Projects",
  "pay_yearly_save": "%spay yearly and save%s",
  "manage_install_right_apps": "Start Your Project by Installing the Right Apps.",
  "switched_to_plan_monthly": "Switched to the <b>%s Plan</b>, paying <b>monthly</b>",
  "crm_contacts_fname_title": "First name",
  "invoices_item_deleted": "Item deleted!",
  "activate_successful": "Account Activated",
  "language request email": "language request email",
  "invoice_create_estimate_success_msg": "New estimate created!",
  "Date": "Date",
  "tasks_view_kanban": "Kanban",
  "You have no permissions to manage notifications for this user.": "You have no permissions to manage notifications for this user.",
  "we_unable_cancel_your_sub_do_it_manually": "We were unable to cancel your subscriptions. %sPlease do it manually%s.",
  "Price": "Price",
  "crm_contacts_lead_cat_title": "Lead Category",
  "Switching to old Manage Projects": "Switching to old Manage Projects",
  "backup_plan_1": "Daily Backups",
  "auth_new_passw_label": "Enter new password",
  "Skip Weekends": "Skip Weekends",
  "wiki_no_perm_del_group": "You have no permissions to delete this list.",
  "dash_proj_card_link_delete": "Delete Project",
  "change_role_globally_error_choose_permission": "Choose a permission level!",
  "auth_email_address_title": "Email Address",
  "Add Time task": "Add Time task",
  "All issues": "All issues",
  "logs_time_3_notify": "{{user_full_name}} deleted time entry.",
  "Some quick things to get you started": "Some quick things to get you started",
  "One Click Login": "One Click Login",
  "no_created": "You don't have any updates in items created by you",
  "Your available backups": "Your available backups",
  "mkplc_app_users_num": "%s users",
  "files_info_versions_title": "Versions",
  "change_role_globally_profiles_link": "Show more information about each role",
  "Save and Add Another": "Save &amp; Add Another",
  "Ordered": "Ordered",
  "displayActivate": "Repeats every",
  "crm_contacts_phone_fax": "Fax",
  "user_can_see_discussion": "Users that can see the discussion",
  "Task successfully copied.": "Task successfully copied.",
  "manage_clone_project_exist_earliest_date_title": "Existing project earliest due date is %EARL_DATE% for %ITEM_NAME%",
  "HTML version": "HTML version",
  "recap_include_pr_names": "include project names",
  "invalid_linkedin": "Please enter a valid LinkedIn link",
  "Upgrade to specifc paid plans to get access": "Upgrade to %s to get access.",
  "Project Teams": "Project Teams",
  "tasks_add_group": "Add a new Task List",
  "CRM": "CRM",
  "Interface highlights": "Interface highlights",
  "mkplc_types_app": "Types of Applications",
  "change_role_globally_non_billable": "not billable on paid plans",
  "crm_contacts_im_yahoo": "Yahoo",
  "help_data_feed_links": "Data Feed Links",
  "Completed tasks": "Completed tasks",
  "cft_f_type_dropdown": "Dropdown",
  "it_newest_issues": "Newest Issues",
  "Wall is a project group application": "Wall is a project group application",
  "crm_contacts_export_csv": "Export all contacts as csv",
  "time_no_perm_to_del": "You have no permissions to delete this time record.",
  "SSO with SAML": "SSO with SAML",
  "Subscribed successfully to Google Calendar": "Subscribed successfully to Google Calendar!",
  "c_due_soon": "due soon",
  "Please share!": "Please share!",
  "tasks_seems_group_deleted_msg": "This list was probably deleted by another user.",
  "File Usage": "File Usage",
  "Owner": "Owner",
  "pro_plan_desc": "For those who need a bit more power to complete individual or group projects.",
  "c_start_due_date": "Start/Due Date",
  "mkplc_module_installed": "Module has been successfully installed.",
  "c_add_wiki_version": "Add Version",
  "daily_recap_require_attention": "Require Immediate Attention",
  "Show More": "Show More",
  "Add Wiki": "Add Wiki",
  "You have no permissions add new discussion": "You have no permissions add new discussion.",
  "Adding Invoices": "Adding Invoices",
  "no_permissions_to_delete": "You don't have enough permissions to delete.",
  "upload_use_webcam": "use webcam",
  "Billable": "Billable",
  "Daily digest email": "Daily digest email",
  "click_to_create_new_project": "Click here to create a project.",
  "upload_drop_file_here": "drop a file here",
  "c_filter_last_n_months": "Last %s Months",
  "passman_edite_success_msg": "Edited Successfully!",
  "disc_default_group_name": "Discussions List",
  "Resend Invitation": "Resend Invitation",
  "Add more Group Applications from our %s Marketplace %s!": "Add more Group Applications from our %s Marketplace %s!",
  "tasks_drag_here_part1": "Drag a Task in here",
  "backup_upgrate_plane_to_enterprise_desc": "upgrade to %sEnterprise %s plan to enable",
  "c_close": "Close",
  "Change due date for other user milestone": "Change due date for other user milestone",
  "see_whats_new_title": "See What's New in the All-New Freedcamp.",
  "You have decided to decline invitation to": "You've decided to decline invitation to",
  "Edit other user file": "Edit other user file",
  "custom_fields_title_manage": "Manage Custom Field Templates",
  "filter_project_group": "Project Group",
  "invoices_add_client_title": "Add Client",
  "Sync successfuly deleted.": "GSync has been successfuly deleted.",
  "open_2fa_app": "Open the authentication app and:",
  "Edit project application settings": "Edit project application settings",
  "it_type_exception": "Exception",
  "Select Projects": "Select Projects",
  "User will be invited to following projects": "User will be invited to following projects",
  "crm_sidebar_thisweek_header": "This week",
  "There are no wikis": "There are no Wiki pages yet.",
  "Add Users": "Add Users",
  "free_addons": "Free Add-ons",
  "c_assigned_to": "Assigned to",
  "Public Link": "Public Link",
  "Private 1:1 or 1:many conversations": "Private 1:1 or 1:many conversations",
  "mile_unarchive": "Unarchive milestone",
  "tasks_subtask_title_dual": "Subtasks",
  "it_edit_prefix": "Edit Prefix",
  "There are no active projects matching your criteria.": "There are no active projects matching your criteria.",
  "Get Started": "Get Started",
  "Searching": "Searching",
  "Name of company to be billed": "Name of company to be billed",
  "change_role_globally_error_self": "You cannot do this action on yourself!",
  "You have no permissions to assign to this user": "You have no permissions to assign to this user.",
  "Create Widget": "Create Widget",
  "auth_login_link_title": "login",
  "tasks_import_tpl_raw_descr_title": "Raw Description",
  "help_getting_started_prem": "Getting Started with Premium %s(9min)%s",
  "Public wikis for project": "Public wikis for project",
  "LinkedIn": "LinkedIn",
  "Change assignment for own item": "Change assignment for own item",
  "Avatar": "Avatar",
  "Show Help Hints": "Show Help Hints",
  "c_filter_last_week": "Last Week",
  "c_app_calendar": "Calendar",
  "Daily Backups": "Daily Backups",
  "Sorry, you have no permission to edit this shortcut.": "Sorry, you have no permission to edit this shortcut.",
  "invoices_back_invoices": "Back To Invoices",
  "contact_us_for_paid_invoice_subscr": "It was paid by invoice, please %scontact us%s to change your plan",
  "dash_view_all_link_title": "view all %d projects",
  "shift_dates_task_title": "Shift task dates for task: \"%s\"",
  "crm_item_type_lead": "lead",
  "Delete all out of sync": "Delete all out of sync",
  "Your SSO connections": "Your SSO connections",
  "c_asc": "Asc",
  "Start date for tasks and subtasks": "Start date for tasks and subtasks",
  "c_turn_on_to_filter_and_search_in_subfolders": "Turn on to filter and search in subfolders",
  "files_popup_hide_tree_lnk_title": "Hide tree",
  "Log Out": "Log Out",
  "Congratulations!": "Congratulations!",
  "Plan Name": "Plan Name",
  "auth_reset_email_sent": "Success! Email has been sent to email %s to reset password.",
  "recurr_contain_recurr_subs": "This item already contains recurrent subtask(s).",
  "reduce_request_note_annual": "<b>Note</b> - you will be billed for %s user(s) from %s, your subscription renewal date.",
  "invoices_save_draft": "Save as draft",
  "mkplc_for_any_app": "For any Application",
  "c_you": "You",
  "invoices_freshbook_api_url_title": "API URL",
  "logs_milestones_8": "Milestone {{name}} is now complete.",
  "help_emailing_into_freedcamp": "Emailing into Freedcamp",
  "for the People": "for the People",
  "Delete Project Group": "Delete Project Group",
  "upgrade_lite_check_more": "Check more <a href=\"%s\" target=\"_blank\">here.</a>",
  "tasks_invalid_priority": "Please enter a valid priority!",
  "logs_discussions_9_notify": "{{user_full_name}} said:</b> {{comment_description}}",
  "Allow To Join": "Allow To Join",
  "Recap view - all overdue and coming work for a project": "Recap view - all overdue and coming work for a project",
  "monthlyDayHuman": "day",
  "Select project groups and users to add/remove access to %s": "Select project groups and users to add/remove access to %s",
  "crm_delete_success_msg": "Deleted successfully!",
  "manage_view_legend_link_title": "View Legend",
  "Delete own file or its version": "Delete own file or its version",
  "All Rights Reserved": "All Rights Reserved",
  "to Business": "to Business",
  "We empower people to work together": "We empower people to work together",
  "cal_june": "June",
  "we_couldnot_detect_fc_account": "Sorry, we couldn't detect your Freedcamp account. Please %s email us %s to resolve.",
  "wiki_manage_groups_title": "Manage Wiki Lists",
  "dash_greeting_hi_word": "Hi",
  "Recipient mail": "Recipient mail",
  "users": "users",
  "manage_group_name_label": "Group Name",
  "Mark Read": "Mark Read",
  "mkplc_storage_updated": "Your storage plan has been updated.",
  "crm_contacts_im_windows_live": "Windows Live",
  "copy_task_list_title": "Copy task list: %s",
  "mkplc_subscribed_date": "Subscribed %s",
  "Change assignment for other user milestone": "Change assignment for other user milestone",
  "it_recent_activity": "Recent Activity",
  "onedrive_integration": "OneDrive integration",
  "Delete own comments": "Delete own comments",
  "Leave Group": "Leave Group",
  "disc_seems_group_deleted_msg": "This list was probably deleted by another user.",
  "Line %d, cloumn %s (%s): %scan be only one of these: %s": "Line %d, column %s (%s): '%s' - can be only one of these: %s",
  "You have successfully unsubscribed": "You have successfully unsubscribed!",
  "We will get back to you shortly.": "We'll get back to you shortly.",
  "passman_password_secured": "This password is secured with your Master Password",
  "Request can NOT be processed": "Request can NOT be processed",
  "This application can not be linked!": "This application can not be linked!",
  "You requested to reduce subscription users": "You requested to reduce subscription to %d user(s) (%s).",
  "c_here": "here",
  "files_no_files": "There are no files or folders.",
  "time_reset": "Reset",
  "login_email_unsuccessful": "Sorry, that email/password combination does not match our records.",
  "crm_view_action_lnk": "View",
  "refresh_and_try_again": "Please refresh and try again. If the problem persists, please contact support",
  "rangeByOccurrences1": "After",
  "c_wrong_parameters": "Wrong request parameters.",
  "Add Issue": "Add Issue",
  "Only items assigned to me": "Only items assigned to me",
  "Reset other user task time": "Reset other user task time",
  "You are importing Passwords from CSV file to %s Project group": "You are importing Passwords from CSV file to %s Project group",
  "files_file_not_found": "File not found!",
  "c_app_invoices": "Invoices",
  "Confirm Email Change": "Confirm Email Change",
  "You do not have a logo": "You do not have a logo",
  "Manage users": "Manage users",
  "You are trialing bigger plan now and can not start trial for the selected plan": "You are trialing %s plan now which includes all features from selected one.",
  "Visit Widgets page": "Visit Widgets page",
  "c_this_week": "This Week",
  "tasks_start_progress": "Start Progress",
  "Choose Users to Invite": "Choose Users to Invite",
  "Mark Unread": "Mark Unread",
  "Click to see this calendar in Freedcamp.": "Click to see this calendar in Freedcamp.",
  "c_list_name": "List Name",
  "cal_tue": "Tue",
  "mile_switch_to_old": "Switch to old Milestones",
  "Confirmation password is incorrect": "Confirmation password is incorrect",
  "private_project_app_not_allowed": "available in public projects only",
  "manage_add_project_name": "Project Name",
  "c_app_todos": "Tasks",
  "Storage Plan": "Storage Plan",
  "Verification code resent": "Verification code resent",
  "auth_confirm_email": "Please confirm your email first.",
  "last 30 days": "last 30 days",
  "manage_app_is_not_installed": "Specified application doesn't installed in this project",
  "old_pricing_not_available_after_migration": "Old pricing will no longer be available as an option after migration.",
  "No new notifications": "No new notifications.",
  "help_delete_acc": "Delete Account",
  "to_close": "to close",
  "tasks_view_as": "View as",
  "Create Team": "Create Team",
  "help_requests_link_title": "Requests",
  "Other": "Other",
  "Do not see yours listed?": "Do not see yours listed?",
  "c_action": "Action",
  "crm_contacts_im_skype": "Skype",
  "In this case %s do not delete your account now %s.": "In this case %s do not delete your account now %s.",
  "passman_password_not_secured": "This password is NOT secured with your Master Password",
  "copy_cf_msg_plural": "%sCustom field templates%s \"%s\" are not used in a destination project and will not be copied/moved.",
  "noEndDate": "The End date is not set. Please set a correct value",
  "Easy as drag and drop": "Easy as drag and drop",
  "Edit other user event": "Edit other user event",
  "crm_campaign_res_added_success_msg": "Campaign result added successfully!",
  "crm_campaign_results_header": "Results",
  "Project Settings": "Project Settings",
  "help_bugs_link_title": "Bugs",
  "User will be removed from following projects": "User will be removed from following projects",
  "customer satisfaction rating": "customer satisfaction rating",
  "dash_proj_card_link_people": "People",
  "recap_weekly_opt": "Weekly (Mon)",
  "manage_chose_profile_label": "Choose profile",
  "Contact Support Now": "Contact Support Now",
  "People view - check details, start new tasks, discussions": "People view - check details, start new tasks, discussions",
  "manage_clone_not_enough_space_err": "There is not enough free space in the storage to copy files for all chosen applications.",
  "auth_email_change_request": "Verification code has been sent to %s",
  "time_no_perm_to_reset": "You have no permissions to reset recorded time for this time record.",
  "Cancel Bulk Invite": "Cancel Bulk Invite",
  "invalid_phone": "Please enter a valid Phone number",
  "crm_sidebar_contacts_btn": "Contacts",
  "Your plan details": "Your plan details (%s click here %s)",
  "Remove Team From Project": "Remove Team From Project",
  "daily_recap_act_3": "Break the task down into clearer, easier to achieve chunks - create a new task or subtasks",
  "c_add_discussion": "Add Discussion",
  "Filter and sort": "Filter and sort",
  "Application subscriptions": "Application subscriptions",
  "Add To Milestone": "Add To Milestone",
  "disc_archive_group_lnk_hint": "Archive List",
  "account_creation_duplicate_username": "Username Already Used or Invalid",
  "invoices_add_client_plural": "Add Clients",
  "tasks_nothing_matched_search": "Hmm... nothing matches your search.",
  "manage_choose_apps_you_need": "Get More out of Freedcamp by Choosing Apps You Need.",
  "crm_campaign_start_date_title": "Start Date",
  "Group Administrators": "Group Administrators",
  "Default notifications level for new projects": "Default notifications level for new projects",
  "Manage notification subscriptions for own wiki": "Manage notification subscriptions for own wiki",
  "Organizer": "Organizer",
  "it_oldest_activity": "oldest activity",
  "logs_milestones_1_notify": "{{user_full_name}} added milestone.",
  "files_filter_more_than_n_mb": "More than %d MB",
  "Backup Plan": "Backup Plan",
  "time_no_entries": "There don't seem to be any time entries!",
  "c_tags_lbl": "Tags",
  "daily_backups": "Daily compliance backups of all data",
  "save_and_email": "Save & Email to Client",
  "manage_applications_title": "Applications",
  "API URL": "API URL",
  "logs_files_10_notify": "{{user_full_name}} deleted comment in file.",
  "disc_no_discussions_add": "Start your first Discussion",
  "invoices_ftask_rate": "First task rate",
  "Short walkthrough": "Short walkthrough",
  "crm_contacts_im_other": "Other",
  "tasks_progress_in_progress": "In Progress",
  "Time Format": "Time Format",
  "Project Group admin": "Project Group admin",
  "mkplc_price_per_month_full": "/month",
  "task_copied_link": "Click %s here %s to view the task.",
  "Skype": "Skype",
  "All Group Users": "All Group Users",
  "logo_title": "Freedcamp - Free Effortless Collaboration for Teams",
  "group_apps_unsaved_changes": "You have unsaved changes! Save before you leave.",
  "leave project": "leave project",
  "Renew": "Renew",
  "choose_diff_plan_or_periodicity": "Please choose different plan or periodicity.",
  "c_export_time_title": "Time Records Export",
  "Prev": "Prev",
  "crm_campaign_status_on_hold": "On Hold",
  "mkplc_subscr_something_wrong": "Something went wrong with your subscription. Please contact support.",
  "files_popup_add_folder_lnk_hint": "Add folder",
  "crm_contacts_custom_fields_new_field": "New Field",
  "You are not logged in.": "You are not logged in.",
  "Canceled": "Canceled",
  "reports_overdue_tasks_singular": "open overdue task",
  "help_marketplace_title": "Marketplace",
  "cft_filter_label": "Custom Template",
  "impr_act_selected": "selected",
  "tasks_tag_started_word": "Started %s",
  "tasks_group_updated_msg": "Task list has been successfully updated!",
  "Verification Code": "Verification Code",
  "New topic": "New topic",
  "c_confirm": "Confirm",
  "value": "value",
  "Update information before invite": "Update information before invite",
  "feature_crm_desc": "Store all your contacts and leads to maintain a healthy relationship with your customers",
  "c_export": "Export",
  "Show emergency codes": "Show emergency codes",
  "logs_milestones_0": "action has been performed in milestones.",
  "Subscribe for a year and save 10%": "Subscribe for a year and save 10%",
  "You have no permissions to upload new file": "You have no permissions to upload a new file.",
  "it_assign_to_me": "Assign to Me",
  "crm_campaign_assign_to_title": "Assigned To",
  "Calendar event has been successfully added": "Calendar event has been successfully added.",
  "Sorry, that email/password combination does not match our records.": "Sorry, that email/password combination does not match our records.",
  "Overview": "Overview",
  "tasks_no_perm_order": "You have no permissions to change tasks order.",
  "cant_delete_already_in_progress": "Can't delete a group that's already being deleted.",
  "files_add_version_title": "Add Version",
  "auth_welcome_title": "Welcome!",
  "c_upgrade_storage_2": "here",
  "Email notigications": "Email notifications",
  "c_change": "Change",
  "c_comment_url_copy_manually": "Please copy comment link from the address bar manually.",
  "disc_sort_by_title": "Sort By",
  "Show Archived Projects": "Show Archived Projects",
  "Sum of points": "Sum of points",
  "gt_user_is_part_of_msg": "User is part of another Global Team for this project.",
  "h_Home": "Home",
  "Options": "Options",
  "invoices_total_tax": "Total tax",
  "help_projects_overview": "Projects Overview",
  "invoices_duplicate_invoice": "Duplicate Invoice",
  "%s from %s": "%s (%s)",
  "time_by_label": "By",
  "manage_account_new_password": "New Password",
  "You are importing Tasks from XLS file to %s project": "You are importing Tasks from XLS file to %s project",
  "c_app_storage": "Storage",
  "auth_terms_link_agree_3": "of Freedcamp",
  "to get started": "to get started",
  "crm_contacts_lead_cat_converted": "Converted",
  "disc_private_msg": "This is private discussion!",
  "invoices_grand_total": "Grand total",
  "two_factor_auth": "Two Factor Authentication",
  "learn_more_about_2fa": "%sLearn more about two-factor authentication%s at our help page.",
  "Number of successfully imported tasks: %d": "Number of successfully imported tasks: %d",
  "Widget Board": "Widget Board",
  "help_passwords_app_title": "Password Manager",
  "Edit Group": "Edit Group",
  "no_access_to_application": "You don't have access to this application.",
  "switched_to_free_storage": "Switched to <b>%s</b> free storage",
  "crm_calls_duration_title": "Duration",
  "ribbon_manage_account": "Manage account",
  "Mass removal": "Mass removal",
  "Invitation sent.": "Invitation sent.",
  "project_switcher_shortcuts": "Project Switcher Shortcuts",
  "HOW FREE IS FREEDCAMP": "HOW FREE IS FREEDCAMP",
  "wall_view_more": "View More",
  "files_download_zip_limit": "This feature is enabled when sum of file sizes is less than %s.",
  "logs_bugtracker_2": "{{user_full_name}} updated an issue.",
  "auth_verify_code_placeholder": "Verification code",
  "Date added, desc": "Date added, desc",
  "logs_time_12_notify": "{{user_full_name}} reset time entry.",
  "logs_bugtracker_1_notify": "{{user_full_name}} added issue.",
  "Edit prefix": "Edit prefix",
  "c_item_discussion_title": "Discussion",
  "Change progress status for other user issue": "Change progress status for other user issue",
  "certificate": "Certificate",
  "files_no_files_try_sub_part1": "No results found in %s.",
  "shift_dates_hint_2": "Please use the %s\"More options\"%s section for more customization.",
  "Public projects you followed are stacked in a special group Public Projects": "Public projects you followed are stacked in a special group 'Public Projects'",
  "Add Project": "Add Project",
  "help_managing_subscriptions": "Managing Marketplace Application Subscriptions",
  "help_custom_fields_beta": "Custom Fields",
  "c_app_project_templates": "Project Templates",
  "c_due_date_tpl": "due %s",
  "Calendar link created.": "Calendar link created.",
  "Group Owner": "Group Owner",
  "time_no_perm_to_complete": "You have no permissions to mark as Completed this time record.",
  "Full name": "Full name",
  "tasks_no_order_change": "New order was not saved. Please change sorting to 'Set order' for this.",
  "rsvp_awaiting": "Awaiting",
  "Remove user (global)": "Remove user (global)",
  "Freedcamp support": "%s support",
  "delete_successful": "User Deleted",
  "All files": "All files",
  "rtpl_mondayfriday": "Monday and Friday",
  "manage_clone_project_sel_init_due_date_title": "Select new date for this record and all other records will change accordingly",
  "crm_import_wrong_xls_file_format": "Only .xls file format is supported  now.",
  "help_marketplace_apps": "Marketplace Applications",
  "cal_mon": "Mon",
  "Please choose initial due date": "Please choose initial due date",
  "recap_reminders_warning": "You will not receive email reminders for start and end dates when Recap email is switched off.",
  "Manage": "Manage",
  "Users that can see the wiki": "Users that can see the wiki",
  "simply_edit_it": "Simply edit it.",
  "time_time_update_success_msg": "You have successfully updated the time record!",
  "c_status": "Status",
  "mkplc_module_canceled": "You've successfully cancelled subscription for this module.",
  "Empty subscription": "Empty subscription",
  "auth_send_email_btn_title": "Email me instructions",
  "Completed Recently": "Completed Recently",
  "c_password": "Password",
  "reports_export_png": "Export as PNG",
  "Tasks created": "Tasks created",
  "help_email_subject_label": "Subject",
  "Change progress status for own item": "Change progress status for own item",
  "enter_password": "Enter your password",
  "help_tasky_app_title": "Tasky",
  "cal_date_to_earlier_date_from": "Date From must be equal or before Date To",
  "disc_sticky_lnk_title": "sticky",
  "help_user_invite_wo_email": "How to add users without email addresses",
  "Change assignment for other user item": "Change assignment for other user item",
  "Monthly": "Monthly",
  "help_task_groups": "Baskets for tasks - Task lists",
  "completed_task_perm_delete": "Completed tasks will be permanently deleted! It's a physical deletion and they can be restored.",
  "mkplc_app_canceled": "You've successfully cancelled subscription for this application.",
  "c_unassigned": "Unassigned",
  "Enter a Title for a New Shortcut": "Enter a Title for a New Shortcut",
  "Delete the Shortcut": "Delete the Shortcut",
  "login with": "or login with",
  "it_past_before_tag": "Then paste the following code right before your %s tag",
  "%d day overdue": "%d day overdue",
  "storage_items_title": "Google Drive, Dropbox, OneDrive",
  "c_edit": "Edit",
  "Copy Codes": "Copy Codes",
  "num_tasks_deleted": "%d task successfully deleted",
  "All but me": "All but me",
  "help_send_btn_title": "Send",
  "You can use comma separated list of emails or add first/last names this way": "You can use comma separated list of emails or add first/last names this way",
  "Reorder project groups and projects": "Reorder project groups and projects",
  "c_filtered_list": "filtered list",
  "project owner": "project owner",
  "invoices_email_not_sent_msg": "Email not sent!",
  "Turn Off": "Turn Off",
  "agree_with_terms": "I Agree to the %s terms & conditions %s.",
  "it_click_here_to_vew": "<a href=\"%s\">Click here</a> to add another issue.",
  "Select group": "Select group",
  "Daily view, saved quick access filters and a dark theme": "Daily view, saved quick access filters and a dark theme",
  "wall_seems_comment_deleted_msg": "Seems this comment was deleted by other user",
  "c_filter_next_n_days": "Next %s Days",
  "invoices_payment_of_amount": "Payment of %s on %s",
  "Notify": "Notify",
  "Manage notification subscriptions for own item": "Manage notification subscriptions for own item",
  "Error subscribing to Google Calendar, project not found": "Error subscribing to google calendar, project not found!",
  "features_coming_q": "What features are coming soon to Freedcamp?",
  "Time worked, asc": "Time worked, asc",
  "c_app_crm": "CRM",
  "Access Type": "Access Type",
  "No notifications match your filters selection": "No notifications match your filters selection - %sreset filters%s.",
  "mkplc_trial_canceled_on_date": "Trial canceled on %s.",
  "c_on": "on",
  "it_contains_many_projects": "It contains %d projects inside which will also be deleted.",
  "tasks_import_choose_file_msg": "First choose a file for import!",
  "proj_name_placeholder": "eg. Yosemite Trips, Groceries, Software X",
  "forgot_password_unsuccessful": "Unable to Reset Password",
  "Drag and drop in kanban": "Drag & drop in kanban",
  "crm_contacts_calls_to_contact": "Related Calls",
  "Delete Group": "Delete Group",
  "tasks_edit_list": "Edit List",
  "it_status_invalid": "Invalid",
  "files_file_bad_or_not_img_msg": "File is corrupted or contains a not supported image type.",
  "c_max_filesize_msg": "Sorry, file size should not exceed %d MB.",
  "edit_field_in_template": "Edit Field",
  "c_type": "Type",
  "time_no_perm_to_export_msg": "You have no permissions to export data.",
  "Quick Invite": "Quick Invite",
  "cal_wed": "Wed",
  "it_comments": "Comments",
  "daily_recap_day": "day",
  "manage_group_description_label": "Group Description:",
  "Select State": "Select State",
  "privat_hosting": "Dedicated private cloud hosting",
  "Calendar widget shows your milestones": "Calendar widget shows your milestones",
  "rsvp_msg_change": "Change your response",
  "Please select and copy link now": "Please select & copy link now",
  "pastEndDate": "The End date cannot be before start date",
  "This project has been deleted.": "This project has been deleted.",
  "c_user": "User",
  "email_lost_sync_url": "Please go to <a href=\"%s\">your account page</a> and resync cancelled calendar, if needed.",
  "calendar_filter_users_invited": "User Assigned/Invited",
  "regenerate_all_in_emails": "Regenerate all In emails",
  "Manage Global Team": "Manage Global Team",
  "demo_signup_instruction": "Go to the <a href = 'http://freedcamp.com'>http://freedcamp.com</a> and sign up.",
  "c_item_task_title": "Task",
  "Custom Fields added to a task": "Custom Fields added to a task",
  "unlimited_free_projects_storage": "Freedcamp gives unlimited storage for any number of projects to your whole team for free.",
  "dash_proj_card_advanced_label": "Advanced",
  "Weekly Overview": "Weekly Overview",
  "Print Codes": "Print Codes",
  "auth_you_invited": "You've been invited to new projects!",
  "Show all projects": "Show all projects",
  "auth_upload_avatar_advice": "Make conversations more visual, add a face to your name",
  "You have no permissions to clone project to the specified group": "You have no permissions to clone project to the specified group.",
  "Set up your Account": "Set up your Account",
  "Due today": "Due today",
  "it_no_issues_msg": "There are no issues",
  "Sorry, but Issue Tracker is currently disabled. Please contact support via email.": "Sorry, but Issue Tracker is currently disabled. Please contact support via email.",
  "Pricing": "Pricing",
  "Take a Photo": "Take a Photo",
  "help_one_drive": "OneDrive",
  "New permission level": "New permission level",
  "Successfully sent": "Successfully sent",
  "User is already present in all projects.": "User is already present in all projects.",
  "copy_or_move_list": "Copy / Move List",
  "crm_view_back_leads_lnk": "Back To Leads",
  "time_time_worked_error_msg": "The Time Worked field must contain a positive number.",
  "passman_passw_group": "Password List",
  "weeklyInterval2": "week(s)",
  "Billing Details": "Billing Details",
  "Assigned To Me In Read": "Assigned To Me & Read",
  "c_preview": "Preview",
  "feature_gantt_chart_desc": "The ultimate bird's eye view of your tasks, allowing you to quickly adjust your plans",
  "Group applications uninstalled.": "Group applications uninstalled.",
  "Filter passwords": "Filter passwords",
  "c_everyone": "Everyone",
  "manage_clone_project_keep_dates_lbl": "Do you want to set due dates for a new project relatively to an original project?",
  "add_info_you_want_add_your_to_invoice": "Add all information you want to be added to your invoice like company address, VAT etc.",
  "Agenda": "Agenda",
  "Feedback": "Get Support",
  "mkplc_purchase_apps": "Purchase Applications",
  "time_time_completed_error_msg": "Error while time record was completing",
  "crm_log_action_add": "add",
  "logs_todos_10": "{{user_full_name}} delete comment in a {{u_title}}",
  "upsell_tasks_templates": "Generate new projects based on a template with all the similar tasks",
  "you_pay_for_user_monthly": "You pay for %d user monthly.",
  "manage_own_sub_task": "Create / Add / Remove / Delete subtasks in own (sub)tasks",
  "sso_redirect_to_app": "Redirecting back to the application...",
  "crm_campaign_status_planned": "Planned",
  "help_suggestions_link_title": "Suggestions",
  "You dont have enough permissions or group does not exist.": "You dont have enough permissions or group does not exist.",
  "auth_forgot_password_2": "here",
  "subdomain_no_create_group": "You can't create project groups in %s.",
  "manage_other_users_in_created_by_other_sub_task": "Create / Add / Remove / Delete other users subtasks in (sub)tasks created by other users",
  "tasks_no_perm_to_edit_task": "You have no permissions to edit this task.",
  "auth_confirmation_resent_error": "Unable to send verification email. Please try refreshing the page.",
  "Edit Team": "Edit Team",
  "dash_no_widgets_1": "There are no widgets,",
  "Item ID": "Item ID",
  "Your Teams": "Your Teams",
  "Freedcamp White Label interface branding": "Freedcamp White Label interface branding",
  "You have no permissions to add new milestone": "You have no permissions to add a new milestone.",
  "Create Event": "Create Event",
  "crm_campaign_earnings_title": "Earnings",
  "Add Wiki Version": "Add Wiki Version",
  "copy_to_user_email": "Send a copy to my email",
  "Get a sweet app to stay organized": "Get a sweet app to stay organized",
  "password_change_unsuccessful": "Unable to Change Password",
  "passman_have_no_secured": "You have no passwords secured with the Master Password!",
  "manage_app_cantbe_uninstalled": "This application can not be uninstalled",
  "c_assign": "Assign",
  "White Label Settings page": "White Label Settings page",
  "time_stop_now_label": "Stop Now",
  "cal_all_day": "All day",
  "manage_create_project_simple": "Simple",
  "sso_login_with_sso_btn": "Sign In with %s SSO",
  "Invite Global Teams": "Invite Global Teams",
  "passman_group_empty": "The password list is empty.",
  "Language": "Language",
  "daily_recap_due_to_review": "Due to review",
  "Later": "Later",
  "tasks_import_tpl_ms_priority_title": "Milestone Priority",
  "From / Reply To Email": "From / Reply To Email",
  "Items I have responded to": "Items I've responded to",
  "num_tasks_deleted_plur": "%d tasks successfully deleted",
  "tasks_click_to_uncollapse": "Click to uncollapse",
  "auth_next_btn_title": "Next",
  "Total Tasks": "Total Tasks",
  "leave_reason_team_size": "Team Size",
  "Project members": "Project members",
  "In Emails were disabled and deleted": "In Emails were disabled and deleted!",
  "disc_no_perm_add_group": "You have no permissions to add a list.",
  "disc_disc_title": "Discussion",
  "ctrl_click_to_search_tag": "Ctrl+Click a tag to search",
  "Export all users": "Export all users",
  "Change due date for own issue": "Change due date for own issue",
  "crm_tasks_edit": "Edit Task",
  "time_seems_task_deleted_msg": "This time record was probably deleted by another user.",
  "it_last_activity": "Last Activity",
  "Choose Report": "Choose Report",
  "Uncheck All": "Uncheck All",
  "Your avatar has been reset to default.": "Your avatar has been reset to default.",
  "There is no undo for this operation!": "There is no undo for this operation!",
  "passman_change_mater_pass": "Change the Master Password",
  "Share": "Share",
  "files_open_on_google_drive": "Open on Google Drive",
  "c_set_date": "set date",
  "You have successfully left the group.": "You have successfully left the group.",
  "Invitation not found.": "Invitation not found.",
  "files_folder_title_plural": "Folders",
  "files_filter_box_title": "Box",
  "leave_reason_iphone_app_features": "iPhone application features",
  "files_filter_local_storage": "Local storage",
  "name_separate_expl": "Please add one comma to separate your first and last name.",
  "Cannot copy task list without tasks.": "Cannot copy task list without tasks.",
  "Application Page": "Application Page",
  "group_no_permissions": "Group does not exist or you dont have permissions.",
  "disc_no_groups_contact_admin": "Contact the project owner - this application should have at least one active Discussion list.",
  "Projects Group has been successfully created": "Projects Group has been successfully created",
  "project": "project",
  "People": "People",
  "sso_connection_add_title": "New SSO connection",
  "help_troubleshooting_users_access": "Troubleshooting users’ access",
  "tasks_edit_task_title": "Edit Task",
  "No Users": "No Users",
  "email_in_exampl": "When you copy an email to the Clipboard, it will contain email like",
  "Edit other user issue": "Edit other user issue",
  "files_update_success_msg": "File has been successfully updated!",
  "hide this message": "hide this message",
  "You have active subscription for this product": "You have active subscription for this product",
  "logs_files_3_notify": "{{user_full_name}} deleted file.",
  "it_status_open": "Open",
  "has access": "[has access]",
  "Updated on": "Updated on",
  "This %s is associated to Milestone": "This %s is associated to Milestone",
  "dash_proj_card_link_edit": "Edit Project",
  "Version Comparison": "Version Comparison",
  "add_new_template_button": "Add New Template",
  "Unlimited Storage": "Unlimited Storage",
  "Send an email to the person who reported issue": "Send an email to the person who reported issue",
  "Jen": "Jen",
  "files_folder_download_too_big_msg": "Selection is too big to be downloaded:",
  "logs_todos_5": "{{user_full_name}} uploaded a new file in todos.",
  "auth_reset_email_general_sent_2": "If we found a user with email address <b>%s</b>, you will receive an email from us shortly.",
  "200MB Storage": "200MB Storage",
  "upsell_tasks_why_upgrade": "Why Upgrade",
  "files_no_perm_file": "You don't have permissions for this file!",
  "cf_confirm_msg_entered_values": "You will lose %d %s",
  "Billing Agreement": "Billing Agreement",
  "Calendar Colors and Contrast": "Calendar Colors and Contrast",
  "payment_options_q": "What are my payment options?",
  "You do not have access to comments for this record": "You do not have access to comments for this record.",
  "Hide Completed": "Hide Completed",
  "files_filter_cloud_files": "Cloud files",
  "email_domains": "Email Domains",
  "All users": "All users",
  "logs_time_1": "{{user_full_name}} has added a new time entry.",
  "it_emailed_in": "Reported",
  "show": "show",
  "mkplc_module_subscr_updated": "You've successfully updated subscription for the module.",
  "why_q": "Why?",
  "All projects in report are either deleted or you lost access to them.": "All projects in report are either deleted or you lost access to them.",
  "invoices_remind_client": "Remind Client",
  "upload_box": "Box",
  "c_recent": "Recent",
  "request_access_join_project_message": "Please tell us about yourself and why you want to join the project",
  "cal_nov": "Nov",
  "Global Modules": "Global Modules",
  "Step 2": "Step 2",
  "First Group and Project": "First Group and Project",
  "isset": "The %s field must have a value.",
  "Custom Field creation interface": "Custom Field creation interface",
  "Add a new time task": "Add a new time task",
  "files_seems_file_deleted_msg": "Most likely this file was deleted by another user.",
  "Add Item": "Add Item",
  "matching %s": "matching \"%s\"",
  "Dates to Shift": "Dates to Shift",
  "time_stop_working": "Stop working",
  "c_or": "or",
  "logs_discussions_9": "{{user_full_name}} commented on discussion {{name}}",
  "cft_no_entries": "There are no Custom Field Templates, click below to create some!",
  "reduce": "reduce",
  "c_progress": "Progress",
  "manage_account_old_password": "Old Password",
  "invoices_rate_price": "Price/Rate",
  "leave_reason_mobile_browser_issues": "Mobile browser usage issues",
  "tasks_import_tpl_ms_due_date_title": "Milestone Due Date",
  "passman_notify": "Notify",
  "export_descriprion": "You can export 90 days at a time<br>Starting from",
  "last 7 days": "last 7 days",
  "time_task_save_title": "Save Time Record",
  "c_timezone_update": "Do you want to change your time zone to ",
  "c_tomorrow": "Tomorrow",
  "Google Calendar": "Google Calendar",
  "File Storage Subscriptions": "File Storage Subscriptions",
  "This backup can not be downloaded now": "This backup can not be downloaded now, please contact support",
  "tasks_no_groups_contact_admin": "Contact the project owner - this application should have at least one active Task List.",
  "Delete project": "Delete project",
  "rsvp_answer_no": "No, I'm not going",
  "tasks_choose_date_tag": "Choose date then drag me",
  "%s plan will backup these projects": "%s plan will backup these projects",
  "manage_back_link_title": "Back",
  "white_label_short_descr": "Customize Freedcamp with your company's branding.",
  "Invalid assignee": "Invalid assignee.",
  "the_sub_will_renew_on": "The subscription will renew on %s.",
  "Available Project Applications": "Available Project Applications",
  "recent projects": "recent projects",
  "viewing_older_version": "You are viewing an older version of this Wiki",
  "cal_sep": "Sep",
  "select_monthly_billable_users": "Select monthly billable users",
  "Files linked from Google Drive": "Files linked from Google Drive",
  "crm_dashboard_no_items_msg": "There are no CRM items to display.",
  "tasks_list_is_not_shown": "The task you saved may be missing on this page as tasks are shown on multiple pages right now.",
  "user_will_remove_from_next_billing": "This user will be removed from this list next billing month",
  "12 hrs format": "12 hours",
  "Changes saved.": "Changes saved.",
  "tasks_widget_no_completed_tasks_msg": "There are no completed tasks to delete.",
  "time_start_working": "Start working",
  "logs_todos_5_notify": "{{user_full_name}} uploaded a new file in {{entity_title}}.",
  "backup_plan_descr_2": "Get your data emailed to you weekly with all the data in your projects",
  "Upload Avatar": "Upload Avatar",
  "Temporary disabled": "Temporary disabled",
  "c_filter_today_tomorrow": "Today/Tomorrow",
  "You have no unread notification": "You have no unread notification.",
  "Wall comment has been added": "Wall comment has been added.",
  "cal_july": "July",
  "Free Applications": "Free Applications",
  "manage_view": "view",
  "help_manage_apps": "Manage Applications",
  "Can edit own tasks and subtasks": "Can edit own tasks and subtasks",
  "codes_copied": "Codes are copied to clipboard!",
  "close_shortcuts": "Close Shortcuts",
  "it_add_html_anywhere": "Add the following html code anywhere in your website",
  "no_credit_card_required": "no credit card required",
  "dash_avatar_hint_user_word": "User",
  "purchased_plan_yearly": "Purchased the <b>%s Plan</b>, paying <b>yearly</b>",
  "crm_contacts_social_title": "Social",
  "Change assignment for own issue": "Change assignment for own issue",
  "help_users_teams_perm": "Users, Teams, Permissions %s(8min with chapters)%s",
  "Move to Monday or not": "Move to Monday or not",
  "help_marketplace_descr": "Any issues with a coupon or your billing? Or anything involving the marketplace?",
  "mkplc_app_ask_question": "Ask Question",
  "Comments left": "Comments left",
  "Manage Group Administrators": "Manage Group Administrators",
  "manage_drag_to_invite_3": "to invite new members.",
  "c_completed": "Completed",
  "No, thanks": "No, thanks",
  "c_app_wiki": "Wiki",
  "c_zip": "Zip",
  "noRepeatOn": "The Repeat on value must be selected",
  "mkplc_fc_marketplace": "Freedcamp Marketplace",
  "logs_todos_13_notify": "{{user_full_name}} updated comment in {{entity_title}}.",
  "link": "link",
  "mile_date_in_the_past_msg": "You have selected a date in the past!",
  "help_videos_title": "Video Tutorials",
  "orderIndexes_4": "fourth",
  "upsell_recurrence_description": "Set how frequently your tasks and events should repeat",
  "email_access_removed_gsync": "Freedcamp was not able to connect to Google and sync was deactivated for the following calendars:",
  "rsvp_no": "No",
  "passman_shared_with": "Shared With",
  "files_open_on_box": "Open on Box",
  "c_item_crm_call_title": "CRM Call",
  "Find easily with filters and sorting": "Find easily with filters and sorting",
  "tasks_create_next_error": "Generate next task error",
  "fc_news_tips_tricks": "Freedcamp newsletters, tips & tricks subscriptions",
  "logs_todos_1": "{{user_full_name}} has added a new {{entity_title}}.",
  "c_save_list": "Save List",
  "Add user to all group projects": "Add user to all group projects",
  "invoices_print_invoice": "Print Invoice",
  "time_task_edit_title": "Edit Time Record",
  "Project Successfully Deleted": "Project Successfully Deleted",
  "Send_me_copy": "Send me a copy",
  "c_title": "Title",
  "crm_incomplete": "incomplete",
  "Access request sent.": "Access request sent.",
  "regenerate_all": "Regenerate all",
  "wall_view": "View",
  "manage_back_dashboard_link_title": "Back to Dashboard",
  "Unlimited and Free": "Unlimited & Free",
  "operation_is_not_supported": "This operation is not supported.",
  "notif_level_minimal": "Minimal",
  "User not found": "User not found",
  "Global team": "Global team",
  "disc_order_activity_title": "Activity",
  "auth_email_change_expired": "Your email change request expired",
  "All times": "All times",
  "c_app_google_drive": "Google Drive",
  "Private - Only Selected Users": "Private - Only Selected Users",
  "dash_reports_page_title": "Reports",
  "logs_time_14": "time task {{description}} has been unbilled.",
  "Manage notification subscriptions for other user task for other users": "Manage notification subscriptions for other user task for other users",
  "manage_pending_invite_hint": "Pending invite",
  "logs_todos_9": "{{user_full_name}} commented on task {{u_title}}",
  "logs_files_0": "action has been performed in files.",
  "you_canceled_last_sub": "You successfully canceled last old subscription and switched to new Free plan",
  "Clear Search": "Clear Search",
  "manage_back_manage_projects_link_title": "Back to Manage Projects",
  "Do you also want to delete Google Calendar?": "Do you also want to delete Google Calendar?",
  "current user": "current user",
  "Change progress status for other user item": "Change progress status for other user item",
  "Add people from other projects": "Add people from other projects",
  "Upload new version for the other user file": "Upload new version for the other user file",
  "recurr_msg_this_task_is_auto_generated": "This occurrence was generated automatically.",
  "passman_encrypt_your_passwords_msg": "Encrypt your passwords so they can't be seen by anyone without a secret code!",
  "delete": "delete",
  "help_users_and_teams": "Users & Teams",
  "help_misc": "MISC",
  "more_group_apps_from_addons_page": "Add more Group Applications from our %s Add-ons page %s!",
  "The following project owned by you will be also deleted": "The following project owned by you will be also deleted",
  "files_parent_folder_title": "Parent folder",
  "cft_choose_template": "Choose Template",
  "Remove user from project group": "Remove user from project group",
  "tasks_create_next": "Generate next task",
  "Invite Users": "Invite Users",
  "mile_hide_completed_label": "Toggle Completed",
  "logs_discussions_5": "{{user_full_name}} has uploaded a new file in discussion {{name}}",
  "email_sent_successfully": "Email sent successfully!",
  "%s is too short.": "%s is too short.",
  "per user": "per user",
  "Backups type": "Your Backups type",
  "submit_template_form": "Save Template",
  "Delete other user item": "Delete other user item",
  "Former Member": "Former Member",
  "it_no_other_issue": "No Other Issues",
  "Check it Out": "Check it Out",
  "Create Custom Field Templates and apply them to projects": "Create Custom Field Templates and apply them to projects",
  "disc_private_hint": "Restrict the users who can actually see this Discussion.",
  "tasks_default_group_name": "Task List",
  "time_doing_label": "Doing",
  "cft_custom_fields": "Custom Fields",
  "billings_will_sent_to": "Billing emails will be sent to",
  "c_cancel_low": "cancel",
  "Reason": "Reason",
  "Google Play Android": "Google Play Android",
  "copy_or_move_task": "Copy / Move task",
  "manage_team_title_2": "project in",
  "Feel a whole new level of productivity": "Feel a whole new level of productivity",
  "invoices_organization_title": "Organization",
  "Time since registration coefficient": "Time since registration coefficient",
  "crm_contacts_custom_field_close_link": "close",
  "Add all teams": "Add all teams",
  "manage_clone_project_title": "Use existing project to create a new one",
  "help_group_proj_user_app_modules": "Group/Project/User applications and modules",
  "Next Week": "Next Week",
  "it_assigned_to_me": "Assigned To Me",
  "regenerate_enabled": "Regenerate where enabled",
  "c_action_collapse_str": "Collapse",
  "help_issue_tracker_app_title": "Issue Tracker",
  "Something has gone wrong during import": "Something has gone wrong during import",
  "purchased_plan_monthly": "Purchased the <b>%s Plan</b>, paying <b>monthly</b>",
  "mkplc_trial_expired_on_date": "Trial expired on %s.",
  "time_date_label": "Date",
  "disc_add_new_group_btn_title": "Add a new Discussion list",
  "recurr_msg_nested_forbidden": "Sorry, we do not support nested recurrences.",
  "Invoices and History": "Invoices & History",
  "crm_contacts_import_vcard": "Import from vcard file",
  "upsell_tasks_gantt_desc": "Organize your project tasks with an Advanced Gantt Charts option",
  "files_list_download_btn_hint": "Download",
  "invoices_freshbook_import": "Freshbooks Import",
  "feature_wiki_desc": "Your organization has documentation and needs a place to keep multiple versions of each document",
  "tasks_view_arch_group_plural": "View %d archived lists",
  "Resync all out of sync": "Resync all out of sync",
  "mkplc_no_app_subscr": "You don't have a subscription for this application.",
  "c_add_wiki": "Add Wiki",
  "logs_discussions_1": "{{user_full_name}} has added a new discussion.",
  "Search Text": "Search Text",
  "c_app_onedrive": "OneDrive",
  "There are no users in this project.": "There are no users in this project.",
  "subtasks_short_descr": "Manage multi-level subtasks with advanced functionality.",
  "Select task list": "Select task list",
  "invoices_to_title": "To",
  "cal_may": "May",
  "backup_zip_type_description": "ZIP file",
  "My Projects": "My Projects",
  "it_status_review": "Review",
  "You are about to delete %s": "You are about to delete %s",
  "Add to all applications": "Add to all applications",
  "dash_create_new_project_link_title": "Create \n New Project",
  "Line %d, cloumn %s (%s): this column should not be empty": "Line %d, column %s (%s): this column should not be empty",
  "tasks_edit_task": "Edit Task",
  "Create New Task List": "Create New Task List",
  "crm_contacts_social_myspace": "Myspace",
  "Invitation has been deleted!": "Invitation has been deleted!",
  "Are you sure?": "Are you sure?",
  "front_price_monthly": "$%s/month",
  "Badge": "Badge",
  "rsvp_more_options": "More options",
  "Today Yesterday": "Today / Yesterday",
  "sso_connection_edit_title": "Edit SSO connection",
  "logs_todos_2_notify": "{{user_full_name}} updated {{entity_title}}",
  "Add Event": "Add Event",
  "help_groups_renaming": "[Your name's] projects - how to rename default project group",
  "cft_field_type": "Type",
  "New Project Group": "New Project Group",
  "You are already editing a comment.": "You are already editing a comment.",
  "daily_recap_due_to_complete": "Due to complete",
  "global_remove_projects": "List of projects user will be removed from",
  "by": "by",
  "files_filter_mime_title": "File MIME type",
  "Follow us": "Follow us",
  "crm_calls_direction_inbound": "Inbound",
  "manage_group_admins_label": "Group Admins",
  "Custom Fields main page ": "Custom Fields main page",
  "Events to show": "Events to show",
  "monthlyWeekdayOfMonth1Human": "on the",
  "Works with Google Drive": "Works with Google Drive",
  "change": "change",
  "help_requests_descr": "Is there a feature you think we ought to consider adding?",
  "Action": "Action",
  "my_bio": "BIO",
  "Projects You Administer": "Projects You Administer",
  "remove_globally": "Remove From All Projects",
  "mkplc_subscr_not_created": "Subsription has not been created. Please contact support.",
  "Add group member": "Add group member",
  "invoices_back_estimates": "Back To Estimates",
  "notif_level_none": "None",
  "logs_files_9": "{{user_full_name}} commented on file {{name}}.",
  "try_business_14_days_trial": "Try <b>Business Plan</b> with 14 days free trial and %s per user per month.",
  "Document Comparison": "Document Comparison",
  "c_private": "Private",
  "logs_todos_0": "action has been performed in todos.",
  "mkplc_app_screeshots": "Screenshots",
  "How Free is Freedcamp?": "How Free is Freedcamp?",
  "leave_why_question": "Why did you leave?",
  "it_type_bug": "Bug",
  "it_internally": "Internally",
  "Project Group Users": "Project Group Users",
  "wiki_default_group_name": "Wiki List",
  "Unarchive Project": "Unarchive Project",
  "crm_new_task_btn": "Task",
  "cancel sort": "cancel sort",
  "crm_contacts_im_aim": "AIM",
  "How people see a public project": "How people see a public project",
  "you_can_request_to_reduce_dual": "You can request to reduce billing to %d - %d users below.",
  "manage_drag_to_invite_2": "click here",
  "auth_new_password_title": "New Password",
  "upload_sign_out_google_link_title": "Sign out and use a different Google account",
  "mile_no_milestones": "No Milestones have been set, click below to add some!",
  "Error deleting calendar link.": "Error deleting calendar link.",
  "cal_january": "January",
  "Enter the name of your Position": "Enter the name of your Position",
  "logout_all_devices": "Log out from all devices where you are signed in",
  "What are you working on?": "What are you working on?",
  "Team Wikis": "Team Wikis",
  "My reports": "My reports",
  "manage_account_gravatar_link": "Change Gravatar",
  "tasks_tag_due_word": "Due",
  "manage_invite_more_users_link_title": "Invite More Users",
  "c_item_wiki_title": "Wiki",
  "Add Contact": "Add Contact",
  "c_custom_order": "Custom Order",
  "Reorder": "Reorder",
  "sup_resp_2_days": "Support response within 2 business days",
  "Project Applications": "Project Applications",
  "files_on_date": "on",
  "Move file to other folder": "Move file to other folder",
  "help_restore_hints_link_title": "Restore All Hints",
  "you_already_purchased_plan": "You've already purchased this plan.",
  "h_Widgets": "Widgets",
  "List view": "List view",
  "passman_use_master_pass": "Use Master Password",
  "Manage projects": "Manage projects",
  "Once the new project is ready we will send you an email.": "Once the new project is ready we will send you an email.",
  "Previews for images": "Previews for images",
  "backup_plan_descr_3": "Get your data emailed to you monthly with all the data in your projects",
  "we_dare_you": "See for yourself %s we dare you.",
  "Completed on %s": "Completed on %s",
  "Cancel Google Calendar Sync": "Cancel Sync to Google Calendar",
  "email_for_me": "Send notification email to me",
  "Add milestone": "Add milestone",
  "You Will Be $%s Billed On %s": "You Will Be $%s Billed On %s",
  "it_added": "Added",
  "dash_proj_card_advanced_text": "Ready to add more apps, group users in teams, and customize permissions?",
  "Line %d, cloumn %s (%s): %scheck format of a date": "Line %d, column %s (%s): '%s' - check format of a date",
  "Used by hundreds of thousands!": "Used by hundreds of thousands!",
  "logs_time_6_notify": "{{user_full_name}} started working on time entry.",
  "Assigned to %s": "Assigned to %s",
  "Subdomain": "Subdomain",
  "tasks_user_on_date": "%s on %s",
  "Archive group": "Archive group",
  "auth_register_btn_title": "Sign Up",
  "export_all_projects_no_projects": "No projects to export.",
  "allison_expl": "“LITERALLY has never had a piece of software work so flawlessly”",
  "c_export_time_for": "For Last",
  "Edit own issue": "Edit own issue",
  "Module enabled": "Module enabled",
  "Revert to prev version for other user wiki": "Revert to prev version for other user wiki",
  "mile_switch_to_new": "Switch to new Milestones",
  "Delete other user file or its version": "Delete other user file or its version",
  "Count": "Count",
  "manage_clone_project_people_keep_but_opt": "Keep all people but remove assignments and subscriptions",
  "My Trip to Rome": "My Trip to Rome",
  "crm_calls_call_time_title": "Call Time",
  "logs_discussions_5_notify": "{{user_full_name}} has uploaded a new file in discussion.",
  "This application does not support saved searches": "This application does not support saved searches.",
  "help_freedcamp_apps_title": "Freedcamp Applications",
  "logs_wiki_3_notify": "{{user_full_name}} deleted wiki.",
  "c_choose_low": "choose",
  "msg_data_loading": "Loading Data, Please Wait...",
  "it_no_perm_to_change_order_msg": "You have no permissions to change issues order.",
  "Go to Manage Projects to access it": "Go to Manage Projects to access it",
  "(no webcam or permissions denied)": "(no webcam or permissions denied)",
  "Files linked from OneDrive": "Files linked from OneDrive",
  "c_item_file_title": "File",
  "Start Freedcamp Lite trial": "Start Freedcamp Lite trial",
  "wall_remaining_chars": "remaining chars",
  "cft_add_dd_option": "Add an option",
  "it_is_public": "Is public",
  "auth_new_passw_input_placeholder": "Enter new password",
  "time_mark_completed_time_task": "Are you sure you want to mark as completed %d Time Record?",
  "invoices_edit_client_title": "Edit Client",
  "manage_clone_project_make_active_lbl": "After new project will be created",
  "You can not delete team with users. Please remove users first.": "You can not delete team with users. Please remove users first.",
  "user_in_public_project": "You are in a public project - please make sure you do not disclose any sensitive information.",
  "Error accepting invitation.": "Error accepting invitation.",
  "files_filter_most_recent": "most recent",
  "daily_recap_upcoming": "Upcoming Things",
  "You can easily switch between them once you are in.": "You can easily switch between them once you are in.",
  "manage_marketplace_reminder_1": "You can always discover more apps",
  "mkplc_trial_exp_in_few_days": "Trial expires in %d days.",
  "mile_no_perm_progress": "You have no permissions to change progress for this milestone.",
  "Step 3": "Step 3",
  "cal_september": "September",
  "remove_from_mile_are_you_sure": "Are you sure you whant to remove task from milestone?",
  "mkplc_bkp_subsr_added_but_dont_scheduled": "Backup subscription has been created, but some technical issues occurred.",
  "crm_contacts_phone_cell": "Cell",
  "revert to this version": "revert to this version",
  "You have no permissions to delete this search": "You have no permissions to delete this search.",
  "cal_april": "April",
  "invoices_enable_paypal_title": "Enable PayPal Payment",
  "General Actions": "General Actions",
  "Premium": "Premium",
  "Invite New User": "Invite New User",
  "orderIndexes_1": "first",
  "c_filter_no_results": "No results found. Please update your search and try again.",
  "Manage project apps": "Manage project apps",
  "logs_time_0": "action has been performed in time.",
  "passman_want_to_remove_security_plural": "Do you really want to remove the Master Password security from %d passwords?",
  "Drag the groups and projects into the order you want. The order is only for your own account.": "Drag the groups and projects into the order you want. The order is only for your own account.",
  "Request can not be processed": "Request can not be processed",
  "Main View": "Main View",
  "delet_mile_with_todos_expl_plur": "You are able to delete milestone with %d tasks linked to it!",
  "files_root_folder_descr": "Files in the root folder",
  "auth_invalid_reset_key": "Invalid Reset Key",
  "Upgrade own account": "Upgrade own account",
  "it_issue_closer": "Issue Closer",
  "numeric": "The %s field must contain only numbers.",
  "request_access_pending": "There are no pending public project requests.",
  "mile_seems_mile_deleted_msg": "This milestone was probably deleted by another user.",
  "wiki_invalid_group": "Invalid wiki list!",
  "crm_make_contact_lnk": "Make contact",
  "access_here": "here",
  "remove_user_from_projects_no_permission": "You don't have the permission to remove user from specified projects.",
  "crm_campaign_result_earn_title": "Result Earnings",
  "Enable White Label": "Enable White Label for all your project groups",
  "time_delete_completed_time_task_plural": "Are you sure you want to delete %d completed Time Records?",
  "files_popup_upload_title": "Upload",
  "Connect to Google Contacts": "Connect to Google Contacts",
  "Seems this comment was deleted by other user.": "Seems this comment was deleted by other user.",
  "tasks_import_can_submit_file": "You can submit new xls file here",
  "deactivate_unsuccessful": "Unable to De-Activate Account",
  "mile_mile_del_success_msg": "Milestone has been successfully deleted.",
  "It seems that project you was invited to has been deleted!": "It seems that project you were invited to has been deleted!",
  "notif_created_group_title": "Created",
  "Last activity": "Last activity",
  "no_groups_projects_for_storage": "There are no groups and projects to apply %s storage plan to. You can purchase now and use it later",
  "You have no access to application with which you want to integrate!": "You have no access to application with which you want to integrate!",
  "manage_edit_project_title": "Edit Project",
  "public_projects_short_descr": "Spread awareness about your work and make a project Public!",
  "tasks_drag_tag_advice": "drag tag",
  "%s application": "%s application",
  "crm_tasks_type_lunch": "Lunch",
  "Kanban board": "Kanban board",
  "time_no_entries_add": "Start your first Timer",
  "crm_add_lead": "Add Lead",
  "You have no permissions to add Task": "You have no permissions to add a Task.",
  "logs_files_13": "{{user_full_name}} updated comment in file {{name}}.",
  "feature_task_list_desc": "Stay on top of your task lists and stay in touch with what's happening",
  "c_no": "No",
  "Thanks for your message!": "Thanks for your message!",
  "logs_time_11": "time task {{description}} has been billed.",
  "auth_request_key_1": "Request",
  "manage_subscription_inactive": "Subscription to this application is inactive,\nyou can renew it on the Marketplace.",
  "c_save_link_with_filters": "Copy Link",
  "There are no data for specified item!": "There are no data for specified item!",
  "logs_discussions_10_notify": "{{user_full_name}} deleted comment in discussion.",
  "Leave Project Group": "Leave Project Group",
  "Admin": "Admin",
  "logs_time_1_notify": "{{user_full_name}} added new time entry.",
  "invoices_vat_title": "VAT ID",
  "Create link": "Create link",
  "Premium Support": "Premium Support",
  "Everything": "Everything",
  "Select a user": "Select a user",
  "send_to_me": "Email Me Invite",
  "enterprise_customers_protection": "Intrusion detection and SELinux on all servers",
  "mkplc_storage_canceled": "You've successfully cancelled storage subscription.",
  "Are you sure you want to delete this file version?": "Are you sure you want to delete this file version?",
  "more 2 months ago": "more 2 months ago",
  "rtpl_monthly": "Monthly",
  "help_crm_app_title": "CRM",
  "logs_discussions_0": "action has been performed in discussions.",
  "Link Task and Milestone": "Link Task and Milestone",
  "mkplc_module_subscr_removed": "You've successfully cancelled subscription for the module.",
  "wiki_update_success_msg": "You have successfully updated the wiki!",
  "Manage group apps": "Manage group apps",
  "You have successfully saved project order!": "You have successfully saved project order!",
  "Collaborate on the go!": "Collaborate on the go!",
  "sign_up_free": "Sign up. It's Free",
  "it_not_set": "Not set",
  "c_move": "Move",
  "crm_campaign_status_completed": "Completed",
  "You have no permissions to revert this wiki to previous version": "You have no permissions to revert this wiki to previous version.",
  "logs_bugtracker_13": "{{user_full_name}} updated comment in issue {{title}}",
  "cf_confirm_msg_cft": "Are you sure you want to delete Custom Field Template?",
  "all Milestones": "all Milestones",
  "Add Members": "Add Members",
  "Try Module": "Try Module",
  "Hours": "Hours",
  "Delete calendar": "Delete calendar",
  "crm_import_success_number": "Successfully imported contacts: %d.",
  "no_reports_yet": "You don't have any reports yet.",
  "c_reset": "Reset",
  "Unnamed Widget": "Unnamed Widget",
  "Select": "Select",
  "group_admins_description": "Give users the ultimate permission, allowing them to create projects!",
  "Click to create Gsync for this calendar": "Click to create GSync for this calendar",
  "passman_no_users_to_share": "No users to share with",
  "h_Projects": "Projects",
  "files_no_files_try_sub_part5_root_word": "all project files",
  "Stuff to do before I go": "Stuff to do before I go",
  "passman_password": "Password",
  "Active": "Active",
  "mkplc_app_suggest_feature": "Suggest a Feature",
  "no_events": "No upcoming Events",
  "mkplc_cancel_trial": "Cancel trial",
  "Issue Tracker Projects": "Issue Tracker Projects",
  "Sync with Google Contacts removed.": "Sync with Google Contacts removed.",
  "Update Account": "Update Account",
  "leave_reason_project_completed": "Project completed or I am no longer part of it",
  "karlo_place": "Karlo, New South Wales, Australia",
  "Multi Invite": "Multi Invite",
  "tasks_restart_btn_title": "Restart Progress",
  "This user is already in the project": "This user is already in the project",
  "Not Completed": "Not Completed",
  "files_no_app_access_msg": "You don't have access to application!",
  "auth_verify_code_incorrect_placeholder": "Verification code incorrect",
  "help_how_invite": "How to invite users and manage your team",
  "How big is your team": "How big is your team",
  "no_syncs": "You haven't created any calendar links yet.",
  "Add discussion": "Add discussion",
  "view pricing plans": "view pricing plans",
  "From template": "From template",
  "wall_more": "more...",
  "joined_last_active": "joined %s, last active %s",
  "Accept our Congratulations!": "Accept our Congratulations!",
  "cal_fri": "Fri",
  "invoices_total_due": "Total Due",
  "Deadline": "Deadline",
  "logs_discussions_2_notify": "{{user_full_name}} updated.",
  "c_edit_low": "edit",
  "auth_back_login_link_title": "back to Login page",
  "logs_todos_8": "Task {{entity_title}} is now complete.",
  "step_num": "Step %s",
  "logs_files_1": "new file {{name}} has been uploaded.",
  "rsvp_required": "RSVP Required",
  "Wait a bit please...": "Wait a bit please...",
  "auth_email_change_success": "Email successfuly changed to %s",
  "disc_group_title": "Discussion List",
  "tasks_no_perm_archive_group": "You have no permissions to archive this list.",
  "no_tags_msg": "You do not have any tags.",
  "Profile": "Profile",
  "c_smth_wrong_sorry_msg": "We have been notified and will look into the problem. We apologize for any inconvenience.",
  "Move": "Move",
  "Re-send with custom message above if entered": "Re-send with custom message above if entered",
  "Send Request": "Send Request",
  "crm_contacts_export_excel": "Export all contacts as excel",
  "Change issues order": "Change issues order",
  "free_collaborate_people": "The entirely free way to collaborate more efficiently with groups of people.",
  "Daily": "Daily",
  "Month": "Month",
  "c_some_error_occured": "Sorry, some error occured.",
  "Support": "Support",
  "Invitation Hash": "Invitation Hash",
  "manage_enter_msg_label": "Enter invitation message",
  "files_the_last_version_title": "the last version",
  "crm_calls_subject_title": "Subject",
  "Your Backup periodicity": "Your Backup periodicity",
  "recurr_msg_not_allowed_child_is_recurr": "Can't be recurrent because of recurrent subtask(s).",
  "tasks_no_perm_edit_group": "You have no permissions to edit this list.",
  "c_dashboard": "Dashboard",
  "help_applications": "Applications",
  "contact_us_change_plan": "Please %scontact us%s to change your plan",
  "no_completed_time_to_delete": "You don't have completed Time Records to delete",
  "back_to_active_milestones": "Back To Active Milestones",
  "crm_campaign_leads_gained_title": "Leads Gained",
  "reset": "reset",
  "tasks_invalid_completed_date": "Future dates are not allowed. Please enter a valid date.",
  "c_highest": "highest",
  "update_unsuccessful": "Unable to Update Account Information",
  "service_governed_by": "Service is governed by Freedcamp %sTerms of Services%s.",
  "crm_campaign_res_del_success_msg": "Campaign result deleted successfully!",
  "upsell_try_minimalist": "Try the %sMinimalist plan%s and be able to",
  "kanban board": "kanban board",
  "Recurrence": "Recurrence",
  "sso_mobile_login_ok": "You were successfully signed in as %s.",
  "rsvp_notify_about_response": "RSVP Updates",
  "crm_complete_task": "Complete Task",
  "High": "High",
  "tasks_in_project_note": "in project %s",
  "c_incomplete": "Incomplete",
  "dash_proj_card_link_resume": "Unarchive & resume",
  "auth_type_password_to_delete": "Please type your password to delete your account.\nThis action is final with no undo.",
  "files_move_select_folder": "select a folder above",
  "passman_ecrypt_all_password": "Encrypt all passwords with the Master Password",
  "File Edit": "File Edit",
  "c_save_wiki": "Save Wiki",
  "Keep me logged in for 2 weeks": "Keep me logged in for 2 weeks",
  "export_all_projects_warn_msg": "This file contains list of all active projects you own or are part of. Your account is - %s",
  "rsvp_event_creator": "event creator",
  "files_filter_onedrive": "OneDrive",
  "is_numeric": "The %s field must contain only numeric characters.",
  "Backup Subscriptions": "Backup Subscriptions",
  "-- choose a timezone --": "-- choose a timezone --",
  "invoices_paypal_email": "PayPal Email",
  "dash_greetings_off_msg": "Greetings are disabled now.",
  "Add group user": "Add group user",
  "greeting and quotes": "greeting &amp; quotes",
  "mkplc_suggest_btn_lbl": "Suggest Application",
  "it_no_issues_criteria": "There are no issues matching your criteria.",
  "Personalized Onboarding": "Personalized Onboarding",
  "help_introduction": "Introduction %s(3min)%s",
  "tasks_no_perm_to_add_subtask": "You have no permissions to add subtasks to this task.",
  "c_have_no_permissions_msg": "You don't have permissions for that!",
  "daily_recap_start_due": "past start date",
  "Back to Manage System": "Back to Manage System",
  "email_subject_calendar_out_of_sync": "Google calendar \"%s\" is out of sync and is marked as inactive in Freedcamp",
  "Invited by": "Invited by",
  "these applications": "these applications",
  "logs_wiki_13": "{{user_full_name}} updated comment in wiki {{title}}",
  "invoices_total_qty_time": "Total Quantity/Time",
  "Read-only Guest Access": "Guest/Read-Only access free",
  "sso_mobile_register_ok": "You were successfully authorized as %s.",
  "c_created_today": "created today",
  "storage_plan_basic": "Basic",
  "it_issue_add_success_msg": "Issue has been successfully added.",
  "c_item_issue_title": "Issue",
  "with 1 file": "with 1 file",
  "No project roles to share with": "No project roles to share with",
  "password_change_successful": "Password Successfully Changed",
  "Project Description": "Project Description",
  "Please specify application ID to check state!": "Please specify application ID to check state!",
  "c_complete": "Complete",
  "Widget Title": "Widget Title",
  "num_this_billing_period": "%s this billing period",
  "cft_f_type_text_field": "Text",
  "first_free_plan_unlimited_storage": "%s plan includes unlimited file storage with %s file size limit",
  "Forgot password? Click %s here %s": "Forgot password? Click %s here %s",
  "sso_or_login_with_email": "or Sign In with email",
  "leave_thanks_msg": "Thanks again for trying Freedcamp and we will be here if you ever want to give us another shot.",
  "Events": "Events",
  "Add or Invite Users": "Add or Invite Users",
  "mile_progress_not_completed": "No Progress",
  "invoices_currency_title": "Invoices Currency",
  "tasks_time_worked_hours": "Worked hours",
  "Billing Address": "Billing Address",
  "Detail View": "Detail View",
  "Add user to all apps": "Add user to all apps",
  "mkplc_price_per_year_full": "/year (5% discount)",
  "upload_browse_files": "Browse Files",
  "Manage groups": "Manage groups",
  "Lifestyle": "Lifestyle",
  "mkplc_app_rating": "Rating",
  "Activity": "Activity",
  "Sorry, you have no permission to manage group applications.": "Sorry, you have no permission to manage group applications.",
  "Date, desc": "Date, desc",
  "files_no_files_try_sub_part2_search_word": "Search",
  "no_projects_click_create_one": "You don't have any projects, click Create Project to create one and get started!",
  "delete_project_question": "Are you sure you want to delete this project, all items inside will be lost?",
  "this_file_can_be_imported_to_email_client": "This file can be imported to your email client. %s Check docs %s for more info.",
  "List of wikis": "List of wikis",
  "passman_we_notify_change_msg": "We notify users about a change only. Freedcamp never sends and does not store your Master Password.",
  "it_save_search": "Save Search",
  "c_sort_by": "Sort",
  "Error subscribing to Google Calendar": "Error subscribing to Google Calendar.",
  "c_high": "High",
  "Add comment": "Add comment",
  "no_permissions_or_projects_to_clone": "You don't have permissions or projects to clone.",
  "disc_sticky_title": "Sticky",
  "project_widget_no_projects": "No Projects in this filter. Please change from the dropdown on top right of this panel.",
  "cal_sat": "Sat",
  "time_mark_completed_time_task_plural": "Are you sure you want to mark as completed %d Time Records?",
  "to_navigate_between_projects": "to navigate between projects",
  "tasks_delete_completed": "Delete Completed Tasks",
  "Turn off instant emails": "Turn off instant email notifications in all projects",
  "Jump to Files from anywhere": "Jump to Files from anywhere",
  "c_app_subtasks": "Subtasks",
  "files_resizing_error_msg": "Image resizing error",
  "logs_bugtracker_3": "{{user_full_name}} delete issue {{title}}",
  "rsvp_msg_submit": "Submit Response",
  "help_google_drive": "Google Drive",
  "help_intro_webinar": "Freedcamp intro webinar by CEO - Angel Grablev",
  "help_wall": "Group Wall",
  "Remove invite message": "Remove invite message",
  "mobile_android_desc": "Our Android application is almost ready to be released! Stay tuned.",
  "Try App": "Try App",
  "tasks_completed_tasks_deleted_msg": "All completed tasks were deleted successfully!",
  "two_factor_auth_short": "2-Factor Authentication",
  "You have successfully unsubscribed from this item.": "You have successfully unsubscribed from this item.",
  "Already Invited": "Already Invited",
  "auth_terms_link_agree_2": "terms and conditions & privacy policy",
  "Inverse selection": "Inverse selection",
  "it_no_perm_to_edit_issue_list_plural": "You have no permissions to edit issues %s.",
  "auth_reset_explanation_1": "If you don't get an email from us please check your spam folder. If you requested",
  "all_data_intact": "All the data are intact and will be immediately available after subscription renewal.",
  "it_type_auto_reported": "Auto-Reported",
  "c_close_low": "close",
  "help_gantt": "Gantt",
  "Phone Number %s 10 digits no spaces %s": "Phone Number %s 11 digits no spaces %s",
  "manage_clone_project_make_active_yes_opt": "Make it active",
  "disc_posted_by": "Posted By",
  "Edit Wiki Version": "Edit Wiki Version",
  "Choose from Google Contacts": "Choose from Google Contacts",
  "Seems this Data Feed Link has been deleted. Please refresh page.": "Seems this Data Feed Link has been deleted. Please refresh page.",
  "disc_unarchive_group_lnk_hint": "Unarchive List",
  "Trial ends": "Trial ends",
  "Last Updated, asc": "Last Updated, asc",
  "Milestones": "Milestones",
  "c_app_dropbox": "Dropbox",
  "c_session_restore_success_msg": "Logged In Successfully. You can save your data now.",
  "manage_add_group_title": "Add Group",
  "files_filter_freedcamp": "Freedcamp",
  "aka Kanban": "aka Kanban",
  "manage_clone_project_new_name": "Type new project name",
  "manage_clone_project_click_apps": "Click apps to exclude from a new project",
  "tasks_add_task": "Add Task",
  "Invites Accepted": "Invites Accepted",
  "manage_edit_title": "Edit Group",
  "invoice_update_estimate_success_msg": "Estimate updated successfully!",
  "help_invoices_app_title": "Invoices",
  "mkplc_unsubscribe": "Unsubscribe",
  "Calendar link deleted.": "Calendar link deleted.",
  "c_phone": "Phone",
  "reduce_users": "Reduce users",
  "help_subscription_and_billing_link_title": "Subscription and Billing",
  "tasks_export_csv": "Export CSV",
  "manage_clone_project_switch_to_backward": "%sSwitch %s to plan new project backward",
  "it_contains_1_project": "It contains 1 project inside which will also be deleted.",
  "Projects %s where you are a user %s": "Projects %s where you are a user %s",
  "My History": "My History",
  "You have successfully joined the project.": "You have successfully joined the project.",
  "dash_proj_card_link_leave_cancel": "No, Let's Wait",
  "crm_sidebar_leads_btn": "Leads",
  "Compare Versions": "Compare Versions",
  "logs_milestones_3_notify": "{{user_full_name}} deleted milestone.",
  "rsvp_answer_yes": "Yes, I'm going",
  "Weekly": "Weekly",
  "Invites Sent": "Invites Sent",
  "c_due_by": "Due By",
  "Cancel my trial": "Cancel my trial",
  "cf_entered_value": "entered value",
  "invoices_total_qty": "Total Quantity",
  "Select Projects and Users": "Select Projects & Users",
  "recurr_msg_how_to_fix": "A recurrent subtask cannot be created if one of the parent (sub)tasks already has a recurrence set.",
  "manage_clone_project_move_monday_yes_opt": "Yes",
  "integer": "The %s field must contain an integer.",
  "Visit My Account page": "Visit My Account page",
  "delete_account_message": "Please remember this action is final and will cause loss of all data!",
  "Add invite message": "Add invite message",
  "help_bugs_descr": "Something has gone terribly wrong? Let us know so we can fix it.",
  "files_folder_name_title": "Name",
  "billing_emails_are_sent": "Billing emails are sent to your Freedcamp's email - ",
  "FileEdit - popup when file changed and closed": "FileEdit - popup when file changed and closed",
  "less_than": "The %s field must contain a number less than %s.",
  "Check customer feedback portal": "Check customer feedback portal",
  "feature_discussions_desc": "Tired of unreadable emails threads? Discuss ideas with your team from one centralized place",
  "help_managing_subscriptions_v2": "Managing Add-on Subscriptions",
  "forgot_password_successful": "Password Reset Email Sent",
  "crm_import_no_file": "You have to choose a file for import at first!",
  "help_faq_and_customer_support": "FAQ and Customer Support",
  "mkplc_app_add_comment": "Add Review",
  "less_then_days_ago": "%s less than %s days ago",
  "c_app_file_edit": "FileEdit",
  "See time across projects": "See time across projects",
  "crm_view_back_contacts_lnk": "Back To Contacts",
  "metadata_lnk_title": "Download Metadata",
  "decimal": "The %s field must contain a decimal number.",
  "Projects Group has been successfully updated": "Projects Group has been successfully updated",
  "reports_overdue_tasks": "open overdue tasks",
  "active_user_sing": "active user",
  "Regenerate link": "Regenerate link",
  "yes_i_am_ready": "Yes, I'm ready",
  "auth_confirm_email_title": "Confirm Email",
  "help_email_notifications": "Email Notifications",
  "c_group_name": "Group Name",
  "Order Now": "Order Now",
  "Comment": "Comment",
  "logs_todos_15": "{{user_full_name}} link {{entity_title}} to a Milestone.",
  "instatry_no_cc": "No credit card required to try",
  "help_dashboard": "Dashboard",
  "TOUR": "TOUR",
  "Bulk actions": "Bulk actions",
  "Access to the webcam is denied.": "Access to the webcam is denied.",
  "Change assignment for own task": "Change assignment for own task",
  "c_summary": "Summary",
  "Account Settings": "Account Settings",
  "Tasks Board": "Tasks Board",
  "Contributor": "Contributor",
  "feature_kanban_board_desc": "The modern way to manage tasks by dragging into completion columns",
  "passman_edit_master_pass": "Edit the Master Password",
  "crm_calls_direction_title": "Call Direction",
  "upsell_subtasks_attributes": "Give subtasks all attributes that usual tasks have and unlimited nesting",
  "onboarding_business_trial": "Start Business plan trial (14 days and free) to experience Freedcamp's power now.",
  "Remove Google Contacts Sync": "Remove Google Contacts Sync",
  "time_billed_start_msg": "This time task is billed, please back it to progress first!",
  "files_files_not_found": "Files not found!",
  "LOGIN": "LOGIN",
  "Date Updated": "Date Updated",
  "View item in Freedcamp": "View item in Freedcamp",
  "tasks_no_perm_add_group": "You have no permissions to add a list.",
  "Paid": "Paid",
  "Due in %d days": "Due in %d days",
  "invoices_link_crm_title": "Link Crm with Clients",
  "Full edit/delete access without ability to invite people or install apps": "Full edit/delete access without ability to invite people or install apps",
  "Your Email": "Your Email",
  "Contributors Page": "Contributors Page",
  "passman_no_groups_msg": "There are currently no password lists here. Please create a password list before you continue.",
  "passman_enter_master_pass": "Please enter the Master Password below.\n\nDon't know it? Ask project administrators.",
  "free_plan_desc": "Perfect for those who want to keep track of basic collaborative projects.",
  "chock_full_features": "Our system is %schock–full %s of features!",
  "switch_new_plan_note": "Switching to new plans note",
  "You": "You",
  "time_short_descr": "Track time spent on different tasks, then bill those tasks with the Invoice application.",
  "Remove user from group": "Remove user from group",
  "feature_tasky_desc": "Not all tasks should be public knowledge, keep your personal tasks private",
  "Edit folder": "Edit folder",
  "dash_widgets_loading": "Widgets are loading...",
  "show_sso_details": "Show urls",
  "Start": "Start",
  "View": "View",
  "tasks_no_perm_group_order": "You have no permissions to change list order.",
  "c_app_invoicesplus": "Invoices+",
  "tasks_conf_del_completed_plural": "Are you sure you want to delete %d completed Tasks?",
  "disabled_for_new_proj": "<b>Disabled for new</b> projects",
  "c_more_options": "More options",
  "Issue view page": "Issue view page",
  "crm_contacts_import_xls_sample_lnk": "Download MS Excel template file",
  "tasks_no_adv_actions_for_checklist": "Only title and progress may be set for a subtask in a checklist.",
  "help_manage_user_and_apps": "Manage Users And Applications",
  "mkplc_module_renewed": "You've successfully renewed subscription for this module",
  "mile_with_%d_files": "with %d file",
  "comments": "comments",
  "mkplc_bkp_added": "Your backup plan has been created.",
  "c_filter_by": "Filter",
  "Copy link to clipboard": "Copy link to clipboard",
  "disc_no_perm_archive_group": "You have no permissions to archive this list.",
  "Join Project": "Join Project",
  "in": "in",
  "mkplc_pp_only": "In Public Projects Only",
  "noRule": "No RRULE in RRULE data",
  "Please select...": "Please select...",
  "invoices_forward_estimate": "Forward Estimate",
  "mkplc_install_now": "Install now",
  "Remove user from all group projects": "Remove user from all group projects",
  "Blog": "Blog",
  "c_submit": "Submit",
  "Save / update / delete searches created by other user": "Save / update / delete searches created by other user",
  "frontpage_freedcamp_free_q": "Oh wait, did we mention that Freedcamp is absolutely %sfree %s?",
  "c_save_search": "Save Search",
  "upload_you_are_signed_gdrive_as": "You're signed into Google as",
  "Notification Levels": "Notification Levels",
  "no_refunds_note": "Note - we do not provide refunds.",
  "no_lets_wait": "No, let's wait",
  "c_delete_low": "delete",
  "storage_plan_unlimited": "Unlimited",
  "You have no projects. Please, add some to use this widget.": "You have no projects. Please, add some to use this widget.",
  "User Settings": "User Settings",
  "Permission Level": "Permission Level",
  "remove_access_request_confirm": "This action will remove access request from this user! Are you sure?",
  "Add a Shortcut": "Add a Shortcut",
  "c_lowest": "lowest",
  "contact_support_for_own_domain": "Contact help@freedcamp.com if you want to run Freedcamp on own domain name.",
  "includes": "includes",
  "Starts": "Starts",
  "add_tags": "Add Tags",
  "c_from_%s_to_%s": "From %s to %s",
  "we_transfer_one_project": "We will transfer ownership of your project and delete your account after completion.",
  "mkplc_upgrade_plan": "Upgrade your plan",
  "c_export_filtered": "Filtered",
  "crm_tasks_type_follow_up": "Follow Up",
  "archived": "archived",
  "mkplc_free_app_lbl": "FREE",
  "files_filter_less_than_n_mb": "Less than %d MB",
  "invoices_deposit_of_amount": "Deposit of %s",
  "Selected": "Selected",
  "No thumbnail has been created": "No thumbnail has been created.",
  "esc": "Esc",
  "Ok, cool": "Ok, cool",
  "Observer": "Observer",
  "You are already unsubscribed": "You are already unsubscribed",
  "logs_todos_9_notify": "{{user_full_name}} said: {{comment_description}}",
  "invoices_client_title": "Client",
  "You have no permissions to edit event": "You have no permissions to edit this event.",
  "manage_app_id_title": "Application ID",
  "enter_password_to_confirm": "Enter your password to confirm action",
  "Unknown": "Unknown",
  "Download iOS App": "Download iOS App",
  "cal_date_from": "Date From",
  "help_notifications_page": "Notifications page",
  "dash_proj_card_link_leave": "Leave Project",
  "disc_sticky_hint": "Pin the Discussion to the top of the list so it's always visible to users.",
  "crm_leads_convert_success_msg": "Lead successfully converted to contact",
  "help_request_sent": "You have successfully contacted us.",
  "Remove user": "Remove user",
  "Click on group name to see users inside it": "Click on group name to see users inside it",
  "time_widget_no_tasks": "There are no records matching your criteria.",
  "c_try_refresh": "Please try to refresh the page.",
  "it_create_issue": "Create Issue",
  "auth_resend_confirmation": "Click here to resend verification email",
  "Balance": "Balance",
  "Delete all calendars": "Delete all calendars",
  "logs_bugtracker_3_notify": "{{user_full_name}} deleted issue.",
  "Coeff": "Coeff",
  "Projects participants always reminded that a project is public": "Projects participants always reminded that a project is public",
  "help_questions_descr": "Unsure about something that you don’t see in our knowledge articles on the left?",
  "Items response received or awaiting": "Items response received or awaiting",
  "time_back_in_progress": "Back in Progress",
  "tasks_conf_del_completed": "Are you sure you want to delete %d completed Task?",
  "Email In hash is copied to the clipboard!": "Email In hash is copied to the clipboard!",
  "Add Comment to the Selected Issue": "Add Comment to the Selected Issue",
  "files_filter_versions_title": "Versions",
  "Data Feed Link is copied to the clipboard!": "Data Feed Link is copied to the clipboard!",
  "disc_no_perm_edit_group": "You have no permissions to edit this list.",
  "Page URL": "Page URL",
  "manage_unlink_linkedin": "Your account has been successfully unlinked from LinkedIn",
  "Create New Project": "Create New Project",
  "tasks_user_word": "User",
  "freedcamp_tagline": "Free Effortless Collaboration for Teams",
  "c_public": "Public",
  "tasks_enter_title": "Enter task title",
  "coupon": "Coupon",
  "you_are_on_plan": "You are on the <b>%s plan</b>",
  "it_issue_numer": "Issue number",
  "Team": "Team",
  "Freedcamp is used in some of the largest companies all over the world": "Freedcamp is used in some of the largest companies all over the world",
  "Group Admin": "Group Admin",
  "c_delete": "Delete",
  "Mentions and Who is online": "Mentions & Who is online",
  "Application Name": "Application Name",
  "crm_other": "Other",
  "gt_no_changes_title": "There are no changes which affect projects. Safe to apply!",
  "emergency_codes": "Emergency codes",
  "help_export_data": "Export and Import your data",
  "wiki_changes_saved_msg": "Your changes were saved successfully!",
  "Edit Project Group": "Edit Project Group",
  "Search Results": "Search Results",
  "leave_reason_too_confusing": "I found it too confusing to use",
  "Update_plural": "Updates",
  "auth_reset_passw_page_title": "Reset password",
  "Agree to the terms": "Agree to the terms",
  "c_file_versions_link_title": "Versions & Comments",
  "Only file creator and project administrator can delete the file!": "Only file creator and project administrator can delete the file!",
  "files_popup_add_descr_lnk_title": "Add Description",
  "dash_no_projects_1": "You don't have any projects,",
  "Favorites": "Favorites",
  "you can export all available emails as CSV": "You can %s export all available in-emails %s as CSV",
  "valid_emails": "The %s field must contain all valid email addresses.",
  "mile_mile_del_success_msg_no_tasks": "No tasks were deleted. Milestone succesfully deleted.",
  "old_pricing_not_available_after_cancellation": "Old pricing will no longer be available as an option after cancellation.",
  "mkplc_price_per_month": "mo",
  "There are no unread logs for this item": "There are no unread logs for this item",
  "feature_project_templates_desc": "Quickly duplicate projects and save countless hours creating the same projects over and over",
  "Logs Count": "Logs Count",
  "cf_no_template_edit_access": "You do not have an access to Custom Fields edit as you are not a Project Group manager.",
  "Back To Wiki": "Back To Wiki",
  "manage_list_no_users": "No users to select",
  "All unread items": "All unread items",
  "this invoice generated by %s": "this invoice generated by %s",
  "3rd Party Integrations": "3rd Party Integrations",
  "dash_proj_card_link_leave_confirm": "Yes, I'm Ready",
  "Resume": "Resume",
  "tasks_view_list": "List",
  "cancel_trial_first_switch_to_your_trial": "Please cancel trial first, you can switch only to the plan you are now trialing.",
  "c_item_milestone_title_plural": "Milestones",
  "24 hrs format": "24 hours",
  "passman_only_can_man_msg": "Only project group owner and administrators can manage passwords lists!",
  "Yes, Unsubscribe": "Yes, Unsubscribe",
  "feature_backups_desc": "Get a piece of mind by having all your data offline",
  "cft_f_type_checkbox": "Checkbox",
  "viewing an invoice as a group manager": "viewing an invoice as a group manager",
  "leave_sinature": "Angel and the Freedcamp Team",
  "manage_read_more_link_title": "Read more",
  "MY DASHBOARD": "MY DASHBOARD",
  "copy_task_list_missing_todo_group": "Cannot find task list - most likely it was deleted.",
  "Field name is required": "Field name is required",
  "leave_check_reasons_title": "Check any that apply",
  "sign_in_before_contacting": "If you're already a Freedcamp user, please %ssign in%s before contacting us.",
  "Reorder Projects": "Reorder Projects",
  "Travel Projects": "Travel Projects",
  "Decline Access Request": "Decline Access Request",
  "tasks_import_template": "Type of a task in a following format:\r\n\r\nTask\r\n|-Subtask\r\n\r\nOnly Name (D) is required for subtasks",
  "Number of successfully imported tasks: %d, subtasks: %d": "Number of successfully imported tasks: %d, subtasks: %d",
  "leave_gr_better_found": "Found better alternative",
  "Change assignment for other user task": "Change assignment for other user task",
  "tasks_priority_medium": "Medium",
  "remove": "remove",
  "I would like to ask you about adding ... language": "I would like to ask you about adding ... language",
  "invoices_collected_title": "Collected",
  "help_freedcamp_best_way_to_start": "Freedcamp at work – the best way to start",
  "tasks_import_tpl_ms_title": "Milestone",
  "crm_item_type_task": "task",
  "new_user_has_not_joined_yet_plur": "<b>%d</b> new users haven't joined yet",
  "onedrive_short_descr": "Attach your OneDrive files inside of Freedcamp seamlessly.",
  "New project Name": "New project Name",
  "files_move": "Move",
  "all Groups": "all Groups",
  "are_you_want_to_archive_group": "Are you sure you want to archive this list (the items inside will no longer be visible)?",
  "Click to enable": "Click to enable",
  "auth_user_already_exists": "User %s is already registered. Please enter another email or just log in.",
  "global_action_cannot_be_undone": "This is a global action. It cannot be undone!",
  "Participants": "Participants",
  "c_app_custom_fields": "Custom Fields",
  "This page is SSL encrypted with 256-bit security.": "This page is SSL encrypted with 256-bit security.",
  "feature_widget_board_desc": "Create custom widgets for any type of information you need in one easy location",
  "crm_campaign_no_results_msg": "There are no results to display",
  "Show incomplete translations": "Show incomplete translations",
  "crm_contacts_email_title": "Email",
  "crm_view_back_campaigns_lnk": "Back To Campaigns",
  "Change progress status for own task": "Change progress status for own task",
  "Public - Link Available to Anyone": "Public - Link Available to Anyone",
  "Google Contacts": "Google Contacts",
  "invoices_client_plural_title": "Clients",
  "rtpl_weekdays": "Weekday",
  "Time Tracking": "Time Tracking",
  "delet_mile_with_todos_expl": "You are able to delete milestone with %d task linked to it!",
  "Coupon Code": "Coupon Code",
  "tap_plus_in_app": "Tap the \"+\" icon in the top-right of the app",
  "manage_price_monthly": "%s/mo",
  "updated today": "updated today",
  "Manage System": "Manage System",
  "c_top": "Top",
  "Edit own event": "Edit own event",
  "mkplc_manage_storage": "Manage Storage",
  "added_extra_storage_monthly": "Added <b>%s</b> extra storage, paying <b>monthly</b>",
  "resync_summary": "Resync calendars summary",
  "help_overview_app_title": "Overview",
  "mkplc_bkp_renew_failed": "Renewal for backups has failed.",
  "rsvp_time": "time",
  "passman_login_link": "Login link",
  "help_wrong_tips_type": "Wrong tips type",
  "manage_clone_project_make_active_no_opt": "Keep it inactive",
  "logs_milestones_1": "{{user_full_name}} added a new milestone.",
  "Deleting last project": "Deleting last project",
  "invoices_add_invoice": "Add Invoice",
  "mkplc_subsc_module_success": "You've successfully subscribed to this module.",
  "c_app_tasky": "Tasky",
  "tasks_view_gantt": "Gantt",
  "c_me_filter_type_exact_user": "Use as is - will always show everyone same results as it shows them for you",
  "tasks_import_messages_title": "Following errors occurred during import:",
  "decided_to_unsubscribe": "You've decided to unsubscribe from updates for %s",
  "added_extra_storage_yearly": "Added <b>%s</b> extra storage, paying <b>yearly</b>",
  "You will lose access to all projects in this project group.": "You will lose access to all projects in this project group.",
  "View Unread Notifications": "Switch to unread updates",
  "c_app_white_label": "White Label",
  "Invite your contacts from Gmail": "Invite your contacts from Gmail",
  "rsvp_yes": "Yes",
  "Manage notification subscriptions for own task": "Manage notification subscriptions for own task",
  "All Read": "Read Updates",
  "Owner email": "Owner email",
  "Remove user from project": "Remove user from project",
  "upgrade_lite_summary": "Your Freedcamp data in Google Calendar updated instantly with Freedcamp Lite",
  "upload_failed_msg": "Upload failed. File name contains tags or file is too big.",
  "Data Feed Link is generated now!": "Data Feed Link is generated now!",
  "you_part_prem_acc": "You are a part of a Premium Freedcamp Account",
  "crm_contacts_is_lead_title": "Is Lead",
  "No description": "No description",
  "All (syncs and links)": "All (GSyncs and links)",
  "Home Page": "Home Page",
  "delete_unsuccessful": "Unable to Delete User",
  "Tour Page": "Tour Page",
  "no_projects_note": "Note: you currently do not have any projects of your own",
  "Global Settings": "Global Settings",
  "Please specify item ID to check state!": "Please specify item ID to check state!",
  "disc_last_activity_title": "Last Activity",
  "it_report_bug": "Report Bug",
  "dash_new_project_btn_title": "New Project!",
  "files_file_version_subheader": "Older Versions",
  "Created On": "Created On",
  "invoices_person_title": "Person",
  "group_deleted": "Group not found. Most likely it was deleted.",
  "storage_plan_plus": "Plus",
  "Guest": "Guest",
  "all Subtasks": "all Subtasks",
  "daily_recap_act_2": "Record your progress, note ideas or ask for help - write a comment",
  "Developres API": "Developers API",
  "monthly_proration_invoice_for_plan": "Monthly proration invoice for the <b>%s Plan</b>",
  "reports_charts_data_points": "chart data points",
  "cal_wednesday": "Wednesday",
  "notif_level_full_explanation": "If it happens you'll hear about it.",
  "Task List": "Task List",
  "daily_recap_tasks_no_dates": "You have %s in progress with no deadlines set",
  "account_creation_successful": "Account Successfully Created",
  "time_time_worked_label": "Time Worked",
  "tasks_create_new_task": "Create new Task",
  "it_issue_priority": "Issue Priority",
  "Personalized migration assistance": "Personalized migration assistance",
  "New Report": "New Report",
  "Plan Details": "Plan Details",
  "add_template_fieldset": "New Template",
  "Subtask of": "Subtask of",
  "Go to Home page": "Go to Home page",
  "Project Group Administrators": "Project Group Administrators",
  "files_filter_dropbox_title": "Dropbox",
  "disc_group_updated_msg": "Discussion list has been successfully updated!",
  "cft_select_field_one_option": "You must add at least 1 option to Dropdown!",
  "Pricing Guide": "Simple &amp; Honest Pricing",
  "Phone Number": "Phone Number",
  "copy_hint_invite_plural": "%s HINT%s: You can invite these users to the destination project and retry after.",
  "help_single_signin": "Single sign on with Facebook, Twitter, LinkedIn &amp; Google+",
  "Timezone is incorrect": "Timezone is incorrect",
  "See Full Calendar": "See Full Calendar",
  "Delete My Completed Time Records": "Delete My Completed Time Records",
  "auth_please_sign_in": "Please sign in to continue.",
  "c_search_replace_permission_error": "Public search can be edited by its creator only.",
  "crm_contacts_lead_cat_demoed": "Demoed",
  "no_crm": "There are no CRM Items assigned to you with a due date",
  "c_login_btn_title": "Login",
  "dash_proj_card_link_teams": "Manage Teams",
  "storage_plan_12": "Unlimited - Yearly",
  "tasks_assigned_all_avatar_word": "All",
  "Use new credit card": "Use new credit card",
  "In Emails were created": "In Emails were created!",
  "storage_plan_1": "Free",
  "c_something_wrong": "Something has gone wrong.",
  "disc_view_active_link_title": "View Active Discussion Lists",
  "c_this_month": "This Month",
  "passman_no_share_with": "No users to share with",
  "c_assign_to": "Assign to",
  "front_price_for_1Gb": "For only %s per month you get 1GB of storage. That's less than a cup of coffee.",
  "manage_add_project_group_name": "Project Group Name",
  "it_edit_issues_prefix": "Edit Issues Prefix",
  "mkplc_update_storage": "Update Storage",
  "Archive Project": "Archive Project",
  "rsvp_maybe": "Maybe",
  "mkplc_modules": "Modules",
  "Version": "Version",
  "default_application": "Default",
  "fc_ceo_for_quora": "Freedcamp's CEO talks about it on Quora",
  "crm_contacts_lead_cat_contacted": "Contacted",
  "Tip": "Tip",
  "auth_request_key_on_account_1": "Request another key on the",
  "files_filter_size_title": "Size",
  "cal_oct": "Oct",
  "c_group": "Group",
  "tasks_no_perm_change_parent": "You have no permissions to change parent task for this task.",
  "Tasky": "Tasky",
  "manage_group_apps_hint": "Manage project group applications",
  "mkplc_uninstall": "Uninstall",
  "crm_contacts_tasks_to_contact": "Related Tasks",
  "Enable Chrome Notifications": "Enable Chrome Notifications",
  "files_edit_online_title": "Edit online",
  "c_terms_conditions": "Terms & Conditions",
  "invoices_client_invalid_email": "Client's email is invalid. Please correct it to enable this action.",
  "Edit Report": "Edit Report",
  "file_edit_short_descr": "FileEdit.",
  "tasks_view_task": "View Task",
  "rsvp_response_notif_descr": "You will get an email for each RSVP response",
  "disc_invalid_group": "Invalid discussion list!",
  "manage_chose_group_admins": "Administrators",
  "import_fix_assignee_label": "Set to \"Unassigned\" if the assignee isn't a member of the project",
  "Save / update / delete own searches": "Save / update / delete own searches",
  "Close / reopen issue": "Close / reopen issue",
  "Today": "Today",
  "Create new team": "Create new team",
  "help_renaming_files": "Renaming Existing Files",
  "it_not_all_actions_applied": "Not all actions were applied.",
  "logs_files_1_notify": "{{user_full_name}} uploaded a new file.",
  "invoices_amount_filed_err": "The Amount field must contain only numbers",
  "Edit own task": "Edit own task",
  "shift_dates_skip_weekends_hint": "If a task has Start / Due date on Friday, adding one day to it will shift the dates to Monday",
  "rsvp_add_user_to_project": "User is registered on Freedcamp already, visit Manage Teams page to add him to the project",
  "crm_sidebar_campaigns_btn": "Campaigns",
  "manage_unlink_facebook": "Your account has been successfully unlinked from Facebook",
  "What are you looking for in": "What are you looking for in a collaboration tool?",
  "it_type_feature": "Feature",
  "Manage notification subscriptions for other user wiki for other users": "Manage notification subscriptions for other user wiki for other users",
  "Unread": "Unread",
  "feature_invoices_desc": "Bill your clients easily from your Time tracking entries or create new list items",
  "Collapse": "Collapse",
  "crm_search_placeholder": "search...",
  "you_can_request_to_reduce": "You can request to reduce billing to %d user below.",
  "mkplc_fc_addons": "Freedcamp Add-ons",
  "mkplc_trial_period": "Trial Period",
  "crm_import_finished_success_number": "Import is finished. Successfully imported contacts: %d.",
  "time_select_proj_title": "Select Project",
  "Generate link from sync": "Generate link from GSync",
  "auth_forgot_passw_page_title": "Forgotten password",
  "Change due date for other user issue": "Change due date for other user issue",
  "disc_no_replies": "no replies",
  "c_priority": "Priority",
  "tasks_tag_start_word": "Starts %s",
  "disc_no_perm_to_edit_disc": "You have no permissions to edit this discussion.",
  "disc_order_date_title": "Date",
  "Manage notification subscriptions for other user wiki for himself": "Manage notification subscriptions for other user wiki for himself",
  "Reset own task time": "Reset own task time",
  "mkplc_back_to_addons": "Back To Add-ons",
  "hints_and_tips": "%s Hints and tips %s - there are a few sent at first, then very rarely after you get started",
  "no_completed_items": "There are no completed tasks",
  "invoices_freshbook_auth_token_title": "Authentication Token",
  "Budget": "Budget",
  "wall_status_placeholder": "What's on your mind?",
  "tasks_archive_group": "Archive List",
  "Your password": "Your password",
  "logs_wiki_13_notify": "{{user_full_name}} updated comment in wiki.",
  "gt_removed_team_title": "These users will be removed from the project because the whole team is removed from it",
  "Dedicated Hosting": "Private Cloud",
  "public_data_feed_empty": "There are no Data Feed Links yet.",
  "Disable backups": "Disable backups",
  "Change progress status for other user task": "Change progress status for other user task",
  "mkplc_agreement": "Agreement",
  "Are you planning to use Freedcamp at work?": "Are you planning to use Freedcamp at work?",
  "invoices_estimate_title": "Estimate",
  "Opening...": "Opening...",
  "Team Player": "Team Player",
  "logs_wiki_3": "{{user_full_name}} delete wiki {{title}}.",
  "cft_f_type_separator": "Separator",
  "Inline images and following": "Inline images and following",
  "crm_sidebar_export_btn": "export",
  "All tasks": "All tasks",
  "verify_and_activate": "Verify code and Activate",
  "files_download_zip_title": "Download as a zip",
  "Discount Amount": "Discount Amount",
  "invoices_logo_title": "Invoice Logo",
  "files_folder_edit_popup_title": "Update Folder",
  "Keep due dates or no": "Keep due dates or no",
  "activate_unsuccessful": "Unable to Activate Account",
  "check_out_faq": "Check out our %sFrequently Asked Questions%s",
  "tweet_us": "P.S. Have a success story of your own to share? Tweet us",
  "crm_contact_new": "Contact",
  "crm_dashboard_header": "Last Activity",
  "paying_monthly": "paying <b>monthly</b>.",
  "Group Info": "Group Info",
  "Only group owner can remove logo!": "Only group owner can remove logo!",
  "Export data": "Export data",
  "Delete other user task": "Delete other user task",
  "TOTAL score": "TOTAL score",
  "it_activity_today": "activity today",
  "storage_plan_more": "More",
  "Coupon is incorrect": "Invalid coupon",
  "logout_successful": "Logged Out Successfully",
  "c_have_no_permissions_to_msg": "You don't have permissions to %s!",
  "c_search_replace": "Replace",
  "mkplc_item_type_user_app": "User Application",
  "Edit Event": "Edit Event",
  "Your name": "Your name",
  "Delete own milestone": "Delete own milestone",
  "please_use_sso": "Please use %s SSO to sign in.",
  "mkplc_app_animated_demo": "Animated Demo",
  "storage_plan_5": "Plus",
  "mkplc_price_per_year": "year",
  "Reschedule": "Reschedule",
  "manage_unlink_twitter": "Your account has been successfully unlinked from Twitter",
  "files_navigation_back": "Back",
  "Import Tasks from an XLS file": "Import Tasks from an XLS file",
  "new_user_joined_plur": "<b>%s new</b> users joined",
  "auth_my_invitations_title": "New Project Invitations",
  "mkplc_module_renew_failed": "Renewal for this module has failed.",
  "Roles": "Roles",
  "premium_support": "Premium support",
  "cal_jul": "Jul",
  "Try New Manage System": "Try New Manage System",
  "c_try_again": "Please try again.",
  "Invitation email has been sent": "Invitation email has been sent",
  "Filter": "Filter",
  "Set up your Project": "Set up your Project",
  "Add CRM task": "Add CRM task",
  "You are about to permanently leave a project": "You are about to permanently leave a project.",
  "credits_added": "Credits added",
  "remove_user_from_all_projects": "You are about to remove <b>%s</b> from all of your projects",
  "Request project owner to upgrade to specific paid plans": "Request project owner %s %s to \nupgrade to %s to get access",
  "bookmarks": "Bookmarks",
  "Upgrade": "Upgrade",
  "Message": "Message",
  "value_plural": "values",
  "manage_account_gravatar_title": "Gravatar",
  "upsell_tasks_no_cc": "Nothing to lose. No credit card required, try it with no concerns",
  "it_reopen": "Re-open",
  "Your account has been updated.": "Your account has been updated.",
  "tasks_view_active_groups": "View Active Task Lists",
  "dash_set_default": "Set as Default Page",
  "tasks_delete_my_completed": "Delete My Completed Tasks",
  "c_file_delete_link_title": "Delete file",
  "cft_select_field_type": "Select Field Type",
  "Create Project": "Create Project",
  "time_reopen": "Reopen",
  "daily_recap_act_title": "Consider taking the following actions",
  "c_smth_wrong_title": "There has been an issue",
  "disc_no_discussions": "Looks like you're all out of Discussions right now...",
  "Invoice #%d": "Invoice #%d",
  "Get one daily email with all previous day changes in all projects you are a part of": "Get one daily email with all previous day changes in all projects you are a part of",
  "Copy task": "Copy task",
  "Shortcut has been successfully saved.": "Shortcut has been successfully saved.",
  "invoices_email_sent_success_msg": "Email sent successfully!",
  "Create Group": "Create Group",
  "email_in_short_descr": "Create tasks, discussions, issues and upload files from emails",
  "manage_price_free": "Free",
  "it_visible_to_team": "Visible to your team",
  "Data Feed Links": "Data Feed Links",
  "company_name_and_details": "Company Name & Details",
  "help_suggestions_descr": "Have a great idea you think we can add to the system?",
  "with %d files": "with %d files",
  "invoices_edit_estimate": "Edit Estimate",
  "files_move_destination": "Destination",
  "c_app_time": "Time",
  "Everything in %s, plus:": "Everything in %s, plus:",
  "backup_plan_4": "One Time",
  "Some user": "Some user",
  "From scratch": "From scratch",
  "dash_greetings_on_msg": "Greetings are enabled now.",
  "invoices_no_time_tasks_msg": "There are currently no time tasks to bill.",
  "invoices_from_title": "From",
  "crm_completed": "completed",
  "learn_more": "Learn more",
  "Email In": "Email In",
  "storage_plan_premium": "Premium",
  "invoices_your_company": "Your Company",
  "This username already exists in our system. Try a different one.": "This username already exists in our system. Try a different one.",
  "invoices_time_tasks": "Time Tasks",
  "c_item_calendar_title": "Calendar event",
  "crm_campaign_target_leads_title": "Target Leads",
  "Bulk Invite": "Bulk Invite",
  "Subscription Amount": "Subscription Amount",
  "leave_reason_android_missing": "Missing Android application",
  "paying_yearly": "paying <b>yearly</b>.",
  "invalid_twitter": "Please enter a valid Twitter name",
  "rsvp_remove_from_calendar": "Please remove this event from your calendar(s)",
  "manage_clone_no_keep_dates_err": "%APP_NAMES% must have due dates - please uncheck %THESE_APPS% or select 'Yes' here",
  "file upload size": "file upload size",
  "bad_subtask_h_level": "Line %d, column %s (%s): '%s' - wrong subtask hierarchy level",
  "logs_calendar_2_notify": "{{user_full_name}} edited event.",
  "User is already invited.": "User is already invited.",
  "custom_fields_short_descr": "The most advanced Custom Fields online.",
  "Hiding archived projects.": "Hiding archived projects.",
  "import_no_titles_row": "Your xls file doesn't contain row with column titles",
  "project_deleted": "Project not found. Most likely it was deleted.",
  "Not Started": "Not Started",
  "logs_discussions_10": "{{user_full_name}} delete comment in discussion {{name}}",
  "Drag user to application": "Drag user to application",
  "Your Company Name": "Your Company Name",
  "Download template": "Download template",
  "it_issue_type": "Issue Type",
  "Generating report, please wait": "Generating report, please wait",
  "subfolder_plural": "subfolders",
  "Invalid password": "Invalid password",
  "Branded Freedcamp page": "Branded Freedcamp page",
  "This email is already used for the invitation above": "This email is already used for the invitation above",
  "Log Out (all devices)": "Log Out (all devices)",
  "time_task_add_success_msg": "Your time record has been added successfully!",
  "logs_milestones_12_notify": "{{user_full_name}} reset milestone.",
  "Logo successfuly removed": "Logo successfuly removed",
  "Add Task": "Add Task",
  "c_timezone_not_match": "Your computer's time zone does not appear to match your Freedcamp time zone preference of ",
  "being_productive": "Start being more productive today",
  "FAQ": "FAQ",
  "Add Users to invite": "Add Users to invite",
  "logs_todos_16_notify": "{{user_full_name}} unlink {{entity_title}} to a Milestone.",
  "dash_from_template_btn_title": "From template",
  "h_Calendar": "Calendar",
  "storage_plan_9": "More - Yearly",
  "Not sure": "Not sure",
  "%s module": "%s module",
  "rtpl_weekly": "Weekly",
  "You dont have enough permissions or project does not exist.": "You dont have enough permissions or project does not exist.",
  "it_issue_delete_success_msg": "Issue deleted successfully!",
  "Owner plan": "Owner plan",
  "Error getting calendar data. Please reload the page": "Error getting event data. Please reload the page.",
  "no_mentions": "You don't have any mentions",
  "start/stop": "start/stop",
  "it_status_completed": "Completed",
  "2FA": "2FA",
  "tasks_view_arch_group": "View %d archived list",
  "Copy / Move a task list": "Copy / Move a task list",
  "Team Size": "Team Size",
  "logs_bugtracker_13_notify": "{{user_full_name}} updated comment in issue.",
  "Pro User": "Pro User",
  "Create folder": "Create folder",
  "tasks_import_only_xls_support_msg": "For now, only .xls format is supported. Please save your file as .xls and try again.",
  "use_custom_fields_toggle": "Use custom fields in this project",
  "you_can_request_to_reduce_plural": "You can request to reduce billing to %d - %d users below.",
  "recurr_a_recurrence": "a recurrence",
  "Card Number": "Card Number",
  "manage_clone_project_project_label": "Copy from Project",
  "c_export_all": "All",
  "Rate": "Rate",
  "Available Group Applications": "Available Group Applications",
  "help_security_practices": "Security Practices",
  "help_wiki_app_title": "Wiki",
  "Manage group admins": "Manage group admins",
  "file size limit": "file size limit",
  "Company": "Company",
  "passman_security_level": "Security level",
  "no_pro_create_new": "There are no projects. Create a %s new project %s.",
  "Attach files up to 25MB in size": "Attach files up to 25MB in size",
  "passman_operaton_success_msg": "The Operation Finished Successfully!",
  "you_pay_per_active_user_monthly": "You pay per active user monthly",
  "import_missed_column": "Your xls file doesn't have '%s'. It should be the %s column",
  "dash_change_view": "Change View",
  "cal_mo": "Mo",
  "Contact info": "Contact info",
  "manage_team_name_label": "Team name",
  "import_fix_creator_label": "I am task creator if original creator is not a member of the project",
  "files_filter_app_title": "Application",
  "Disable": "Disable",
  "passman_delete_success_msg": "Delete Successfull!",
  "The plan includes all of these great features": "The plan includes all of these great features:",
  "my_card_usd": "My card is United States Dollar (USD)",
  "The comment description is required!": "The comment description is required!",
  "edit": "edit",
  "passman_username": "Username",
  "you_have_no_users_in_group": "You have no users in this group, please invite users to the projects first.",
  "(some error occured)": "(some error occured)",
  "billed yearly": "billed yearly",
  "mile_edit_milestone_title": "Edit Milestone",
  "Download": "Download",
  "Archived projects are hidden": "Archived projects are hidden",
  "allow_to_join_descr": "If ON, public viewers are able to ask to join this project",
  "storage_plan_10": "Plus - Yearly",
  "Enter the name of your Company": "Enter the name of your Company",
  "files_version_delete_success_msg": "Successfully deleted file version!",
  "You cannot delete a Team which any current Group Admin": "You cannot delete a Team which any current Group Admin(s) is a member of",
  "this email sent by %s": "this email sent by %s",
  "no_user_name_selected": "No name entered",
  "Widget": "Widget",
  "New People": "New People",
  "global_invitations_success_msg": "Congratulations! You are ready to conquer the world.",
  "it_edit_issue": "Edit Issue",
  "leave_comment_label": "Any other comments you'd like to share (please be honest)",
  "Line %d, cloumn %s (%s): %sthere is no such user in the project": "Line %d, column %s (%s): '%s' - there is no such user in the project",
  "Switch to old Manage System": "Switch to old Manage System",
  "go to Freedcamp": "go to Freedcamp",
  "disc_content_title": "Content",
  "logs_discussions_3_notify": "{{user_full_name}} deleted discussion.",
  "tasks_be_less_specific": "Try being less specific or use different filters.",
  "Quick Add": "Quick Add",
  "annual_non_refundable": "* - since the annual subscription is a one-year commitment your payment is non-refundable.",
  "auth_reset_email_general_sent": "Email has been sent to you to reset password",
  "cal_started": "Started",
  "Destination project group": "Destination project group",
  "Edit own comment": "Edit own comment",
  "invoices_qty": "Qty",
  "Wiki has been successfully deleted": "Wiki has been successfully deleted.",
  "Add Tasks to a milestone": "Add To-Do's to a milestone",
  "Our Supporters": "Our Supporters",
  "invalid_skype": "Please enter a valid Skype name",
  "leave_reason_better_other": "Other",
  "app_not_installed": "You don't have this application installed.",
  "Configuration error. This application can not be linked!": "Configuration error. This application can not be linked!",
  "tasks_manage_groups": "Manage Task Lists",
  "add some": "add some",
  "Interested in chatting": "Interested in chatting with a sales professional?",
  "Contact": "Contact",
  "crm_contacts_other_addresses": "Other Addresses",
  "Search files by name or type, preview": "Search files by name or type, preview",
  "private_hosting_regions": "(EU, AU regions available)",
  "show_all_file_versions": "Show all versions",
  "recurr_msg_not_allowed_parent_is_recurr": "Can't be recurrent because of parent recurrent task.",
  "crm_campaign_no_goal_msg": "No Goal.",
  "Storage Upgrades": "Storage Upgrades",
  "onb_groups_hint": "Group's are a great way to logically organize your projects.",
  "tasks_reset_progress": "Reset Progress",
  "phone_number_rule": "11 digits no spaces ex.80512398761",
  "mile_add_milestone_title": "Add Milestone",
  "rsvp_going": "Going?",
  "Public project access requests": "Public project access requests",
  "tasks_drag_to_assign": "drag to assign",
  "help_create_project": "Create a Project",
  "You have %s unread notifications": "You have %s unread notifications.",
  "Delete own Items": "Delete own item",
  "greater_than": "The %s field must contain a number greater than %s.",
  "logs_milestones_3": "Milestone {{name}} has been deleted.",
  "help_proj_archiving_unarchiving": "Projects archiving and unarchiving",
  "Search files by name or type, preview, switch Google accounts": "Search files by name or type, preview, switch Google accounts",
  "cancel subscription": "Cancel subscription",
  "c_first_name": "First Name",
  "it_externally": "Via Issue Reporter",
  "crm_log_action_edit": "edit",
  "resync_info": "If there was a problem syncing to your calendar, use this action in order to try to resync.",
  "Date Created, asc": "Date Created, asc",
  "Phone": "Phone",
  "Project Group Apps": "Project Group Apps",
  "see_preview": "See Preview",
  "cal_sun": "Sun",
  "cal_th": "Th",
  "global_search_try_again": "Please update your search and try again",
  "c_upgrade_storage_1": "Upgrade storage",
  "files_move_curr_folder_selected": "Current folder is selected",
  "mkplc_unlimited": "Unlimited",
  "disc_back_lnk_title": "Back",
  "tasks_no_perm_group": "No permissions for this Task List!",
  "Delete User from Team": "Delete User from Team",
  "no_permissions_clone_specified_proj": "You don't have permissions to clone specified project.",
  "CBS TV Network": "CBS TV Network",
  "There are no subscriptions in your account": "There are no subscriptions in your account",
  "crm_tasks_add": "Add Task",
  "user_is_not_part_of_project": "%s is no longer part of this project.",
  "auth_join_projects_title": "Join projects",
  "invoice_update_invoice_success_msg": "Invoice updated successfully!",
  "new_user_invited": "new user invited %s",
  "c_session_expired_label": "Your session expired. To continue - please enter your credentials below:",
  "Unsupported image type!": "Unsupported image type!",
  "% first month": "% first month",
  "tasks_complete_btn_title": "Complete",
  "Storage Billing Agreement": "Storage Billing Agreement",
  "User Account": "User Account",
  "mkplc_app_removed_from_projects": "Application has been successfully removed from all yours projects",
  "There are no members in this project.": "There are no members in this project.",
  "mkplc_app_renewed": "You've successfully renewed subscription for this application",
  "update_email": "update email",
  "No calendars available for refresh.": "No calendars available for refresh.",
  "delete_add_child_or_sibling_space": "%sDelete %s, add %sChild %s or %sSibling %s space",
  "logs_wiki_2_notify": "{{user_full_name}} edited wiki.",
  "mkplc_err_getting_backup": "Error getting the backup plan data",
  "You are about to delete a %s %s": "You are about to delete a %s %s",
  "Errors occurred, please check": "Errors occurred, please check",
  "Choose": "Choose",
  "Can not remember your current password? %s Restore your password by email. %s": "Can't remember your current password? %s Restore your password by email. %s",
  "Create": "Create",
  "c_my_order": "Set order",
  "Carrier": "Carrier",
  "dash_no_projects_3": "to get started.",
  "leave_reason_better_trello": "Trello",
  "files_filter_uploaded_by_title": "Uploaded by",
  "c_no_matching_tasks_msg": "There are no tasks matching your criteria.",
  "Change card": "Change card",
  "login_unsuccessful": "Sorry, that username/password combination does not match our records.",
  "Hide these tips": "Hide these tips",
  "Kanban Board": "Kanban Board",
  "Change role (global)": "Change role (global)",
  "crm_sidebar_import_btn": "import",
  "Mark Billed / Unbilled own task": "Mark Billed / Unbilled own task",
  "after": "after",
  "it_everyone_plural": "Everyones",
  "sup_resp_3_days": "Support response within 3 business days",
  "tasks_no_convert_with_mile": "Task with linked milestone can't be converted to subtask.",
  "Project to duplicate": "Project to duplicate",
  "miles_no_start_date_proj": "Milestonses in this project do not support start date.",
  "use_existing_card": "I want to use existing card",
  "c_add": "Add",
  "Most likely this widget was deleted from other tab, try to refresh page": "Most likely this widget was deleted from other tab, try to refresh page",
  "Sticky notes - we have them": "Sticky notes - we have them",
  "too_many_pending_invites_advice": "Please confirm your email on My Account page to increase the pending invitations limit.",
  "invoices_deposit_past": "Deposited",
  "c_city": "City",
  "Add / edit versions for other user wiki": "Add / edit versions for other user wiki",
  "No group admins": "No group admins",
  "Google Calendar Sync": "Sync to Google Calendar",
  "Change due date for own item": "Change due date for own item",
  "Choose Project To Add Entry": "Choose Project To Add Entry",
  "Sure": "Sure",
  "Members": "Members",
  "global_search_min_4_chars": "Search text must be at least 4 characters long",
  "login_url": "Login URL",
  "files_filter_uploaded_date_title": "Uploaded date",
  "passman_import_success": "Number of successfully imported passwords: %d",
  "shift_mile_dates_title": "Shift milestone \"%s\" and task dates inside",
  "it_closer_warn_curr_msg": "Only closer can complete / re-open this issue.",
  "invoices_add_another_task": "add another task",
  "no_assigned": "You don't have any updates in items assigned to you",
  "reports_missed_tasks": "%s tasks have no assignment",
  "Change week start day": "Change week start day",
  "files_folder_download_empty_msg": "Selection should contain files to be downloaded.",
  "subfolder": "subfolder",
  "leave_reason_better_basecamp": "Basecamp",
  "tasks_no_completed_tasks_msg": "You don't have completed tasks to delete.",
  "dropbox_short_descr": "Attach any of your Dropbox files inside of Freedcamp as if they were uploaded into the system.",
  "Delete other user event": "Delete other user event",
  "Account status": "Account status",
  "upsell_tasks_do_more": "Did you know %s can do a lot more",
  "Change assignment for other user issue": "Change assignment for other user issue",
  "tasks_gantt_view": "The Gantt view",
  "export_all_users_warn_msg": "This file contains users invited to projects you own. Your account is - %s",
  "manage_add_project_color": "Project Color",
  "backup_s3_type_description": "A browsable page where files can be accessed and downloaded individually",
  "invoices_invoice_plural_title": "Invoices",
  "Yes, please cancel": "Yes, please cancel",
  "c_filter_last_month": "Last Month",
  "help_apps_install_uninstall": "Installing &amp; Uninstalling Applications",
  "request_can_not_served_repeat_later": "Your request can not be served now, please repeat later.",
  "Sync": "GSync",
  "time_no_perm_to_project": "No permissions for this project.",
  "passman_no_passwords_msg": "There are no passwords here!",
  "invoices_name_title": "Name",
  "wiki_add_group_btn_hint": "Add New Wiki List",
  "manage_own_in_created_by_other_sub_task": "Create / Add / Remove / Delete own subtasks in (sub)tasks created by other users",
  "Mark Filtered Records as Completed": "Mark Filtered Records as Completed",
  "Share Calendar": "Share Calendar",
  "Team Milestones": "Team Milestones",
  "c_optional": "Optional",
  "Edit Comment": "Edit Comment",
  "Connect Social Accounts": "Connect Social Accounts",
  "c_cancel_search": "Reset Filter",
  "Start date cannot be after End recurrence date": "Start date cannot be after End recurrence date",
  "passman_empty_export_data": "No data to export",
  "Manage notification subscriptions for other user issue for himself": "Manage notification subscriptions for other user issue for himself",
  "and ask to generate Data Feed Link for this project": "and ask to generate Data Feed Link for this project",
  "it_issue_probably_deleted_plural": "Probably selected issues were deleted by another user, please refresh page",
  "tasks_create_next_skipped": "Seems the task with calculated date exists already. Action skipped.",
  "Widget has been successfully saved.": "Widget has been successfully saved.",
  "files_upload_error_msg": "Image upload error",
  "dash_recent_projects_label": "Recent Projects",
  "What I do": "What I do",
  "Bill clients with Time and Invoices applications": "Bill clients with Time and Invoices applications",
  "tasks_import_tpl_ms_other_descr": "This and all following column's will not be imported. Milestones import is not supported for now.",
  "Upgrade to Lite in order to sync": "Upgrade to Lite to access GSync",
  "crm_campaign_target_earn_title": "Target Earnings",
  "Something went wrong!": "Something went wrong!",
  "manage_all_trialed_info": "All paid applications come with a 14 day free trial. No credit card is required.",
  "Hide completed items": "Hide completed items",
  "q_about_billing": "Have a question about how billing works?",
  "public_data_feed_anyone": "Anyone with the link can view this data feed.",
  "Choose from existing users": "Choose from existing users",
  "You are trialing plan, to start another trial please cancel this one first": "You are trialing %s plan, to start another trial please cancel this one first",
  "copy_or_move": "Copy / Move",
  "Delete own discussion": "Delete own discussion",
  "Incorrect plan selected": "Incorrect plan passed, please refresh page and try again",
  "disc_disc_update_success_msg": "You have successfully updated the discussion!",
  "tasks_import_tpl_ms_assigned_to_title": "Milestone Assigned To",
  "Delete link": "Delete link",
  "month": "month",
  "sup_resp_4_hours": "Support response within 4 hours",
  "Yearly Billing": "Yearly Billing",
  "new_mile_tip_title": "We have launched new Milestones v2.1",
  "manage_add_list_button": "Add List",
  "you_currently_on_with_limit": "You are currently on our %s plan offering you %s of storage with a %s size per file limit.",
  "Project Users": "Project Users",
  "rangeByOccurrences2": "occurrence(s)",
  "c_range": "Range",
  "h_Tasks": "Tasks",
  "mkplc_suggest_foot_block_hdr": "Looking for an app?",
  "passman_new_master_pass_required": "The New Master Password field is required.",
  "crm_sidebar_calls_btn": "Calls",
  "white_label_title": "Brand Freedcamp with White Label",
  "Click to access upgrade link.": "Click to access upgrade link.",
  "logs_time_7_notify": "{{user_full_name}} stopped working on time entry.",
  "Write a message": "Write a message",
  "You were invited to the %s project": "You were invited to the %s project",
  "Writer": "Writer",
  "invoices_make_invoice_action_lnk": "Make Invoice",
  "crm_contacts_company_title": "Company",
  "in %s": "in %s",
  "mkplc_bkp_updated": "Your backup plan has been updated.",
  "files_popup_show_tree_lnk_title": "Show tree",
  "codes_printed": "Codes are printed!",
  "c_app_gantt_charts": "Gantt Charts",
  "Delete own wiki": "Delete own wiki",
  "manage_get_more_apps_link_title": "Get More Applications",
  "Discussion boards": "Discussion boards",
  "logs_calendar_2": "{{user_full_name}} edited event {{title}}.",
  "copy_cf_msg_singular": "%sCustom field template%s \"%s\" is not used in a destination project and will not be copied/moved.",
  "time_widget_in_label": "in",
  "public_data_feed_generate_1": "You can generate one Data Feed Link for all your projects from global %sTasks Board%s",
  "Unlimited Forever": "Unlimited Forever",
  "Reset": "Reset",
  "passman_only_create_fsecure_pass": "Only group owner and administrators can create the first secure password.",
  "Want to include custom message for owner": "Want to include your custom message? %s Upgrade to our premium plans %s",
  "c_smth_wrong_detailed_title": "Something has gone wrong. Issue: ",
  "Tasks": "Tasks",
  "c_file_embed_medium_title": "Medium",
  "invoices_invoice_not_found": "Invoice not found",
  "monthlyDayOfMonth1Human": "on day",
  "Incorrect request parameters!": "Incorrect request parameters!",
  "App Store iOS": "App Store iOS",
  "Priority, desc": "Priority, desc",
  "We have 50 active, 215 open, 9 under review, 16 planned, 3 started ideas.": "We have 50 active, 215 open, 9 under review, 16 planned, 3 started ideas.",
  "Edit members": "Edit members",
  "backup_plan_2": "Weekly Backups",
  "email us": "email us",
  "Show": "Show",
  "crm_close_search_title": "close search",
  "c_item_crm_task_title": "CRM Task",
  "Change user team": "Change user team",
  "logs_files_13_notify": "{{user_full_name}} updated comment in file.",
  "c_set": "set",
  "yearlyDayOfMonth1": "Every",
  "Paid Applications": "Paid Applications",
  "Invite new users": "Invite new users",
  "reports_overdue_completed_tasks_singular": "completed overdue task",
  "or sign up with": "or sign up with",
  "Invalid characters.": "Invalid characters.",
  "passman_new_master_pass": "New Master Password",
  "files_no_files_try_root_part1": "No results found in %s.",
  "Share New Calendar": "Share New Calendar",
  "files_attachments": "Attachments",
  "files_folder_name": "Folder name",
  "help_proj_apps_title": "Project Applications",
  "mkplc_app_installs_num": "Installs",
  "Freedcamp Score": "Freedcamp Score",
  "profiles_legend_explanation_4th": "<strong>'Group Admin' </strong>can only delete own (created by him/her) projects.",
  "You will also have access to": "You will also have access to",
  "auth_confirm_email_click_button": "Please click the button below to confirm your email",
  "Date Created, desc": "Date Created, desc",
  "range": "End recurrence",
  "add_projects_change_permissions": "Add Projects & Change permissions",
  "help_main_page_title": "Knowledge Base",
  "Hour(s)": "Hour(s)",
  "Subscribe me": "Subscribe me",
  "to_select_or": "to select or",
  "Change Priority": "Change Priority",
  "c_contains_text": "Contains text",
  "Authentication Token": "Authentication Token",
  "invoices_invoice_title": "Invoice",
  "recurr_next_due_date": "next task due date",
  "it_closer_warn_list_msg_plural": "Only closers can complete / re-open issues %s.",
  "time_task_add_title": "Add Time Record",
  "autocomplete_google_contacts": "Autocomplete results from your Google Contacts",
  "Account Deletion": "Account Deletion",
  "comment": "comment",
  "Cloning can not be started": "Cloning can not be started",
  "c_filter_user_assigned_title": "User assigned to",
  "current_period_active_user_dual": "Current billing month (%s - %s) active users - %d.",
  "global_remove_admin_groups": "This user is a group admin in following groups and will be removed",
  "use": "Use",
  "Business hours description": "Filter calendar on Daily and Weekly views (see the bottom left corner)",
  "files_no_perm_delete_file": "You have no permissions to delete this file.",
  "archived_last_project_in_group": "You archived last project in group. Do you also want to uninstall group applications?",
  "no_groups_create_new": "You don't have any groups, %s add some %s to get started.",
  "start_date": "Start date",
  "c_search_replace_private_to_public": "Do you want to replace existing private saved search '%s' and make it public?",
  "Table of Contents": "Table of Contents",
  "files_some_error_try_reupload_msg": "Some error occured. Please try to upload again.",
  "invoices_state_province_title": "State/Province",
  "valid_email": "The %s field must contain a valid email address.",
  "mkplc_coupon_expired": "Specified coupon expired!",
  "monthlyWeekdayOfMonth1": "The",
  "switch_from_old_to_new_pricing_note": "In order to switch to new pricing plans please cancel your subscriptions first.",
  "cal_august": "August",
  "logs_milestones_2_notify": "{{user_full_name}} updated milestone.",
  "c_end_date": "End Date",
  "logs_wiki_9": "{{user_full_name}} commented on wiki {{title}}.",
  "max_length": "The %s field can not exceed %s characters in length.",
  "help_notifications": "Notifications &amp; Tags",
  "tasks_no_subtasks_module_to_change_parent": "This operation is not supported. Please subscribe to Subtasks add-on in Marketplace to enable it.",
  "auth_attempts_timeout_plural": "You have reached maximum login attempt. Please wait %d minutes to try again.",
  "cal_jun": "Jun",
  "crm_contacts_im_gtalk": "Gtalk",
  "time_start_now_label": "Start Now",
  "sync_loading_title": "We are synchronizing your Freedcamp calendar to Google now",
  "manage_team_id_title": "Team ID",
  "Assign issue to himself": "Assign issue to himself",
  "yearlyInterval2": "year(s)",
  "you_pay_for_user_yearly": "You pay for %d user yearly.",
  "it_no_perm_to_edit_issue_list": "You have no permissions to edit issue %s.",
  "cal_march": "March",
  "This will be displayed on your profile.": "This will be displayed on your profile.",
  "Subscription Center - Freedcamp": "Subscription Center - %s",
  "manage_clone_project_keep_dates_yes_opt": "Yes",
  "Visit the Dashboard": "Visit the Dashboard",
  "c_show": "Show %s",
  "resync_loading_close": "If you close this page you will see if there were any problems next time you visit this page.",
  "teams": "teams",
  "mkplc_canceled_date": "Canceled %s",
  "mkplc_subscribe_now": "Subscribe now",
  "Tasks completed last 7 days": "Tasks completed last 7 days",
  "min_length": "The %s field must be at least %s characters in length.",
  "help_marketplace_apps_modules": "Marketplace Applications and Modules",
  "This billing period with dates you have": "This billing period (%s) you have",
  "Storage status": "Storage status",
  "c_alphabetical": "Alphabetical",
  "enabled_for_new_proj": "<b>Enabled for new</b> projects",
  "help_issue_tracker_start": "Issue Tracker - Quick Start",
  "Coupon Description": "Coupon Description",
  "tasks_conf_del_groups_also": "Also delete all Task Lists with all Tasks completed",
  "shift_dates_hint": "To move dates 5 days earlier, enter -5. To move dates 5 days later, enter 5 or +5.",
  "c_app_passman": "Passwords",
  "Calendar": "Calendar",
  "tasks_subtask_of_title": "Subtask of",
  "Visit your account page": "Visit your account page",
  "Only owner and administrators of this project can do this action": "Only owner and administrators of this project can do this action",
  "We are sorry": "We're sorry",
  "Purchase": "Purchase",
  "reduce_request_saved": "Request has been saved successfully!",
  "with": "with",
  "Renewal Agreement": "Renewal Agreement",
  "auth_register_step1_title": "Sign Up step 1",
  "Global Team": "Global Team",
  "less_than_date": "Entered date must be equal or less than %s",
  "Choose from users in other groups": "Choose from users in other groups",
  "Welcome to the Tasks application!": "Welcome to the Tasks application!",
  "time_no_perm_to_edit": "You have no permissions to edit this time record.",
  "it_user_reported": "User reported",
  "check_our_policy": "Check our %s.",
  "Free Project Management": "Free Project Management",
  "monthlyDayOfMonth2": "of the month",
  "c_delete_list": "Delete List",
  "Manage your Freedcamp subscriptions": "Manage your %s subscriptions",
  "crm_contacts_import_csv_v2": "Import from csv file",
  "not_own_tags_header_title": "Tags in projects I am invited to (can only search)",
  "you_cant_edit_recurring_event": "Sorry, this operation is not supported for recurring events.",
  "filter_appplication": "Application",
  "Manage notification subscriptions for other user discusssion for himself": "Manage notification subscriptions for other user discussion for himself",
  "exact_length": "The %s field must be exactly %s characters in length.",
  "compare_plans_features": "Compare plans and features on our %sPricing Page%s",
  "switched_to_extra_storage_monthly": "Switched to <b>%s</b> extra storage, paying <b>monthly</b>",
  "People In": "People In",
  "dailyInterval1": "Repeat every",
  "Please add at least one task": "Please add at least one task!",
  "This username is taken": "This username is taken",
  "c_medium": "Medium",
  "storage_plan_7": "Unlimited",
  "Community": "Community",
  "c_download_file_link_title": "Download File",
  "manage_add_group_button": "Add Group",
  "REGISTER": "SIGN UP",
  "create_new_task_email_to": "To create a new task email to %s",
  "account_creation_duplicate_email": "Email Already Used or Invalid",
  "Created By Me In Read": "Created By Me & Read",
  "Add Comment": "Add Comment",
  "rsvp_answer_maybe": "I might go",
  "unarchive_project_question": "Are you sure you want to unarchive this project?",
  "Weekly view, calendar options and a high contract theme": "Weekly view, calendar options and a high contract theme",
  "Upcoming tasks": "Upcoming tasks",
  "wl_not_invited": "You have not been invited to any of this domain projects.",
  "invoices_due_amount": "Due: %s",
  "c_notifications": "Notifications",
  "invoices_deposit": "Deposit",
  "change_role_globally_role_changed": "Success! User's role is changed.",
  "Choose Users": "Choose Users",
  "Please enter your password in order to make this project public.": "Please enter your password in order to make this project public.",
  "Generate new API key": "Generate new API key",
  "cft_f_type_number_field": "Number",
  "Import": "Import",
  "Project Group Owner": "Project Group Owner",
  "No project group administrators": "No project group administrators",
  "crm_sidebar_today_header": "Today",
  "Active user billing": "Active user billing",
  "notif_level_default": "Default",
  "invoices_print_estimate": "Print Estimate",
  "logs_wiki_1": "{{user_full_name}} added wiki {{title}}.",
  "passman_dont_want_use_master": "I don't want to use the Master Password",
  "Administrators, Freelancers, etc": "Administrators, Freelancers, etc",
  "c_app_overview": "Overview",
  "group_no_global_teams": "This group doesn't have any Global Teams.",
  "files_new_folder_btn_title": "New Folder",
  "remove_from_all_projects": "Remove from all projects",
  "auth_signup_link_title": "sign up",
  "Can only view tasks, comments, and other items created by other users.": "Can only view tasks, comments, and other items created by other users.",
  "not_change_pre_selected_number": "Please do not change pre-selected user number, as this is special condition for you",
  "disc_no_perm_del_group": "You have no permissions to delete this list.",
  "you_pay_for_user_yearly_dual": "You pay for %d users yearly.",
  "You can view the invoice at the following url": "You can view the invoice at the following url",
  "Skype and Profiles": "Skype & Profiles",
  "Mark Billed / Unbilled other user task": "Mark Billed / Unbilled other user task",
  "rcvp_response": "RSVP response",
  "passman_no_perm_order": "You have no permissions to change password order.",
  "Add invitation message": "Add invitation message",
  "You can not decline an invitation you sent.": "You can't decline an invitation you sent.",
  "permanently_delete_item": "You are about to permanently delete this item.",
  "crm_contacts_social_twitter": "Twitter",
  "* - includes priority email support": "* - includes priority email support",
  "Click here to upgrade": "Click here to upgrade",
  "front_price_for_offline": "Store your data offline starting at %s for monthly and one time backups.",
  "Start / stop counter for own task": "Start / stop counter for own task",
  "c_error_enc_id": "An Error Was Encountered. Error id is %d.",
  "reports_overdue_completed_tasks": "completed overdue tasks",
  "crm_import_success": "Successfully imported contact!",
  "crm_add_contact": "Add Contact",
  "You have no permissions to update this search": "You have no permissions to update this search.",
  "has not joined Freedcamp yet": "%s hasn't joined %s yet",
  "c_name_of_list": "Name of the list",
  "help_tips_box_title": "Check our blog for new updates, tips and tricks",
  "time_mark_as_completed": "Mark as Completed",
  "c_descr_optional": "Description (optional)",
  "storage_plan_3": "Basic",
  "All existing": "All Existing",
  "disc_no_perm_to_delete_disc": "You have no permissions to delete this discussion.",
  "time_error_red_msg_2": "Please edit these records, they are marked in red.",
  "You have no permissions to edit this event": "You have no permissions to edit this event.",
  "Public project link copied to clipboard": "Public project link copied to clipboard",
  "auth_email_not_confirmed": "Your email %s is not confirmed.",
  "All Users in Project": "All Users in Project",
  "request_access_join_project": "To join the project, please send a %s to a project manager.",
  "tip_new_home_title": "The New Home Page",
  "Sign up for Freedcamp": "Sign up for Freedcamp",
  "Task page": "Task page",
  "it_no_perm_to_export_msg": "You have no permissions to export data.",
  "Have a question?": "Have a question?",
  "All Project Group Users": "All Project Group Users",
  "crm_import_empty_file": "Seems that file is empty!",
  "c_not_allowed": "You are not allowed to do this action.",
  "mkplc_paym_install": "Payment and Installation",
  "files_no_perm_edit_folder": "You have no permissions to edit this folder.",
  "Empty hash": "Empty hash",
  "The %s is required.": "The %s is required.",
  "Update": "Update",
  "uptime_100": "99.9% Uptime",
  "c_minute_plural": "minutes",
  "You have successfully left the project": "You have successfully left the project",
  "c_address": "Address",
  "passman_secure_after_import": "Please do not forget to secure just imported passwords with the Master Password",
  "Delete own event": "Delete own event",
  "Get %sEverything%s Done": "Get %sEverything %s Done",
  "mile_progress_in_progress": "In Progress",
  "c_nothing_found_label": "There were no results that matched your search criteria.",
  "you_are_on_plan_but_started": "You are on the <b>%s Plan</b> but started the <b>%s Plan trial</b> expiring on %s",
  "time_related_tasks_label": "Related Tasks",
  "Manage notification subscriptions for other user task for himself": "Manage notification subscriptions for other user task for himself",
  "logs_files_3": "file {{name}} has been deleted.",
  "Get Organized!": "Get Organized!",
  "You have no permissions to edit this wiki": "You have no permissions to edit this wiki.",
  "tasks_default_task_title": "No title",
  "mkplc_remove": "Remove",
  "leave_want_discuss_label": "Would you be willing/interested in discussing your feedback more?",
  "files_no_files_try_root_part2_search_word": "Search",
  "c_next": "Next",
  "This wiki was probably deleted by another user. Please refresh page.": "This wiki was probably deleted by another user. Please refresh page.",
  "Success": "Success",
  "time_no_perm_to_stop": "You have no permissions to stop recording time for this time record.",
  "remove_report_confirm": "Are you sure you want to delete this report?",
  "manage_marketplace_reminder_2_v2": "in our Add-ons page",
  "You can not delete last team in the project. There must be at least one team.": "You can not delete last team in the project. There must be at least one team.",
  "tasks_create_next_added": "The new task has been successfully added.",
  "Remove authorization": "Remove authorization",
  "mile_delete": "Delete milestone",
  "access_start_webinar": "Access to our on-demand “Getting Started” Webinar",
  "manage_add_warning_hide_warning": "I understand, please do not show this in the future",
  "auth_attempts_timeout": "You have reached maximum login attempt. Please wait %d minute to try again.",
  "Unlimited Projects": "Unlimited Projects",
  "logs_files_9_notify": "{{user_full_name}} said:</b> {{comment_description}}",
  "Edit other user wiki": "Edit other user wiki",
  "dash_proj_card_link_apps": "Manage Apps",
  "Add User": "Add User",
  "crm_contacts_im_icq": "ICQ",
  "help_drop_box": "Dropbox",
  "passman_want_to_encrypt": "Do you really want to encrypt one password with the Master Password?",
  "Please scan QR-code": "Please scan QR-code",
  "c_apply": "Apply",
  "Start date": "Start date",
  "It is Free!": "It's Free!",
  "Load More": "Load More",
  "leave_reason_bad_service": "Lack of manuals, how to's and walkthroughs",
  "mile_incomplete_status": "Incomplete",
  "Change progress status for own issue": "Change progress status for own issue",
  "mkplc_app_subscr_removed": "You've successfully cancelled subscription for the application.",
  "Delete other user issue": "Delete other user issue",
  "resend_invitation_one_project": "You must have at least one project in this group to resend invitation.",
  "Expand Sidebar": "Expand Sidebar",
  "passman_create_one_active_group": "Please create at least one more active Password list first.",
  "c_dismiss": "Dismiss",
  "crm_contacts_email_work": "Work",
  "All Unread": "All Unread",
  "files_filter_no_comments": "No comments",
  "passman_wrong_master_pass": "wrong Master Password",
  "rsvp_msg_saved": "Your response has been saved.",
  "app_generate_code_desc": "Your app will then generate a 6-digit verification code, which you use below.",
  "learn_more_link": "%sLearn More%s",
  "Available Project Group Applications": "Available Project Group Applications",
  "tasks_assign_to_me": "Assign to Me",
  "tasks_subtasks_import_template": "Type of a task in a following format:\r\n\r\nTask\r\n|-Subtask\r\n|--Subtask",
  "passman_want_to_remove_security": "Do you really want to remove the Master Password security from one password?",
  "joined_at": "joined %s",
  "Switch to New Manage System": "Switch to New Manage System",
  "This Milestone is linked to %d Tasks": "This Milestone is linked to %d Tasks",
  "manage_create_project_expert": "Expert",
  "tasks_filter_user_created_title": "Created By",
  "files_delete_folder_with_private_files": "Some folders contain private files and were not deleted.",
  "Please choose the project": "Please choose the project",
  "View Project": "View Project",
  "Project Name": "Project Name",
  "logs_discussions_2": "Discussion {{name}} has been edited.",
  "recurrenceType": "Repeats",
  "Collapse Sidebar": "Collapse Sidebar",
  "Load next 3 days": "Load next 3 days",
  "Invite Global Team": "Invite Global Team",
  "Go To Project": "Go To Project",
  "Sync between Freedcamp and Google calendar will be removed. ": "Sync between Freedcamp and Google Calendar will be removed.",
  "Create some projects, and invite the tribe": "Create some projects, and invite the tribe",
  "notif_assigned_group_title": "Assigned to me",
  "orderIndexes_last": "last",
  "Choose a level": "Choose a level",
  "mkplc_ccv": "CVV",
  "Change tasks order": "Change tasks order",
  "c_street_address": "Street Address",
  "version_plural": "%d versions",
  "manage_team_title_1": "Manage apps and teams for",
  "cal_december": "December",
  "cal_recurr_edit_first_error": "Please finish editing recurrence first!",
  "manage_account_new_email": "New Email",
  "tasks_shared_data_feed_link": "Data Feed Link",
  "c_save_comment": "Save Comment",
  "Projects": "Projects",
  "tasks_import_tpl_ms_descr_title": "Milestone Description",
  "request_access_logged_in": "You are currently logged in to Freedcamp as %s.",
  "dash_proj_card_link_archive": "Complete & archive",
  "cant_scant_qr_q": "Can't scan QR-code?",
  "mfa_secure": "MFA to keep all work data secure",
  "edit_template_fieldset": "Edit Template",
  "Widgets Board": "Widgets Board",
  "cal_saturday": "Saturday",
  "Calculating, wait a bit please...": "Calculating, wait a bit please...",
  "mile_no_perm_to_edit_mile": "You have no permissions to edit this milestone.",
  "rangeByEndDate": "On",
  "invoices_subtotal": "Subtotal",
  "cft_template_title": "Template Title",
  "mkplc_manage_subscriptions": "Manage Subscriptions",
  "Comments": "Comments",
  "all Task Lists": "all Task Lists",
  "c_item_task_title_plural": "Tasks",
  "manage_add_project": "Add Project",
  "Edit Version": "Edit Version",
  "major_announcements": "%s Major announcements %s - once or twice a year",
  "mkplc_no_subscr_found": "No subscriptions found to update their billing info!",
  "Expiration Date": "Expiration Date",
  "crm_campaign_profit_title": "Profitability",
  "new_user_joined_sing": "<b>%s new</b> user joined",
  "gt_updated_users_title": "These existing project users will be updated",
  "Upcoming": "My Work",
  "Billing information update failed! Please contact support!": "Billing information update failed! Please contact support!",
  "are_you_want_to_unarchive_group": "Are you sure you want to unarchive this list?",
  "Color": "Color",
  "onb_set_of_tools": "A set of tools to help you accomplish more in your life",
  "see_here_how": "See <a href=\"%s\" target=\"_blank\">here</a> how.",
  "in_project_group": "in <strong>%s</strong> project group",
  "Following errors occurred": "Following errors occurred",
  "mile_start_status": "Start Progress",
  "Kanban view": "Kanban view",
  "Location": "Location",
  "mkplc_app_comments_hdr": "Reviews",
  "position_title": "Title",
  "help_tips_restored": "All tips have been restored.",
  "mkplc_subsc_app_success": "You've successfully subscribed to this application.",
  "mkplc_err_getting_storage": "Error getting the storage plan data",
  "Project ID": "Project ID",
  "Sorry, at the moment backup plans unavailable": "Sorry, at the moment backup plans unavailable",
  "Provided unsubscribe link was not generated for this account": "Provided unsubscribe link was not generated for this account!",
  "time_completed": "Completed",
  "tasks_delete_task": "Delete Task",
  "login_successful": "Logged In Successfully",
  "Use a Badge On My Avatar": "Use a Badge On My Avatar",
  "Make discussion sticky (star it)": "Make discussion sticky (star it)",
  "Help": "Help",
  "charges_debited": "Charges debited",
  "current_password": "Current password",
  "Visit Calendar application": "Visit Calendar application",
  "orderIndexes_3": "third",
  "logs_time_2": "time entry {{description}} has been edited.",
  "cal_dec": "Dec",
  "auth_oauth_login_not_linked": "This %s account does not exist. Please %s sign up %s using %s account first.",
  "Overwrite": "Overwrite",
  "Error occured - cannot create link.": "Error occured - cannot create link.",
  "You have successfully unsubscribed from this kind of emails.": "You have successfully unsubscribed from this kind of emails.",
  "Delete Account": "Delete Account",
  "billing_period_invites_users_pending_invitations": "This billing period invites, active users and pending invitations",
  "cal_su": "Su",
  "crm_tasks_type_thank_you": "Thank You",
  "You have no permissions to add new wiki": "You have no permissions to add a new wiki.",
  "cal_mar": "Mar",
  "You have no permissions to add time record": "You have no permissions to add a time record.",
  "email_for_me_hint": "By default you don't receive email notifications when you create new or edit your own item",
  "it_ebmbed_code": "Issue Reporter",
  "Add Projects": "Add Projects",
  "2FA desc": "Two-factor authentication provides an extra layer of security to the sign in process.",
  "no_access_to_private_item": "You don't have access to this private item.",
  "All completed Time Records were deleted successfully!": "All completed Time Records were deleted successfully!",
  "c_app_discussions": "Discussions",
  "Change team role": "Change team role",
  "time_reactivated_success_msg": "Time record has been re-opened!",
  "Invite Your Co-workers": "Invite Your Co-workers",
  "barcode_scanned_enter_a_code": "Once the barcode above is scanned, enter the 6-digit verification code generated by the app.",
  "future_charges_will_billed": "Future charges will be billed to your %s ending in %s (%supdate card%s)",
  "it_closer": "Closer",
  "rsvp_you_time": "in your time (we used your computer time to convert)",
  "crm_campaign_goal_title": "Goal",
  "c_action_expand_str": "Expand",
  "leave_reason_too_expensive": "Price/value is too high - will be using another vendor",
  "Low": "Low",
  "notif_mentioned_group_title": "Mentioned",
  "Enter email address": "Enter email address",
  "del_all_syncs_and_links": "Do you also want to delete Google Calendars?",
  "c_item_time_title": "Time record",
  "daily_recap_title": "Your Daily Recap",
  "auth_where_are_you_title": "Where are you?",
  "c_not_set": "not set",
  "it_type_task": "Task",
  "Well done": "Well done!",
  "Personal Task Manager": "Personal Task Manager",
  "mkplc_no_spec_bckp_subscr": "You don't have a subscription for this backup plan.",
  "Change user role globally": "Change user role globally",
  "Step 1": "Step 1",
  "Group": "Group",
  "affordable upgrades": "affordable upgrades",
  "upload_browse_or_word": "or",
  "is_natural": "The %s field must contain only positive numbers.",
  "c_click_to_view": "<a href=\"%s\">Click here</a> to view.",
  "disc_seems_disc_deleted_msg": "Most likely this discussion was deleted by another user.",
  "Edit own file": "Edit own file",
  "backup_plan_descr_1": "Get your data emailed to you daily with all the data in your projects",
  "disc_add_group_descr_title": "List Description",
  "Do not notify people on tasks assign": "Do not notify people on tasks assigned",
  "upload_browse_folders": "Folders",
  "Results were paginated": "Results were paginated",
  "custom_field_title_field": "Enter Title for Template",
  "Explore Freedcamp": "Explore Freedcamp",
  "c_wrong_method": "Wrong request method.",
  "c_filter_in_the_past": "In the Past",
  "Back To Manage Apps and Teams": "Back To Manage Apps and Teams",
  "You get:": "You get:",
  "Edit own discussion": "Edit own discussion",
  "tasks_import_tpl_ms_status_title": "Milestone Status",
  "Calendar link copied to clipboard.": "Calendar link copied to clipboard.",
  "tasks_import_tpl_name_title": "Name",
  "200MB of Storage": "200MB of Storage",
  "crm_contacts_download_vcard": "Download vCard",
  "Google sync not created.": "GSync not created.",
  "Your team needs a better way to stay organized": "Your team needs a better way to stay organized",
  "Archiving Task groups": "Archiving Task groups",
  "help_missed_storage": "My Upgraded Storage does not appear",
  "Group Apps": "Group Apps",
  "c_upload_error_title": "Upload error",
  "calendar_instant_gsync": "Instant Google Calendar sync",
  "cmp_group_info_group_owner": "You are the owner of this group.",
  "Get Started in seconds.": "Get Started in seconds.",
  "files_folders_processed_wait": "Please wait a moment, folders are processed...",
  "we_uneble_your_request_try_again": "We are unable to process your request. Please try again.",
  "auth_password_input_placeholder": "Password",
  "it_other_issues": "Other Issues",
  "passman_save_success_msg": "Saved Successfully!",
  "Quick actions and subscriptions": "Quick actions and subscriptions",
  "Access from anywhere in a project": "Access from anywhere in a project",
  "mkplc_app_removed": "This application was successfully removed.",
  "Fast Support": "Lightning Fast Support",
  "sync_loading_close": "Please wait...",
  "logs_todos_2": "{{user_full_name}} updated a {{entity_title}}.",
  "resync_loading_title": "We are synchronizing your Freedcamp calendars to Google now",
  "cal_monday": "Monday",
  "logs_todos_8_notify": "{{user_full_name}} completed {{entity_title}}.",
  "invoices_task_descr": "Description",
  "Add wiki": "Add wiki",
  "manage_clone_project_people_lbl": "People",
  "Time Tracked": "Time Tracked",
  "Download Android App": "Download Android App",
  "or %sclick%s to use last message": "or %sclick %s to use last message",
  "Choose Project": "Choose Project",
  "c_desc": "Desc",
  "c_today": "Today",
  "disc_no_perm_to_stick_disc": "You have no permissions to stick this discussion.",
  "show people from archived projects": "show people from archived projects",
  "invoices_convert_estimate": "Convert Estimate into Invoice",
  "cft_field_title": "Field Title",
  "tasks_wrong_group": "Wrong Task List!",
  "rsvp_msg_you_invited": "You have been invited to an event",
  "invoices_settings_header": "Invoices Settings",
  "Transaction failed": "Transaction failed",
  "auth_enter_email_label": "Enter your email address below and we'll send you password reset instructions.",
  "save_project_button": "Save Project",
  "daily_recap": "Daily Recap",
  "logs_time_6": "time task {{description}} has been started.",
  "Keep calendars": "Keep calendars",
  "files_no_perm": "You don't have access to this file.",
  "logs_bugtracker_2_notify": "{{user_full_name}} updated issue.",
  "Repeat": "Repeat",
  "logs_time_11_notify": "{{user_full_name}} billed time entry.",
  "enterprise_plan_desc": "Designed for businesses who need top-of-the-line features, support, and security.",
  "files_file_name_by_user_by_word": "by",
  "c_app_backups": "Backups",
  "Calendar link not found.": "Calendar link not found.",
  "alpha_dash": "The %s field may only contain alpha-numeric characters, underscores, and dashes.",
  "crm_tasks_already_deleted_msg": "Seems this task was deleted by other user.",
  "logs_calendar_3_notify": "{{user_full_name}} added RSVP response.",
  "Calendar View Options": "Calendar View Mode",
  "Manage notification subscriptions for own discussion": "Manage notification subscriptions for own discussion",
  "Edit own items": "Edit own item",
  "storage_plan_free": "Free",
  "upsell_tasks_try": "Start 14 days Business Plan Trial",
  "passman_no_perm_group_order": "You have no permissions to change list order.",
  "Add Version": "Add Version",
  "tasks_import_tpl_task_title_descr": "Title of a task.",
  "little_reason_file_limit": "Free %s upload limit is too little",
  "no_milestones": "You don't have any Milestones assigned to you",
  "mile_no_perm_to_export_msg": "You have no permissions to export data.",
  "logs_todos_1_notify": "{{user_full_name}} added {{entity_title}}.",
  "Widget Application Type": "Widget Application Type",
  "leave_reason_eng_interface": "Only English interface (please specify desired language below)",
  "manage_users_hint": "Manage all users having access to at least one project in this project group",
  "Your email address": "Your email address",
  "auth_back_login_link_title_b": "Send me back to Sign In page",
  "logs_todos_13": "{{user_full_name}} updated comment in a {{u_title}}",
  "mkplc_item_type_project_app": "Project Application",
  "crm_field_name_exists_err": "Field with this name already exists",
  "Remove user from all apps": "Remove user from all apps",
  "tasks_time_start_work": "Start work",
  "files_info_open_appitem_in_new_tab": "Open %s in new tab",
  "New team": "New team",
  "Privacy explained": "Privacy explained",
  "files_filter_onedrive_title": "OneDrive",
  "scan_qr_by_camera": "Scan the image to the left, using your phone's camera",
  "cal_sa": "Sa",
  "Do not wait another day!": "Don't wait another day!",
  "Search": "Search",
  "OR": "OR",
  "User Profile and Settings": "User Profile & Settings",
  "Director of Engineering": "Director of Engineering",
  "Calendar link regenerated.": "Calendar link regenerated.",
  "Anything but delete a project": "Anything but delete a project",
  "files_filter_box": "Box",
  "logs_wiki_19": "{{user_full_name}} added wiki version {{title}}.",
  "Decline invitation": "Decline invitation",
  "c_app_box": "Box",
  "Expand": "Expand",
  "c_done": "Done",
  "succ_switched_to_free": "You successfully switched to the free plan",
  "auth_bot_detected": "We detected that you are a bot.",
  "files_latest_title": "latest",
  "it_updated": "Updated",
  "wiki_add_group_descr_title": "List Description",
  "auth_forgot_password_1": "Forgot password? Click",
  "enter_each_option_new_line": "Enter each option on a new line",
  "it_stagnating": "Stagnating",
  "shift_dates_affected_tasks_paid": "Only tasks and subtasks having start/end dates will be rescheduled.",
  "disc_back_to_disc_hint": "Back to Discussions",
  "Last 7 days": "Last 7 days",
  "files_no_perm_folder": "You have no permissions for this folder or it was deleted.",
  "it_no_perm_to_edit_issue": "You have no permissions to edit this issue.",
  "dash_no_widgets_2": "add some",
  "There are no logs for this item": "There are no logs for this item",
  "Delete Global Team": "Delete Global Team",
  "Recent Activity": "Recent Activity",
  "cf_confirm_msg_cf": "Are you sure you want to delete this Custom Field?",
  "You have no permissions to delete this event": "You have no permissions to delete this event.",
  "passman_master_secured": "Master Secured",
  "You do not have access to these projects!": "You don't have access to these projects!",
  "mkplc_app_post_review": "Post Review",
  "manage_add_project_description": "Project Description:",
  "files_move_restriction_msg": "Folders can't be moved to themselves or to their subfolders",
  "enter_credit_card_details": "Please enter credit card details",
  "crm_sidebar_tomorrow_header": "Tomorrow",
  "just save, do not email": "just save, don't email",
  "You have created": "You have created",
  "no_tasks": "There are no Tasks assigned to you with a due date",
  "%s sent you an invoice.": "%s sent you an invoice.",
  "files_info_comments_title": "Comments",
  "dash_widgets_page_title": "Widgets Board",
  "Freedcamp offers the following premium features": "Freedcamp offers the following premium features",
  "manage_clone_project_move_monday_lbl": "Do you want new due dates to be moved to Monday if they fall to Saturday or Sunday?",
  "change_role_globally_already_changed": "This user already has this role in all projects.",
  "START TODAY": "START TODAY",
  "Custom feature development": "Custom feature development",
  "Show completed items": "Show completed items",
  "public_data_feed_descr_2": "See %shere%s how.",
  "logs_bugtracker_9": "{{user_full_name}} commented on issue {{title}}",
  "it_closer_assigned": "Closer assigned",
  "files_add_success_msg": "File has been successfully added.",
  "Add SSO connection": "Add SSO connection",
  "You need an existing project to use as a template": "You need an existing project to use as a template",
  "Existing Users": "Existing Users",
  "manage_clone_project_button": "Launch Project Duplicator Now!",
  "Delete own issue": "Delete own issue",
  "Install More Apps": "Install More Apps",
  "Subscriptions": "Subscriptions",
  "Reduce monthly users": "Reduce monthly subscription users",
  "Issues in a specific saved search.": "Issues in a specific saved search.",
  "activation_email_unsuccessful": "Unable to Send Activation Email",
  "it_closer_warn_list_msg": "Only closer can complete / re-open issue %s.",
  "own_tags_header_title_simple": "Tags in my projects",
  "tasks_task_add_success_msg": "Task has been successfully added.",
  "Next payment on": "Next payment on",
  "tasks_convert_to_title": "Convert to",
  "sso_entity_id": "Entity ID",
  "disc_disc_add_success_msg": "Discussion has been successfully added.",
  "permission_message_no_sync_project": "<b>NOTE: </b> Project does not have access to GSync.",
  "mile_view_active": "View Active Milestones",
  "Set as project group administrator": "Set as project group administrator",
  "help_privacy_policy": "Privacy Policy",
  "Filters": "Filters",
  "upsell_tasks_upgrade_descr": "There are a hundred and one great reasons, and we're confident you'll love the added value",
  "Did you mean %s?": "Did you mean %s?",
  "No comments yet!": "No comments yet!",
  "daily_recap_due_to_start": "Due to start",
  "email_in_enabled": "Email In is <b>enabled</b>",
  "Search by selected tags": "Search by selected tags",
  "copy_move_new_task_list": "Copy/Move into a New Task List",
  "logs_todos_10_notify": "{{user_full_name}} deleted comment in {{entity_title}}.",
  "Application Agreement": "Application Agreement",
  "show_archived_lists": "Show Archived Lists",
  "cft_f_type_date_field": "Date",
  "logs_bugtracker_1": "{{user_full_name}} added a new issue.",
  "tasks_nothing_to_show": "There is nothing to show",
  "mkplc_billing_info_updated": "You've successfully updated your billing information!",
  "new_user_has_not_joined_yet_sing": "<b>%d</b> new user has't joined yet",
  "tasks_import_new_import": "New Import",
  "cal_jan": "Jan",
  "shift_dates_hint_1": "By default, only %s\"No Progress\"%s tasks and subtasks will be shifted.",
  "Line %d, cloumn %s (%s): %sYou can use these values: %s": "Line %d, column %s (%s): '%s' - there is no such user in the project. You can use these values: %s",
  "crm_view_back_tasks_lnk": "Back To Tasks",
  "Delete selected tags": "Delete selected tags",
  "View Item": "View Item",
  "crm_call_log": "Call",
  "You can fix errors and start over": "You can fix errors and start over",
  "users_not_added_to_invite": "Following users were not added to invite",
  "Get Started for Free": "Get Started for Free",
  "BETA": "BETA",
  "Module Name": "Module Name",
  "files_popup_folder_descr_title": "Folder description",
  "enter": "Enter",
  "crm_import_empty": "Haven't found any contacts, please check your imported file.",
  "c_app_milestones": "Milestones",
  "Items assigned to you": "Items assigned to you",
  "cal_time_to_earlier_time_from": "Time From must be equal or before Time To",
  "files_open_on_dropbox": "Open on Dropbox",
  "copy_task_title": "Copy task: %s",
  "confirm_action_by_pwd": "You must confirm this action by your password",
  "welcome_to": "Welcome to %s",
  "it_type_usability": "Usability Problem",
  "cft_no_template": "No Template",
  "Click to resend invitation": "Click to resend invitation",
  "c_start_date": "Start Date",
  "time_already_started_msg": "This time record has been already started!",
  "mkplc_sponsored_plan": "Sponsored",
  "Your new e-mail already exists in our system. Try a different one.": "Your new e-mail already exists in our system. Try a different one.",
  "switched_to_extra_storage_yearly": "Switched to <b>%s</b> extra storage, paying <b>yearly</b>",
  "Cancel Subscription": "Cancel Subscription",
  "FileEdit": "FileEdit",
  "it_not_all_issues_deleted": "Not all issues were deleted.",
  "help_group_apps_title": "Project Group Applications",
  "Add link": "Add link",
  "files_no_perm_name_tpl": "You don't have permissions to delete file %s.",
  "acknowledge_deletion": "I acknowledge projects deletion and checked data deletion policy",
  "Invite Multiple Users": "Invite Multiple Users",
  "Manage Projects": "Manage Projects",
  "mkplc_app_installed": "Application has been successfully installed.",
  "files_no_files_try_sub_part4_or_word": "or",
  "files_file_was_deleted_msg": "The file you are uploading a new version to has been deleted. Please refresh page.",
  "crm_contacts_remind_title": "Remind Me",
  "manage_clone_project_move_monday_lbl_v2": "Do you want new due dates to be moved to Monday if they fall on Saturday or Sunday?",
  "Change due date for other user task": "Change due date for other user task",
  "A Task List": "A Task List",
  "Remove syncs marked as out of sync.": "Remove GSyncs marked as out of sync.",
  "auth_email_change_expires": "The code will expire in %s minutes.",
  "Dark": "Dark",
  "Update Avatar": "Update Avatar",
  "tasks_subtask_title_plural": "Subtasks",
  "files_filter_gdrive_title": "Google Drive",
  "Task Lists": "Task Lists",
  "Keep calendar": "Keep calendar",
  "you_already_have_overwrite_it": "You already have shortcut pointing to this page.<br> Do you want to overwrite it with a new name?",
  "Coming Soon": "Coming Soon",
  "Synced with Google Calendar.": "Synced with Google Calendar.",
  "rsvp_from": "From",
  "yearlyWeekdayOfMonth3": "of",
  "Click  here to resend verification email": "Click  here to resend verification email",
  "passman_add_password": "Add Password",
  "time_record_add_success_msg": "Time record has been successfully added.",
  "you_pay_for_user_monthly_dual": "You pay for %d users monthly.",
  "%s will be available for you in all the projects.": "%s will be available for you in all the projects.",
  "last 90 days": "last 90 days",
  "recurr_last_is_deleted": "The last occurrence was deleted and recurrence was stopped",
  "tasks_time_worked_minutes": "Worked mins",
  "mile_mile_add_success_msg": "Milestone has been successfully added.",
  "help_project_groups_creation": "How to create project groups",
  "Jennifer": "Jennifer",
  "cal_sunday": "Sunday",
  "wiki_create_active_group_msg": "Please create at least one more active Wiki list first.",
  "feature_task_board_desc": "A quick way to see Tasks from all your projects in one place",
  "There were new notifications pending which are now shown as unread.": "There were new notifications pending which are now shown as unread.",
  "c_project": "Project",
  "invoices_estimate_not_found": "Estimate not found!",
  "auth_new_passw_submit_btn_title": "Ready",
  "invoices_estimate_plural_title": "Estimates",
  "you_pay_per_active_user_annual": "You pay per active user per year",
  "c_no_project": "You have no projects.",
  "cft_dropdown_options": "Dropdown Options",
  "remove_from_mile": "Remove from Milestone",
  "help_faq": "Frequently Asked Questions - FAQ",
  "Details": "Details",
  "ribbon_confirm_email_msg": "You haven't confirmed your email yet. Emails are muted for now.",
  "sso_provider_title": "SSO Provider",
  "Projects You Own": "Projects You Own",
  "are_you_want_to_del_group_without_details": "Are you sure you want to delete this list, all items inside will be lost?",
  "Last Updated, desc": "Last Updated, desc",
  "Get started by installing some Group Applications from our %s Marketplace %s!": "Get started by installing some Group Applications from our %s Marketplace %s!",
  "Yes, Decline": "Yes, Decline",
  "tasks_collapsed_thing_title_uc": "COLLAPSED",
  "files_filter_extension_title": "Extension",
  "Add all users": "Add all users",
  "invoices_pay_invoice": "Pay Invoice",
  "files_delete_version_lnk_hint": "Delete Version",
  "c_app_recurrence": "Recurring items",
  "Coupon Applied": "Coupon Applied",
  "I want to switch": "I want to switch",
  "no_syncs_popup_text": "Check our instant Google Calendar Sync",
  "Animated demo": "Animated demo",
  "wiki_no_perm_add_group": "You have no permissions to add a list.",
  "There are no entries matching your criteria.": "There are no entries matching your criteria.",
  "manage_uninstall_btn_title": "Uninstall",
  "You are up-to-date": "You're up-to-date!",
  "passman_share_with": "Share with",
  "feature_passwords_desc": "Sharing accounts for different services made easy, no simpler and more secure way to handle this",
  "crm_contacts_import_required_note": "First name and Last name are required fields!",
  "manage_edit_project_group_id": "Group:",
  "Mark My Filtered Records as Completed": "Mark My Filtered Records as Completed",
  "Set all": "Set all",
  "Position": "Position",
  "c_state": "State",
  "Backup Billing Agreement": "Backup Billing Agreement",
  "backup_upgrate_plane_desc": "Backups are not included to your <b>%s plan</b>. %sUpgrade %s to enable it.",
  "tasks_invalid_date": "Please enter a valid date",
  "shift_dates_completed_progress_tasks": "Completed tasks and tasks in progress will not be rescheduled.",
  "Lily Malone": "Lily Malone",
  "invoices_add_first_client": "Add your first client",
  "No Change": "No Change",
  "Due date, asc": "Due date, asc",
  "c_popup_unsaved_data_msg": "Are you sure you want to close the popup? You have unsaved data.",
  "files_filter_versions_count_title": "Versions count",
  "Add Milestone": "Add Milestone",
  "Invite": "Invite",
  "Calendar sync not found.": "Calendar GSync not found.",
  "invoices_edit_invoice": "Edit Invoice",
  "Calendar sync(s) removed.": "Calendar GSync(s) removed.",
  "Freedcamp Free Project Management and Collaboration": "Freedcamp Free Project Management and Collaboration",
  "c_see_all_tasks": "See All Tasks",
  "crm_campaign_delete_success_msg": "Campaign deleted successfully!",
  "Your Company Position": "Your Company Position",
  "files_move_move_btn_title": "Move",
  "logs_discussions_1_notify": "{{user_full_name}} has added a new discussion.",
  "tasks_back_to_tasks_board": "Back to Tasks Board",
  "Notes": "Notes",
  "Open grapevine popup": "Open grapevine popup",
  "files_filter_large": "large",
  "disc_private": "Private",
  "Lite": "Lite",
  "Recipient email": "Recipient email",
  "Current plan details": "Current Plan Details",
  "c_export_time_days": "days",
  "Link your Google Drive, Dropbox or OneDrive files to your projects": "Link your Google Drive, Dropbox or OneDrive files to your projects",
  "c_del_confirmation": "Are you sure you want to delete that?",
  "files_popup_choose_file": "Choose File",
  "mkplc_what_subscr_apply_to": "What subscriptions apply to",
  "Kickstarter Backers Only Options": "Kickstarter Backers Only Options",
  "mkplc_bkp_renewed": "You've successfully renewed subscription for backups.",
  "help_api_integrations_title": "API and Integrations",
  "files_filter_one": "one",
  "No members": "No members",
  "files_open_on_onedrive": "Open on OneDrive",
  "Copy to Clipboard": "Copy to Clipboard",
  "Legend": "Legend",
  "crm_contacts_import_excel_v2": "Import from MS Excel file",
  "cal_friday": "Friday",
  "help_discussions_app_title": "Discussions",
  "View Projects Board": "View Projects Board",
  "c_country": "Country",
  "Send Message": "Send Message",
  "files_no_files_try_root_part3_root_word": "all project files",
  "Period": "Period",
  "Created Tasks": "Created Tasks",
  "files_info_user_on_date": "%s on %s",
  "Sort By": "Sort",
  "currently installed": "[currently installed]",
  "time_delete_success_msg": "Your time record has been deleted successfully!",
  "dash_no_widgets_3": "to get started!",
  "Toggle Search Form": "Toggle Search Form",
  "rsvp_declined": "Declined",
  "disc_add_group_btn_hint": "Add New Discussion List",
  "crm_calls_add": "Add Call",
  "Add versions and comments": "Add versions and comments",
  "crm_with_title": "With",
  "Calendar Board": "Calendar Board",
  "All milestones sorted by Due Date from due soon to due later.": "All milestones sorted by Due Date from due soon to due later.",
  "logs_todos_16": "{{user_full_name}} unlink {{entity_title}} to a Milestone.",
  "project_plural": "projects",
  "Reason For Cancelling the Subscription": "Reason For Cancelling the Subscription",
  "auth_names_input_placeholder": "First & Last Name",
  "manage_install_btn_title": "Install",
  "mkplc_back_to_market": "Back To Marketplace",
  "Add Password": "Add Password",
  "Group Applications": "Group Applications",
  "Report": "Report",
  "mkplc_item_type_module": "Module",
  "You can only link Tasks to Milestones you created.": "You can only link Tasks to Milestones you created.",
  "No account with that e-mail address exists.": "No account with that e-mail address exists.",
  "Edit other user items": "Edit other user item",
  "leave_reason_bad_support": "Support/Docs didn't answer my questions",
  "leave_reason_dont_use": "I don’t use it enough",
  "logout_url": "Logout URL",
  "cal_november": "November",
  "Business hours": "Business hours",
  "Sticky Notes": "Sticky Notes",
  "crm_sidebar_custom_fields_btn": "custom fields",
  "auth_or_sign_up_with": "or sign up with",
  "c_me_filter": "(Me)",
  "shift_dates_offset": "Days offset",
  "Data Backup": "Data Backup",
  "All items": "All items",
  "regex_match": "The %s field is not in the correct format.",
  "you_pay_for_user_yearly_plural": "You pay for %d users yearly.",
  "Import Contacts": "Import Contacts",
  "crm_contacts_social_other": "Other",
  "sup_resp_1_days": "Support response within 1 business day",
  "Change Password": "Change Password",
  "c_last_name": "Last Name",
  "Liked by": "Liked by:",
  "Your Freedcamp Score": "Your Freedcamp Score",
  "Easy to spot, filter and search in Files application": "Easy to spot, filter and search in Files application",
  "tasks_group_title": "Task List",
  "Read-Only": "Read-Only",
  "change plan": "change plan",
  "are_you_sure_to_do": "Are you sure you want to do that ?",
  "invoices_tax": "Tax",
  "Easy search and order": "Easy search and order",
  "no_issues": "No Issues were assigned to you with a due date",
  "Projects selected are not gsync enabled. Click to access upgrade link.": "Projects selected are not GSync enabled. Click to access upgrade link.",
  "help_personal_apps_title": "Personal Apps",
  "Previous Week": "Previous Week",
  "Google Contact": "Google Contact",
  "recurr_a_recurring": "recurring",
  "it_no_perm_to_delete_issue": "You have no permissions to delete this issue.",
  "tasks_edit_subtask_title": "Edit Subtask",
  "Create Invoice": "Create Invoice",
  "select_group_or_project": "Select groups OR projects",
  "Manage notification subscriptions for other user item for other users": "Manage notification subscriptions for other user item for other users",
  "tasks_import_tpl_required_col": "Required column",
  "help_tasks_app_title": "Tasks",
  "c_app_bugtracker": "Issue Tracker",
  "Filter projects": "Filter projects",
  "Canceled but valid until %s": "Canceled but valid until",
  "help_ios": "iOS",
  "deleted_last_project_in_group": "You deleted last project in group. Do you also want to uninstall group applications?",
  "leave_sorry_title": "We're sorry to see you leave Freedcamp",
  "like_item": "Like",
  "del_group_contains_projects": "It contains {0} projects inside which will also be deleted.",
  "password_for_security": "provide your password for security",
  "copy_move_existing_list": "Copy/Move into Existing Task List",
  "Cancel Subscriptions": "Cancel Subscriptions",
  "manage_tems_title": "Teams",
  "cft_save_field": "Save Field",
  "Desktop": "Desktop",
  "Items you are involved with": "Items you are involved with",
  "time_time_reactivate_error_msg": "Error while time record was moving to current",
  "recurr_occur_lost": "All the occurrences in the series will be lost",
  "No role": "No role",
  "global_search_no_results": "No results found.",
  "clicking_sign_up_accept": "By clicking \"Get Organized!\" you accept our %s",
  "c_update": "Update",
  "logs_discussions_13_notify": "{{user_full_name}} updated comment in discussion.",
  "unsure": "unsure",
  "logs_time_2_notify": "{{user_full_name}} updated time entry.",
  "notifications_view_all_users": "View all %d users (alphabetically)",
  "passman_password_group_name": "Password list name",
  "Change due date for own task": "Change due date for own task",
  "c_choose_date": "Choose Date",
  "noRepeatEvery": "The Repeat every field must be between 1 and 1000",
  "monthly_backups": "Monthly data backups",
  "deleted_item_unsubscribe_link_msg": "You followed unsubscribe link for now deleted item.",
  "email_in_copy_clipboard_and_close": "Copy email to clipboard & close",
  "%s project": "%s project",
  "dash_from_scratch_btn_title": "From scratch",
  "c_archived_by": "Archived By",
  "crm_sidebar_overdue_header": "Overdue",
  "Delete other user comment": "Delete other user comment",
  "New Project": "New Project",
  "Apply an action to multiple issues": "Apply an action to multiple issues",
  "mkplc_invalid_ccards": "Invalid Credit Cards",
  "auth_remember_me_label": "Keep me logged in for 2 weeks",
  "Archive All Projects": "Archive All Projects",
  "Widgets to see them all instantly": "Widgets to see them all instantly",
  "invoices_freshbook_api_msg": "To get your API URL and Auth Token please follow %s these instructions%s.",
  "Click here for download": "Click here for download",
  "custom_pass_req": "Custom password requirements and rotation policies",
  "it_prefix": "Prefix",
  "leave_reason_storage": "Free %s storage plan is too little",
  "rangeByOccurrences1Human": "ends after",
  "c_back": "Back",
  "time_no_entries_general": "There are no time entries.",
  "c_number": "Number",
  "tasks_priority_none": "None",
  "to_navigate_between_applications": "to navigate between applications",
  "thank_you_success_issue_tracker": "Thank you. Your submission is successful. We will review it at our earliest convenience.",
  "View Read Notifications": "Switch to read updates",
  "leave_reason_better_asana": "Asana",
  "All milestones": "All milestones",
  "Widget Project Group": "Widget Project Group",
  "invoices_forward_invoice": "Forward Invoice",
  "rangeNoEnd": "Never",
  "logs_wiki_10": "{{user_full_name}} delete comment in wiki {{title}}.",
  "disc_add_discussion_title": "Add Discussion",
  "Free!": "Free!",
  "crm_edit_contact": "Edit Contact",
  "it_back_to_issues": "Back To Issues",
  "tasks_add_subtask_title": "Add Subtask",
  "Actions": "Actions",
  "Your current plan": "Your current plan",
  "reports_no_access": "You don't have access to reports!",
  "create_new_issue": "To create a new issue - %s etc.",
  "manage_clone_project_switch_to_forward": "%sSwitch %s to plan new project forward",
  "crm_sidebar_tasks_btn": "Tasks",
  "c_save_discussion": "Save Discussion",
  "rangeByEndDateHuman": "ends on",
  "weeklyWeekdaysHuman": "on:",
  "tasks_import_tpl_pr_gr_title": "Project Group",
  "leave_want_updates_emails_label": "Would you be interested to keep in touch for important Freedcamp updates (twice a year)?",
  "Remove Report": "Remove Report",
  "days_workdays_full_tmpl": "Duration - %d calendar and %d working days",
  "dedicated_manager_on_calls": "Dedicated Success Manager with on-call sessions to ensure you reach your goals with Freedcamp",
  "crm_contacts_social_badoo": "Badoo",
  "Edit other user comment": "Edit other user comment",
  "files_root_folder_name": "Files",
  "Enter Coupon": "Enter Coupon",
  "gt_added_users_title": "These users will be added to the project",
  "weekly_backups": "Weekly data backups",
  "Completed Tasks": "Completed Tasks",
  "Our supporters": "Our supporters",
  "Manage notification subscriptions for own issue": "Manage notification subscriptions for own issue",
  "passman_no_active_group_msg": "Contact the project owner - this application should have at least one active Password list.",
  "shift_select_one_progress": "Please select at least one Progress.",
  "c_item_calendar_title_plural": "Calendar events",
  "help_forgot_password": "Forgot Password isn't working",
  "Kickstarter support privacy options.": "Kickstarter supporter privacy options.",
  "are_you_sure_del_mile": "Are you sure you whant delete milestone \"%s\" ?",
  "it_issue_status": "Issue Progress",
  "tasks_progress_completed": "Completed",
  "files_folder_add_popup_title": "Add Folder",
  "help_android": "Android",
  "mkplc_bkp_data": "Backup Your Data",
  "tasks_task_title_plural": "Tasks",
  "tasks_import_tpl_due_date_descr": "Format YYYY-MM-DD",
  "upsell_tasks_email_in": "Create new tasks, discussions or upload files by emailing them to Freedcamp",
  "it_prefix_length_max": "Prefix (4 symbols max)",
  "mile_view_archived": "View Archived Milestones",
  "the main view of the invoicing application": "the main view of the invoicing application",
  "Copy / Move a task with subtasks": "Copy / Move a task with subtasks",
  "mkplc_coupon_not_found": "Specified coupon not found!",
  "Collapse projects": "Collapse projects",
  "disc_posted_by_title": "Posted By",
  "tasks_subtask_title": "Subtask",
  "This Milestone is linked to 1 Task": "This Milestone is linked to 1 Task",
  "Storage Plan Update": "Storage Plan Update",
  "c_submit_low": "submit",
  "is_natural_no_zero": "The %s field must contain a number greater than zero.",
  "help_2fa_title": "Two Factor Authentication (2FA)",
  "daily_recap_past_due": "overdue",
  "%d calendars successfully refreshed.": "%d calendars successfully refreshed.",
  "You do not have active projects to apply subscription": "You do not have active projects to apply subscription, so please create at least one project first",
  "Back": "Back",
  "auth_terms_link_agree_1": "I agree to the",
  "auth_reset_explanation_2": "reset password more than one time always use instructions from the last email.",
  "upload_google_drive": "Google Drive",
  "auth_session_expired": "Session expired.",
  "updates_page_title": "What's New",
  "Add Comment to num Selected Issues": "Add Comment to {num} Selected Issues",
  "Projects You Are Group Admin": "Projects You Are Group Admin",
  "mile_with_%d_files_plural": "with %d files",
  "profile_calendars_page": "You can access all available Calendar Links %s",
  "Timezone": "Timezone",
  "cf_confirm_msg_pr": "Are you sure you want to unlink this Custom Field Template from the project?",
  "crm_import_wrong_file_format": "Wrong file format!",
  "gt_removed_users_title": "These users will be removed from the project because they are removed from the team",
  "crm_campaign_profit_err": "The %s field must be number between 1 and 100",
  "Add Member": "Add Member",
  "invoices_download_pdf": "Download as PDF",
  "Set Business Hours": "Set Business Hours",
  "Please enter code": "Please enter code",
  "tracy_expl": "Uses Freedcamp mostly to “keep her complicated life on track.”",
  "tasks_completed_on": "completed on",
  "it_reported_by_me": "Reported by me",
  "Recap email": "Recap email",
  "bugtracker_with_wikis_app": "Issue Tracker and Wikis applications",
  "logs_bugtracker_0": "action has been performed in Issue Tracker.",
  "files_filter_many": "many",
  "upgrade_lite_hide": "Do not show show this again for 30 days",
  "invoices_rate": "Rate",
  "daily_digest_info": "All updates in your system in a single daily email, which can be quite overwhelming",
  "daily_ass_to_everyone": "Assigned to Everyone",
  "Time": "Time",
  "c_user_on_date": "%s <span class=\"assigned_date\"> on %s</span>",
  "auth_cant_accept_own_invite": "You can't accept an invitation you sent.",
  "c_assign_past": "Assigned",
  "passman_add_new_group": "Add a new Password list",
  "Sync to Google Calendar": "Sync to Google Calendar",
  "logs_files_10": "{{user_full_name}} deleted comment in file {{name}}.",
  "cal_we": "We",
  "email_access_removed_sync_again": "Please go to Freedcamp and enable GSync again, if needed.",
  "logs_time_12": "time task {{description}} has been reset.",
  "auth_request_key_2": "another reset key",
  "Showing archived projects.": "Showing archived projects.",
  "alpha_numeric": "The %s field may only contain alpha-numeric characters.",
  "Can only edit/delete tasks, comments, and other items created by them.": "Can only edit/delete tasks, comments, and other items created by them.",
  "crm_custom_fields_expl": "These fields will extend Contact form in CRM",
  "addons_sing": "Add-on",
  "mkplc_trial_exp_today": "Trial expires today.",
  "alpha": "The %s field may only contain alphabetical characters.",
  "c_choose": "Choose",
  "Archiving last project": "Archiving last project",
  "Edit other user task": "Edit other user task",
  "Delete Team from Project": "Delete Team from Project",
  "email_in_supported_val": "Supported values are %s and %s.",
  "tax_invoice": "Tax invoice",
  "help_macos_windows": "MacOS &amp; Windows ",
  "disc_unsticky_lnk_title": "unsticky",
  "Contact site Help Desk": "Contact %s Help Desk",
  "cal_when": "When",
  "files_filter_modified_date_title": "Last Modified",
  "Only owner of this group can do this action": "Only owner of this group can do this action",
  "Track is you go": "Track time as you go",
  "c_hour_singular": "hour",
  "unarchive": "unarchive",
  "crm_contacts_lead_cat_opportunity": "Opportunity",
  "Home": "Home",
  "Time worked, desc": "Time worked, desc",
  "Comment_plural": "Comments",
  "daily_recap_overdue_to_start": "overdue to start",
  "browser_asking_allow": "The browser is asking you about accessing the webcam.<br>Please allow the browser to use it!",
  "mkplc_next_paym_date": "next payment %s.",
  "You have no groups. Please, add some to use this widget.": "You have no groups. Please, add some to use this widget.",
  "help_students_and_orgs": "For Students and Organizations %s(9min)%s",
  "Save Settings": "Save Settings",
  "Monthly Billing": "Monthly Billing",
  "Business trial started!": "Business trial started!",
  "Choose Projects": "Choose Projects",
  "npo_q": "Do you offer special pricing for NPOs and Education?",
  "logs_bugtracker_10": "{{user_full_name}} deleted comment in issue {{title}}",
  "Close": "Close",
  "c_warning": "Warning",
  "card_ending_and_expir": "%s ending in %s and %s/%s expiry",
  "mkplc_more_information": "More Information",
  "it_issue_probably_deleted": "This issue was probably deleted by another user, please refresh page.",
  "copy_move_task_list_title": "Copy or Move task list: %s",
  "allison_place": "Allison, Colorado, USA",
  "c_item_crm_items_title_plural": "CRM Items",
  "Make this project available to anyone": "Make this project available to anyone",
  "files_go_to_folder_title": "Go to ...",
  "time_mark_completed_success_msg": "All filtered Time Records were marked as completed successfully!",
  "manage_get_more_apps_short_link_title": "Get More Apps",
  "tasks_remove_assignment": "Remove Assignment",
  "files_version_title": "Version",
  "Export all projects": "Export all projects",
  "Notifications": "Notifications",
  "Other items notifications": "Other items notifications",
  "it_no_perm_to_edit_prefix_msg": "You have no permissions to edit the prefix.",
  "logs_discussions_3": "Discussion {{name}} has been deleted.",
  "Calendar out of sync. Click for more info.": "Calendar out of sync. Click for more info.",
  "You have no permissions to add event": "You have no permissions to add an event.",
  "help_moving_project_to_group": "Moving a Project to Another Group",
  "Too long name": "Too long name",
  "this_info_for_billing_invoices": "This information will be included on all billing invoices on your team account.",
  "Action history and updates": "Action history and updates",
  "auth_password_changed": "Password changed!",
  "crm_calls_on_call_title": "On Call",
  "mile_show_completed_link_title": "Show Completed",
  "You have 1 unread notification": "You have one unread notification.",
  "No projects in this group": "No projects in this group",
  "yearly_invoice_for_plan": "yearly invoice for the <b>%s</b>",
  "leave_gr_site_slow": "Site was too slow or sluggish (1 is Super slow and 10 is Just not fast enough)",
  "gdrive_integration": "Google Drive Integration",
  "daily_recap_overdue_to_complete": "overdue to complete",
  "tasks_task_title": "Task",
  "Old Password is incorrect": "Old Password is incorrect",
  "Manage notification subscriptions for other user issue for other users": "Manage notification subscriptions for other user issue for other users",
  "pending": "pending",
  "Default Home Page": "Default Home Page",
  "SAML-based single sign-on (SSO)": "SAML-based single sign-on (SSO)",
  "Please contact a project owner": "Please contact a project owner",
  "Users": "Users",
  "invoices_postal_zip_title": "Postal/Zip",
  "Med": "Med",
  "invoices_po_number": "PO Number",
  "logs_wiki_9_notify": "{{user_full_name}} said:</b> {{comment_description}}",
  "Score details": "Score details",
  "Want to see it in action before signing in?": "Want to see it in action before signing in?",
  "time_no_perm_to_start": "You have no permissions to start recording time for this time record.",
  "email_in_disabled": "Email In is <b>disabled</b>",
  "passwords_do_not_match": "The new password and confirmation password do not match",
  "invoices_paid_invoices": "Paid Invoices",
  "archive": "archive",
  "rsvp_guests": "Guests",
  "Subtasks Pro": "Subtasks Pro",
  "mile_filter_user_created_title": "Created By",
  "c_bottom": "Bottom",
  "leave_reason_better_clickup": "ClickUp",
  "Line %d, cloumn %s (%s): The Task row should be above the Subtask row": "Line %d, column %s (%s): The Task row should be above the Subtask row",
  "no_tags_applied_msg": "You don't have any tags applied",
  "View Contact Info": "View Contact Info",
  "Regenerate": "Regenerate",
  "mile_mile_update_success_msg": "You have successfully updated the milestone!",
  "passman_import_required_note": "Password List, Title and Password are required fields!",
  "Online Edit": "Online Edit",
  "Minimalist": "Minimalist",
  "Date added, asc": "Date added, asc",
  "search project": "search project",
  "empower_people": "We empower people to work together",
  "crm_import_empty_name_found": "Lines with empty First or Last Name were not imported.",
  "Collapse groups": "Collapse groups",
  "OK": "OK",
  "mkplc_app_comments_staff_ttl": "Freedcamp<br>Team",
  "Delete other user milestone": "Delete other user milestone",
  "logs_files_2": "file {{name}} has been edited.",
  "All wikis": "All wikis",
  "feature_subtasks_desc": "Successful task management involves splitting larger tasks into smaller subtasks",
  "Reason For Cancelling the Module": "Reason For Cancelling the Module",
  "crm_contacts_social_facebook": "Facebook",
  "manage_group_no_users": "No users to select",
  "monthlyOnTheHuman": "on the",
  "plan_disc_goals_socceed": "Plan. Discuss. Achieve Goals. Succeed.",
  "Create a project": "Create a project",
  "c_file_embed_thumb_title": "Thumb",
  "joined earlier": "joined earlier",
  "rsvp_accepted": "Accepted",
  "crm_complete_task_restart": "Restart Task",
  "cft_is_field_required": "Field Required",
  "You cannot delete a Team which contains Global Teams. Please remove Global Teams first.": "You cannot delete a Team which contains Global Teams. Please remove Global Teams first.",
  "before": "before",
  "crm_edit_lead": "Edit Lead",
  "manage_drag_to_invite_1": "Drag here to add, or",
  "mile_due_date_label": "Due %s",
  "First and Last Name": "First and Last Name",
  "this_user_is_not_part_of_project": "This user is no longer part of this project.",
  "Name (optional)": "Name (optional)",
  "files_filter_gdrive": "Google Drive",
  "logs_time_7": "time task {{description}} has been stopped.",
  "Request can not be processed, please try again": "Request can not be processed, please try again",
  "overview_short_descr": "See the project's details and recap. Access project's users and their profiles.",
  "change_role_globally_confirm_projects": "List of projects in which user's role will be changed to %s",
  "help_widgets_board": "Widgets Board",
  "global_invitations_first_step_desc": "Add your team members to the mothership! Achieve your goals of world domination together.",
  "Invalid email.": "Invalid email.",
  "Project Group Admins": "Project Group Admins",
  "Wiki has been successfully added": "Wiki has been successfully added.",
  "Get notifications": "Get notifications",
  "mkplc_app_renew_failed": "Renewal for this application has failed.",
  "paym_provider_offline": "We’re sorry. Our payment provider is undergoing maintenance. We will be back momentarily",
  "Add your personal message (optional)": "Add your personal message (optional)",
  "invoices_outstanding": "OUTSTANDING",
  "logs_todos_3": "{{entity_title}} {{description}} has been deleted.",
  "request_access_title": "Join public project",
  "dedicated_session": "Dedicated onboarding session",
  "rtpl_yearly": "Yearly",
  "Remove link": "Remove link",
  "Twitter": "Twitter",
  "Organization": "Organization",
  "seems_item_deleted_msg": "Most likely this item was deleted by another user.",
  "crm_tasks_calendar_visibility": "CRM tasks will show up on %sCalendar Board%s.",
  "crm_tasks_type_meeting": "Meeting",
  "remove_from_project_button": "Remove From This Project",
  "c_add_new": "Add New",
  "Installed": "Installed",
  "sso_requires_wl_msg": "You need to set up and enable White Label in order to use SSO.",
  "less than 100": "less than 100",
  "Bulk upload and descriptions": "Bulk upload and descriptions",
  "Create Calendar Link": "Create Calendar Link",
  "Spaces": "Spaces",
  "Set a project public, allow to apply and manage applicants": "Set a project public, allow to apply and manage applicants",
  "mkplc_app_subscr_updated": "You've successfully updated subscription for the application.",
  "%d days overdue": "%d days overdue",
  "Remove user from group admins": "Remove user from group admins",
  "no_pro_create_new_or_clone": "There are no projects. Create a %s new project %s or use an existing one %s as a template%s.",
  "Line %d, cloumn %s (%s): %scan be only Task or Subtask": "Line %d, column %s (%s): '%s' - can be only Task or Subtask",
  "oldest update": "oldest update",
  "files_download_zip_limit_paid": "%s on paid plans",
  "bypeople_campaign_title": "Limited Lite Plan Offer for just $49 / 2 Years.",
  "Assigned To Me": "Assigned To Me",
  "c_none": "none",
  "invoices_qty_time": "Qty/Time",
  "Due in %d day": "Due in %d day",
  "current_period_active_user": "Current billing month (%s - %s) active user - %d.",
  "Delete Completed Time Records": "Delete Completed Time Records",
  "Click Enter to invite": "Click Enter to invite",
  "new_version_hint": "New (most recent) version will be created with this version's content",
  "cal_october": "October",
  "to_toggle_quick_picker": "to toggle quick project picker",
  "it_no_perm_to_change_progress_msg": "You have no permissions to change progress for this issue.",
  "cal_tuesday": "Tuesday",
  "The following projects owned by you will be also deleted": "The following projects owned by you will be also deleted",
  "unlink": "unlink",
  "Update Billing": "Update Billing",
  "c_app_files": "Files",
  "change_role_globally_new_role": "New Role",
  "cal_feb": "Feb",
  "passman_more_info": "More Info",
  "Shift dates": "Shift dates",
  "Security controls and attached images": "Security controls and attached images",
  "get_prem_addons": "Get Premium Add-ons",
  "invoices_client_del_success_msg": "Client deleted successfully!",
  "unlimited_storage_with": "Unlimited storage with up to %s file size limit",
  "no_provider_email_us_str": "If your carrier supports email to SMS gateway service - please %s1 email us%s2 to get it listed!",
  "files_no_files_try_root_part4_instead_word": "instead.",
  "backup_plan_descr_4": "Only need one backup? You will get notified by email within 24h",
  "activation_email_successful": "Activation Email Sent",
  "manage_marketplace_reminder_2": "in our Marketplace",
  "Subscription Detail": "Subscription Detail",
  "Tomorrow": "Tomorrow",
  "no_syncs_with_gsync": "You haven't created any calendar links or instant Google Calendar synchronizations yet.",
  "crm_campaign_end_date_title": "End Date",
  "c_hour_plural": "hours",
  "c_company": "Company",
  "No subscriptions found to update their billing info! Only personal details updated": "No subscriptions found to update their billing info! Only personal details updated",
  "recurr_first_due_date": "the first task due date",
  "tasks_import_popup_title": "Import from xls file",
  "This email is already registered.": "This email is already registered.",
  "Check latest updates": "Check latest updates",
  "files_file_title": "File",
  "help_tips_box_link": "Learn more",
  "Manage notification subscriptions for other user discussion for other users": "Manage notification subscriptions for other user discussion for other users",
  "Manage item groups": "Manage item groups",
  "Priority, asc": "Priority, asc",
  "Change Status": "Change Status",
  "files_delete_error_msg": "Error while deleting file with id %d",
  "Issues": "Issues",
  "Day": "Day",
  "disc_title_title": "Title",
  "use_ctrl_s_to_save": "You can also use CTRL + S to save changes.",
  "files_filter_comments_title": "Comments",
  "Sam": "Sam",
  "crm_tasks_delete_success_msg": "Task deleted successfully!",
  "Dashboard": "Projects Board",
  "Add task": "Add task",
  "crm_contacts_phone_office": "Office",
  "c_search_replace_message": "Do you want to replace existing saved search '%s' with changes you have made?",
  "Manage user projects": "Manage user projects",
  "passman_only_can_apply_action": "Only group owner and administrators can apply this action!",
  "Company Name": "Company Name",
  "disc_commented_by": "Last Comment By",
  "Only group members can delete the file.": "Only group members can delete the file.",
  "c_total": "Total",
  "No comments yet! Be the first to leave one.": "No comments yet! Be the first to leave one.",
  "invoices_note": "Note",
  "between": "between",
  "no_responded_items": "There are no items you've responded to",
  "mkplc_bkp_canceled": "You've successfully cancelled backup subscription.",
  "have_active_sub": "You have active subscriptions for:",
  "Filter users": "Filter users",
  "Check all": "Check all",
  "notif_level_full": "Full",
  "help_project_templates_app_title": "Project Templates",
  "You can only unlink Tasks and Milestones you created.": "You can only unlink Tasks and Milestones you created.",
  "orderIndexes_2": "second",
  "auth_forgot_passw_label": "Forgot Password?",
  "Quick Add User": "Quick Add User",
  "logs_time_3": "time entry {{description}} has been deleted.",
  "Move folder": "Move folder",
  "add date": "add date",
  "upgrade_lite_check_more_lite": "Check other awesome Lite plan upgrades",
  "tasks_back_to_tasks": "Back To Tasks",
  "Reset to show groups and projects alphabeticaly": "Reset to show groups and projects alphabetically",
  "cal_change_progress": "Change progress status",
  "files_filter_location_title": "Location",
  "upsell_tasks_email": "Quickly create a brand new task by sending an email",
  "Delete own task": "Delete own task",
  "add_field_in_template": "Add New Field",
  "Install": "Install",
  "auth_register_title": "Sign Up",
  "c_tag_item": "Tag",
  "mile_progress_completed": "Completed",
  "required": "The %s field is required.",
  "Marketplace": "Marketplace",
  "Versions": "Versions",
  "crm_contacts_export_header": "Export Contacts",
  "rsvp_all_in_series": " All events in this series",
  "rsvp_use_btns": "Use RSVP buttons to see the event time in your time zone (detected from your computer time)",
  "upgrade_lite_check_other_offers": "Check other Freedcamp offers.",
  "Shift subtasks": "Shift subtasks",
  "it_no_perm_to_delete_issue_plural_tmpl": "You have no permissions to delete issues %s.",
  "c_export_xls": "Export XLS",
  "leave_reason_other_account": "I have another Freedcamp account",
  "auth_login_title": "Login",
  "Thumbnails view": "Thumbnails view",
  "manage_projects_hint": "Manage projects by selecting them in the left panel",
  "crm_contacts_lead_cat_new": "New",
  "mkplc_phone_num": "Phone Number",
  "Projects Group has been deleted": "Projects Group has been deleted",
  "mkplc_trial_exp_in_one_day": "Trial expires in 1 day.",
  "time_all": "All",
  "files_upload_btn_title": "Upload",
  "Timers": "Timers",
  "Created By Me": "Created By Me",
  "files_selected_delete_success_msg": "Successfully deleted selected entries.",
  "Due date, desc": "Due date, desc",
  "Name on Card": "Name on Card",
  "get_startes_app_addons_page": "Get started by installing some Group Applications from our %s Add-ons page %s!",
  "uploaded_by_file_editor": "Your file uploaded to Freedcamp via FileEdit was saved.",
  "Welcome to Freedcamp": "Welcome to Freedcamp",
  "Click to add new Item": "Click to add new Item",
  "Projects order has been successfully reset!": "Projects order has been successfully reset!",
  "mkplc_already_subscribed": "You are already subscribed to this application.",
  "c_oldest": "oldest",
  "mkplc_files_app_warning": "Added to each project by default and can not be removed.",
  "Only group owner can upload logo!": "Only group owner can upload logo!",
  "The Title field is required.": "The Title field is required.",
  "pls_enter_vrf_code": "Please, Enter Verification Code",
  "passman_edit_password": "Edit Password",
  "disc_manage_groups_title": "Manage Discussion Lists",
  "See all": "See all",
  "Upgrade to paid plan to get access": "Upgrade to %spaid plan%s to get access.",
  "disc_back_to_active_groups": "Back To Active Lists",
  "Annual": "Annual",
  "wiki_view_active_link_title": "View Active Wiki Lists",
  "mile_hide_completed_link_title": "Hide Completed",
  "help_wiki_ftg": "Freedcamp Translation Guidelines (FTG)",
  "weeklyWeekdays": "Repeat on",
  "2fa_disabled_due_to_sso": "Two-Factor Authentication is disabled. Your team uses company SSO.",
  "All Updates": "All Updates",
  "Learn more about applications": "Learn more about applications",
  "tasks_import_wrong_file_format_msg": "Wrong file format!",
  "disc_no_perm_group_order": "You have no permissions to change list order.",
  "c_comment_url_copied": "Comment link copied to clipboard.",
  "files_items_not_moved_msg": "Some items (%d) were not moved (not found or you have no permissions to move).",
  "Please type new project name": "Please type new project name",
  "CVV": "CVV",
  "tasks_drag_here_part2_in_progress": "to set it in progress",
  "You have declined to join this project.": "You have declined to join this project.",
  "cal_aug": "Aug",
  "Canceled on": "Canceled on",
  "disc_no_groups_msg": "Hey, you gotta create a List first to hold all those important Discussions.",
  "c_remember_me": "Remember me",
  "You can not decline not yours invitation.": "You can't decline not your invitations.",
  "help_reorder_projects_and_groups": "How to reorder projects and project groups",
  "passman_link": "Link",
  "Freedcamp is over capacity.": "Freedcamp is over capacity.",
  "tasks_completed_date": "Completed date",
  "auth_email_input_placeholder": "E-Mail or Username",
  "mkplc_manage_storage_title": "Manage storage",
  "c_completed_today": "completed today",
  "logs_discussions_13": "{{user_full_name}} updated comment in discussion {{name}}",
  "Reason For Cancelling the Backup": "Reason For Cancelling the Backup",
  "auth_attempts_timeout_v2": "You have reached maximum login attempts. Please retry after several minutes or reset your password.",
  "Upload new version for the own file": "Upload new version for the own file",
  "Receive Text Message Notifications": "Receive Text Message Notifications",
  "crm_contacts_social_bebo": "Bebo",
  "deactivate_successful": "Account De-Activated",
  "active_user_plural": "active users",
  "Unlimited Users": "Unlimited Users",
  "Manage discussion groups": "Manage discussion groups",
  "backup_plan_3": "Monthly Backups",
  "Renew Subscription": "Renew Subscription",
  "sub_added_succ": "Subscription added successfuly!",
  "logs_wiki_19_notify": "{{user_full_name}} added wiki version.",
  "we_have_got_your_back": "We've got your back!",
  "Invitation message": "Invitation message",
  "c_now": "Now",
  "tos_q": "Where can I find your Terms of Service (TOS)?",
  "crm_contacts_social_flickr": "Flickr",
  "Brief Explanation of the project purpose": "Brief Explanation of the project purpose",
  "crm_contacts_social_delicious": "Delicious",
  "Things I Follow": "Things I Follow",
  "Add Items": "Add Items",
  "passman_want_to_encrypt_plural": "Do you really want to encrypt %d passwords with the Master Password?",
  "crm_sidebar_upcoming_tasks_header": "Upcoming tasks",
  "Manage Global Teams": "Manage Global Teams",
  "logs_calendar_3": "RSVP response added to the calendar event {{title}}.",
  "c_low": "Low",
  "noEndAfterNOccurrences": "The After N occurrences field must be between 1 and ",
  "shift_dates_title": "Shift task dates in task list \"%s\"",
  "invoices_add_payment_title": "Add Payment",
  "files_fileedit_placeholder": "Please describe your change (optional)",
  "manage_clone_project_people_keep_opt": "Keep all people assigned and subscribed",
  "c_search_replace_public_to_private": "Do you want to replace existing public saved search '%s' and make it private?",
  "select_one_date_shift": "Please select at least one date to shift.",
  "This email is already registered. Login %s here %s!": "This email is already registered. Login %s here %s!",
  "help_search_work": "How Search works in Freedcamp",
  "Edit other user discussion": "Edit other user discussion",
  "cal_tu": "Tu",
  "c_file_embed_label": "Insert image into text as",
  "mkplc_already_subscr_plan": "You are already subscribed to the plan: %s",
  "seems_item_deleted_no_comment": "Seems application item was deleted, so comment can't be added to it!",
  "onboarding_pricing_page": "You can start any premium plan trial later on our %s",
  "leave_delete_done": "Your account is now deleted",
  "upload_dropbox": "Dropbox",
  "sorted by %s from %s to %s": "sorted by %s from %s to %s",
  "auth_email_advice": "Did you mean",
  "All of these great features:": "All of these great features:",
  "logs_time_14_notify": "{{user_full_name}} unbilled time entry.",
  "c_step": "Step",
  "recap_daily_opt": "Daily (except Sat & Sun)",
  "We have all the tools you need to be successful in once place.": "We have all the tools you need to be successful in one place.",
  "No users to share with": "No users to share with",
  "Select Group": "Select Group",
  "wall_comment_placeholder": "enter comment...",
  "passman_invalid_group_msg": "Invalid password list!",
  "cal_date_to": "Date To",
  "Please enter a valid date": "Please enter a valid date",
  "disc_create_active_group_msg": "Please create at least one more active Discussion list first.",
  "export_all_as_csv": "Export all as CSV",
  "crm_contacts_export_vcard": "Export all contacts as vcard",
  "Only Group Admin can do this action": "Only Group Admin can do this action",
  "crm_contacts_lead_cat_rejected": "Rejected",
  "mkplc_item_type_group_app": "Group Application",
  "Field is required": "Field is required",
  "History": "History",
  "invoices_add_new_entry": "add new entry",
  "disc_disc_title_plural": "Discussions",
  "Apply multiple fields with Custom Fields templates easily": "Apply multiple fields with Custom Fields templates easily",
  "crm_contacts_social_google+": "Google+",
  "Choose Color": "Choose Color",
  "manage_files_app_hint": "Added to each project by default \nand can not be removed.",
  "Remove global team from project": "Remove global team from project",
  "tasks_no_perm_del_group": "You have no permissions to delete this list.",
  "Public project link": "Public project link",
  "mile_export_tasks_advice_msg": "To export Milestones and Tasks included in them please use Tasks export",
  "New Task List": "New Task List",
  "Show All": "Show All",
  "Spread the word": "Spread the word",
  "c_favorites": "Favorites",
  "crm_tasks_type_call": "Call",
  "crm_contacts_lname_title": "Last name",
  "All Discussions": "All Discussions",
  "email_subject_calendars_out_of_sync": "Google calendars are out of sync - all calendars are marked as inactive in Freedcamp",
  "c_copy": "Copy",
  "tasks_invite_more_people": "Invite More People",
  "The Password field is required.": "The Password field is required.",
  "cancel_trial_q": "Cancel the %s Plan free trial?",
  "Into Task List": "Into Task List",
  "cal_mayl": "May",
  "rtpl_daily": "Daily",
  "crm_campaign_add_result_header": "Add Result",
  "The Calendar": "The Calendar",
  "Standard": "Standard",
  "tasks_start_btn_title": "Start Progress",
  "c_yesterday": "Yesterday",
  "c_add_some": "Add Some",
  "c_username": "Username",
  "c_page_unsaved_data_msg": "Are you sure you want to leave the page? You have unsaved data.",
  "auth_request_key_on_account_2": "My Account page",
  "request_access_hint": "If your request is accepted by a project manager you will be notified by email.",
  "All Applications": "All Applications",
  "language request": "language request",
  "switch_to_monthly": "%sswitch to monthly%s",
  "Subscribe": "Subscribe",
  "group_unarchive_project_question": "Are you sure you want to unarchive all group projects?",
  "help_global_boards": "Your default page and global boards",
  "recurr_next_is_deleted": "The next occurrence was deleted",
  "Continue": "Continue",
  "Tutorials and Support": "Tutorials &amp; Support",
  "Enter Contact Info; address, phone etc.": "Enter Contact Info; address, phone etc.",
  "Keep me subscribed": "Keep me subscribed",
  "cmp_group_info_group_admin": "You are a group administrator in this group. You can create projects.",
  "time_widget_not_worked_title": "not worked yet",
  "Too long": "Too long",
  "Task successfully moved.": "Task successfully moved.",
  "Folder": "Folder",
  "Task Board": "Task Board",
  "add_info_for_billing_invoices": "Add information to be included on all billing invoices on your team account.",
  "tasks_add_task_title": "Add Task",
  "files_delete_success_msg": "File has been successfully deleted!",
  "Gantt Chart": "Gantt Chart",
  "crm_contacts_im": "IM",
  "Description": "Description",
  "Drafts": "Drafts",
  "Scroll to First Comment": "Scroll to First Comment",
  "Invite people!": "Invite people!",
  "time_delete_completed_time_task": "Are you sure you want to delete %d completed Time Record?",
  "files_no_perm_delete_folder": "You have no permissions to delete this folder.",
  "tasks_widget_no_tasks_msg": "There are no tasks matching your criteria.",
  "Unfollow Project": "Unfollow Project",
  "Adding a subtask": "Adding a subtask",
  "c_search": "Search",
  "plan_canceled": "<b>%s Plan</b> canceled",
  "addons_desc": "Add-ons - applications and modules",
  "files_file_title_plural": "Files",
  "time_total_spent": "Total Time Spent",
  "Some projects used in this widget were archived or deleted": "Some projects used in this widget were archived or deleted",
  "c_accept": "Accept",
  "logs_wiki_0": "action has been performed in wiki.",
  "files_filter_tiny": "tiny",
  "c_timezone_change": "Timezone Change",
  "Saved searches": "Saved searches",
  "mkplc_duplicate_req_err": "Something went wrong with your subscription. Please check Subscriptions page.",
  "To export active users in the previous period": "To export active users in the previous period (%s) %sclick here%s",
  "mkplc_item_type_app": "Application",
  "help_proj_group_admins_title": "Project Group Administrators",
  "files_filter_past": "past",
  "Go to freedcamp!": "Go to %s!",
  "mkplc_add_remove": "Add / Remove",
  "manage_archived_by_on": "%s on %s",
  "tasks_seems_task_deleted_msg": "Most likely this task was deleted by another user.",
  "manage_created_by_on": "%s on %s",
  "Free": "Free",
  "Unarchive All Projects": "Unarchive All Projects",
  "manage_unlink_google": "Your account has been successfully unlinked from Google",
  "recurr_ended": "ended",
  "Search files by name or type, preview, switch OneDrive accounts": "Search files by name or type, preview, switch OneDrive accounts",
  "Use %s as week start day": "Use %s as week start day",
  "used_million_people": "Used by more than a million people!",
  "Drop Down box creation with blank value": "Drop Down box creation with blank value",
  "mkplc_storage_added": "Your storage plan has been created.",
  "help_users_dont_see_project": "Users cannot see a project",
  "Take another Photo": "Take another Photo",
  "c_item_milestone_title": "Milestone",
  "Nobody invited yet.": "Nobody invited yet.",
  "Reduce yearly users": "Reduce yearly subscription users",
  "Privacy Policy": "Privacy Policy",
  "invoices_amount_title": "Amount",
  "Filtered": "Filtered",
  "Seems this item was deleted by other user.": "Seems this item was deleted by other user.",
  "Passwords Manager": "Passwords Manager",
  "auth_wrong_token": "Wrong token provided",
  "Shared file management": "Shared file management",
  "storage_plan_6": "Premium",
  "addons_welcome_text": "Extend the functionality of Freedcamp to suit your needs.",
  "cf_entered_value_plural": "entered values",
  "wiki_group_title": "Wiki List",
  "milestones_short_descr": "Work towards deadlines by adding multiple Tasks with one common date goal.",
  "crm_contacts_import_header": "Import Contacts",
  "Change assignment for own milestone": "Change assignment for own milestone",
  "Last Sync with": "Last Sync with",
  "Items you were mentioned in": "Items you were mentioned in",
  "Choose Backup Plan": "Choose Backup Plan",
  "gt_ignored_changes_title": "These users changes are ignored",
  "manage_resend_link_title": "Re-send",
  "valid_url": "The %s field must contain a valid URL.",
  "Wrong request registered": "Wrong request registered",
  "passman_seems_group_deleted_msg": "This list was probably deleted by another user.",
  "Additional billing contact": "Additional billing contact",
  "group_has_no_project": "This project group has no projects",
  "auth_reset_explanation_3_upd": "Unsure which email you used for your %s account? Contact %s.",
  "switched_to_plan_yearly": "Switched to the <b>%s Plan</b>, paying <b>yearly</b>",
  "Add a team": "Add a team",
  "cal_time_from": "Time From",
  "manage_add_team_link_title": "Add Team",
  "upsell_tasks_assign": "You can assign a subtask to a user, set a due date, and add unlimited levels",
  "mkplc_app_report_bug": "Report Bug",
  "limited_special_50_business": "Limited Time Special! 50% off our Business Plan",
  "backup_type_switching_note": "Note: switching will not convert already created backups to a new delivery method",
  "mile_add_milestone_btn_title": "Add Milestone",
  "Calendar syncs": "Calendar syncs",
  "mile_priority_medium": "Medium",
  "invoices_payment_history": "Payment History",
  "c_later": "later",
  "login_link": "Login",
  "manage_clone_project_keep_dates_no_opt": "No - Clear up all due dates",
  "logs_todos_15_notify": "{{user_full_name}} link {{entity_title}} to a Milestone.",
  "To duplicate a project you will need to create at least one project": "To duplicate a project you will need to create at least one project",
  "days_workdays_short_tmpl": "%dd/%dwd",
  "it_is_set": "Set",
  "cft_f_type_textarea": "Text Area",
  "sso_or_signup_with_email": "or Sign Up with email",
  "c_group_description": "List Description",
  "upsell_copy_move_cross_project": "Copy/Move tasks and task lists to another project",
  "c_filter_last_year": "Last Year",
  "Hi %s": "Hi %s",
  "help_subscription_and_billing_desc": "Any questions about your last invoice? Want to ask us before subscribing?",
  "Global Teams": "Global Teams",
  "upsell_tasks_safe_data": "All your data remains safe after trial ends. Resume subscription at any time",
  "you_have_credit_to_payments": "You currently have a credit of $%s to use against future payments.",
  "crm_campaign_edit": "Edit Campaign",
  "tasks_view_archived_groups": "View Archived Task Lists",
  "features_are_paid": "* these features are only available with our paid plans",
  "crm_contacts_referred_title": "Referred by",
  "Business": "Business",
  "tasks_no_subtasks_module_to_change_parent_v2": "This operation is not supported. Please subscribe to Subtasks add-on in Add-ons page to enable it.",
  "c_save": "Save",
  "c_me_filter_type_curr_user": "Make it work for all people in a project like it works for you",
  "current_period_active_user_plural": "Current billing month (%s - %s) active users - %d.",
  "logs_bugtracker_10_notify": "{{user_full_name}} deleted comment in issue.",
  "tasks_import_file_missed_msg": "File is missing!",
  "Notification Settings": "Notification Settings",
  "resync_completed": "Resync operation has been completed. Status for each calendar can be found in table below.",
  "crm_tasks_type_demo": "Demo",
  "c_date_completed": "Date Completed",
  "disc_private_only_you_hint": "Only visible to You",
  "You Own": "You Own",
  "logs_calendar_1_notify": "{{user_full_name}} added event.",
  "daily_recap_days": "days",
  "You have no permissions to delete this wiki": "You have no permissions to delete this wiki.",
  "Start Business Trial": "Start Business Trial",
  "Complete / Incomplete other user milestone": "Complete / Incomplete other user milestone",
  "logs_bugtracker_9_notify": "{{user_full_name}} said:</b> {{comment_description}}",
  "Select projects and users to add/remove access to %s": "Select projects and users to add/remove access to %s",
  "c_created_by": "Created By",
  "Entered date is in the past": "Entered date is in the past",
  "PDF version": "PDF version",
  "email_access_removed_resync": "In order to resync deactivated calendars, please visit <a href=\"%s\">your account page.</a>",
  "version_singular": "%d version",
  "cal_apr": "Apr",
  "invoices_number_used": "Number %s is already used",
  "c_file_delete_link_disabled_title": "You can delete attached files after saving.",
  "Score": "Score",
  "time_not_completed": "Not Completed",
  "addons_page": "Add-ons page",
  "help_discover_freedcamp": "Discover Freedcamp %s(1h with chapters)%s",
  "Requested page not found!": "Requested page not found!",
  "logs_milestones_2": "Milestone {{name}} has been edited.",
  "Enter invoice notes...": "Enter invoice notes...",
  "passman_common_err_msg": "Error has occured. Please refresh the page and retry, contact support at %s if no success.",
  "tasks_back_to_active_groups": "Back To Active Lists",
  "logs_todos_3_notify": "{{user_full_name}} deleted {{entity_title}}.",
  "dash_now_default_msg": "Dashboard is default page now",
  "Get the App": "Get the App",
  "Enable": "Enable",
  "Request": "Request",
  "c_app_copy_items": "Copy items",
  "disc_posted_on_title": "Posted On",
  "Backups example": "Backups example",
  "auth_social_connected_msg": "Your account will be connected with %s",
  "daily_recap_act_1": "Set a realistic goal - change start/end date",
  "manage_users": "manage apps & teams",
  "tracy_place": "Tracy, Kentucky, USA",
  "All links": "All links",
  "c_description": "Description",
  "shift_dates_hint_progress": "Only tasks and subtasks with selected Progress will be shifted",
  "unlimited_on_free": "Unlimited projects and storage",
  "tasks_conf_del_task_list_also": "Also delete task list if all tasks are completed.",
  "c_settings": "Settings",
  "Rename task": "Rename task",
  "Can add, edit and delete own comments as well as upload and download files.": "Can add, edit and delete own comments as well as upload and download files.",
  "mkplc_cancelation_reason": "Cancellation Reason",
  "Upload file": "Upload file",
  "help_modules_title": "Modules",
  "disc_changes_saved_msg": "Your changes were saved successfully!",
  "Best Value!": "Best Value!",
  "Delete Avatar": "Delete Avatar",
  "files_no_perm_feature": "Sorry, you have no access to this feature.",
  "you_pay_for_user_monthly_plural": "You pay for %d users monthly.",
  "logs_milestones_12": "Milestone {{name}} has been reset.",
  "c_filter_last_n_days": "Last %s Days",
  "alreadyAdded": "This date was already added",
  "cal_thu": "Thu",
  "mkplc_err_getting_app": "Error getting the application data",
  "download_desc_app": "Download desktop applications for Windows and Mac.",
  "Start / stop counter for other user task": "Start / stop counter for other user task",
  "we_transfer_many_projects": "We will transfer ownership of your projects and delete your account after completion.",
  "Delete own comment": "Delete own comment",
  "and ask to enable Email In for this project": "and ask to enable Email In for this project",
  "You can not accept an invitation you sent.": "You can't accept an invitation you sent.",
  "crm_item_type_call": "call",
  "Change due date for other user item": "Change due date for other user item",
  "archive_project_question": "Are you sure you want to archive this project?",
  "Project Group": "Project Group",
  "dash_proj_card_link_invite": "Invite More People",
  "disc_no_perm_to_unstick_disc": "You have no permissions to unstick this discussion.",
  "BLOG": "BLOG",
  "to check file format": "to check file format",
  "my_link": "Link",
  "tasks_unarchive_group": "Unarchive List",
  "Type ahead hints is on": "Type ahead hints is on",
  "storage_plan_11": "Premium - Yearly",
  "start_type_select_project": "Start typing to select project...",
  "dropbox_integration": "Dropbox integration",
  "remove_logo": "Remove logo",
  "files_folder_title": "Folder",
  "yearlyDayOfMonth1Human": "on",
  "See what we are up to and what has been launched.": "See what we are up to and what has been launched.",
  "manage_subscription_inactive_v2": "Subscription to this application is inactive,\nyou can renew it on the Add-ons page.",
  "hide people from archived projects": "hide people from archived projects",
  "help_questions_link_title": "Questions",
  "crm_calls_time_title": "Time",
  "c_soon": "soon",
  "Todos assigned to": "Todos assigned to",
  "Edit Item": "Edit Item",
  "help_contact_us_title": "Contact Us",
  "You can only link Tasks you created.": "You can only link Tasks you created.",
  "to_get_more_less_notifications": "To get more or less notifications from your projects visit %s My Account %s",
  "Hello": "Hello",
  "Credit Card Information": "Credit Card Information",
  "c_due_date": "Due Date",
  "Full Daily Recap": "Full Daily Recap",
  "mkplc_no_bkp_subscr": "You don't have a subscription for backup.",
  "Google Calendar Name": "Google Calendar Name",
  "tos_a": "You can find Freedcamp’s TOS online %shere %s",
  "c_today_low": "today",
  "invoices_collected": "COLLECTED",
  "update_successful": "Account Information Successfully Updated",
  "cal_thursday": "Thursday",
  "passman_validate_columns": "Line 1: Check column names - %s are required columns",
  "Receive SMS Notifications": "Receive SMS Notifications",
  "rsvp_invalid_emails": "Invalid emails",
  "Reset Filters": "Reset Filters",
  "Use Gmail Contacts": "Use Gmail Contacts",
  "custom_fields_title": "Templates",
  "reports_short_descr": "Generate beautiful Reports and see the progress of your projects and team members.",
  "it_type_cosmetics": "Cosmetics",
  "There are no milestones.": "There are no milestones.",
  "Important Updates": "Important Updates",
  "Added on": "Added on",
  "Group Applications and Marketplace": "Group Applications and Marketplace",
  "request_access_join_project_email": "Use your Freedcamp account email if you are a Freedcamp user",
  "crm_tasks_quick_add": "CRM Task has been successfully added. Click %s to view",
  "c_edit_list": "Edit List",
  "Invite user to all projects": "Invite user to all projects",
  "files_popup_descr_title": "Enter Description",
  "no_proj_to_backup": "There are no projects to backup at this moment. You can purchase now and create projects later",
  "Delete calendars": "Delete calendars",
  "Need Freedcamp for Work?": "Need Freedcamp for Work?",
  "Backups settings": "Backups settings",
  "billed monthly": "billed monthly",
  "delete_with_other_users_sub_task": "Delete own (sub)task even if it contains subtasks created by other users",
  "manage_back_to_tpl": "Back to %s",
  "logs_wiki_10_notify": "{{user_full_name}} deleted comment in wiki.",
  "time_completed_success_msg": "Time record has been completed! ",
  "All done!": "All done!",
  "Collapsed column with subtasks": "Collapsed column with subtasks",
  "anyone_can_create_items": "Anyone with the email can create items.",
  "crm_contacts_custom_fields_header": "Manage Custom fields",
  "Event": "Event",
  "monthly_invoice_for_plan": "monthly invoice for the <b>%s</b>",
  "c_name": "Name",
  "Select Country": "Select Country",
  "You requested to reduce subscription however it will be reduced to bigger": "You requested to reduce subscription to %d user(s) however it will be reduced to %d (%s).",
  "wiki_back_to_active_groups": "Back To Active Lists",
  "You have no permissions to add issue": "You have no permissions to add an issue.",
  "Free service? What is the catch?": "Free service? What is the catch?",
  "not_disclose_information": "I do not want to disclose this information",
  "invoices_file_size_warning": "If file is larger than %dpx by %dpx it will be resized.",
  "passman_export_csv": "Export CSV",
  "wiki_manage_groups_link_title": "Manage Wiki Lists",
  "You do not have any avatars.": "You don't have any avatars.",
  "project group owner": "project group owner",
  "tell_us_your_currency": "Please tell us the currency of your card",
  "files_no_perm_edit_file": "You have no permissions to edit this file.",
  "invoices_total": "Total",
  "monthlyInterval2": "month(s)",
  "help_email_msg_label": "Enter Message",
  "c_email": "Email",
  "tasks_reorder_lists": "Reorder Lists",
  "Week": "Week",
  "cal_february": "February",
  "manage_account_old_email": "Old Email",
  "Wiki version has been successfully reverted": "Wiki version has been successfully reverted.",
  "Notification settings have been successfully updated!": "Notification settings have been successfully updated!",
  "Toggle description": "Toggle description",
  "project_templates_short_descr": "Turn any project into a template and use templates to create new projects intelligently.",
  "help_backup": "Backup your data",
  "manage_clone_project_exist_latest_date_title": "Existing project latest due date is %EARL_DATE% for %ITEM_NAME%",
  "files_no_files_try_sub_part6_instead_word": "instead.",
  "This is a private wiki": "This is a private wiki!",
  "crm_contacts_phone_home": "Home",
  "recurr_next_occurrence_date": "next one",
  "You have no permissions to add version to this wiki": "You have no permissions to add version to this wiki.",
  "help_bookmark_favorites_title": "Bookmark your favorites pages",
  "Watch Basic and Advanced webinars": "Watch Basic and Advanced webinars",
  "time_no_perm_to_reactivate": "You have no permissions to reactivate this time record.",
  "Add your first comment": "Add your first comment",
  "auth_password_changed_now_login": "Password changed! You can now login.",
  "Pricing Page": "Pricing Page",
  "Tweet": "Tweet",
  "mile_mile_del_success_msg_with_tasks": "Milestone with %d tasks succesfully deleted.",
  "tasks_create_active_group_msg": "Please create at least one more active Task List first.",
  "no_times_to_mark_completed": "You don't have Time Records to mark as completed",
  "Hide Archived Projects": "Hide Archived Projects",
  "logs_files_2_notify": "{{user_full_name}} updated file.",
  "c_in_progress": "In Progress",
  "crm_view_back_calls_lnk": "Back To Calls",
  "Only you": "Only you",
  "mkplc_start_trial": "Start Free Trial",
  "crm_sidebar_dashboard_btn": "Dashboard",
  "Billable if upgraded": "Billable if upgraded",
  "select_yearly_billable_users": "Select yearly billable users",
  "Edit other user milestone": "Edit other user milestone",
  "crm_field_name_required_err": "Field name required",
  "it_no_perm_to_change_priority_msg": "You have no permissions to change this issue priority.",
  "Copy Public project link": "Copy Public project link",
  "reply": "reply",
  "crm_campaign_add": "Campaign",
  "Projects created": "Projects created",
  "Messaging board": "Messaging board",
  "wiki_view_archived_link_title": "View Archived Wiki Lists",
  "Select card currency": "Select card currency",
  "wiki_group_updated_msg": "Wiki list has been successfully updated!",
  "Add / edit versions for own wiki": "Add / edit versions for own wiki",
  "Create Wiki": "Create Wiki",
  "valid_ip": "The %s field must contain a valid IP.",
  "My Tasks": "My Tasks",
  "c_action_collapsed_activities_str": "Collapsed Activities",
  "manage_create_project_intermediate": "Intermediate",
  "tasks_not_started": "not started",
  "Add event": "Add event",
  "Complete / Incomplete own milestone": "Complete / Incomplete own milestone",
  "no_permissions_to_edit": "You don't have enough permissions to edit.",
  "Revert to prev version for own wiki": "Revert to prev version for own wiki",
  "Please apply some filters to save them!": "Please apply some filters to save them!",
  "it_issue_edit_success_msg": "Successfully edited!",
  "crm_campaign_status_started": "Started",
  "Enter description!": "Enter description!",
  "Enterprise": "Enterprise",
  "Details view (more coming soon here)": "Details view (more coming soon here)",
  "own_tags_header_title": "Tags in my projects (can delete)",
  "mile_archive": "Archive milestone",
  "crm_contacts_email_personal": "Personal",
  "Log Call": "Log Call",
  "Category": "Category",
  "c_filter_people": "Filter people",
  "Agenda view with a quick add popup": "Agenda view with a quick add popup",
  "auth_account_settings_title": "Account settings",
  "You have no access to requested backup.": "You have no access to requested backup.",
  "Description (optional)": "Description (optional)",
  "dash_no_projects_2": "add some",
  "passman_page_refreshed": "Page will be refreshed.",
  "Data Feed Link is regenerated now!": "Data Feed Link is regenerated now!",
  "Yearly": "Yearly",
  "c_date_created": "Date Created",
  "Dismiss": "Dismiss"
};
},{}],"src/sample.js":[function(require,module,exports) {
"use strict";

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _fkcompressor = _interopRequireDefault(require("./fkcompressor.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var json = require("./sample.json");

(0, _asyncToGenerator2.default)(
/*#__PURE__*/
_regenerator.default.mark(function _callee() {
  var Compressor;
  return _regenerator.default.wrap(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          Compressor = new _fkcompressor.default(); // Compressor.setBucket("KIT");

          _context.next = 3;
          return Compressor.set("test52", json);

        case 3:
          _context.t0 = console;
          _context.next = 6;
          return Compressor.get("test52");

        case 6:
          _context.t1 = _context.sent;

          _context.t0.warn.call(_context.t0, _context.t1);

        case 8:
        case "end":
          return _context.stop();
      }
    }
  }, _callee);
}))();
},{"@babel/runtime/regenerator":"node_modules/@babel/runtime/regenerator/index.js","@babel/runtime/helpers/asyncToGenerator":"node_modules/@babel/runtime/helpers/asyncToGenerator.js","./fkcompressor.js":"src/fkcompressor.js","./sample.json":"src/sample.json"}],"node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var checkedAssets, assetsToAccept;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "50743" + '/');

  ws.onmessage = function (event) {
    checkedAssets = {};
    assetsToAccept = [];
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      var handled = false;
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          var didAccept = hmrAcceptCheck(global.parcelRequire, asset.id);

          if (didAccept) {
            handled = true;
          }
        }
      }); // Enable HMR for CSS by default.

      handled = handled || data.assets.every(function (asset) {
        return asset.type === 'css' && asset.generated.js;
      });

      if (handled) {
        console.clear();
        data.assets.forEach(function (asset) {
          hmrApply(global.parcelRequire, asset);
        });
        assetsToAccept.forEach(function (v) {
          hmrAcceptRun(v[0], v[1]);
        });
      } else {
        window.location.reload();
      }
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAcceptCheck(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAcceptCheck(bundle.parent, id);
  }

  if (checkedAssets[id]) {
    return;
  }

  checkedAssets[id] = true;
  var cached = bundle.cache[id];
  assetsToAccept.push([bundle, id]);

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAcceptCheck(global.parcelRequire, id);
  });
}

function hmrAcceptRun(bundle, id) {
  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }
}
},{}]},{},["node_modules/parcel-bundler/src/builtins/hmr-runtime.js","src/sample.js"], null)
//# sourceMappingURL=/sample.b3b679b7.js.map