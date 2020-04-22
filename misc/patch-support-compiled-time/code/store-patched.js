"use strict";
exports.__esModule = true;
exports.store = void 0;
var _unistore = _interopRequireDefault(require("next/dist/compiled/unistore"));
var _stripAnsi = _interopRequireDefault(
  require("next/dist/compiled/strip-ansi")
);
var Log = _interopRequireWildcard(require("./log"));
var startDate = new Date();

function _getRequireWildcardCache() {
  if (typeof WeakMap !== "function") return null;
  var cache = new WeakMap();
  _getRequireWildcardCache = function () {
    return cache;
  };
  return cache;
}
function _interopRequireWildcard(obj) {
  if (obj && obj.__esModule) {
    return obj;
  }
  if (obj === null || (typeof obj !== "object" && typeof obj !== "function")) {
    return { default: obj };
  }
  var cache = _getRequireWildcardCache();
  if (cache && cache.has(obj)) {
    return cache.get(obj);
  }
  var newObj = {};
  var hasPropertyDescriptor =
    Object.defineProperty && Object.getOwnPropertyDescriptor;
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      var desc = hasPropertyDescriptor
        ? Object.getOwnPropertyDescriptor(obj, key)
        : null;
      if (desc && (desc.get || desc.set)) {
        Object.defineProperty(newObj, key, desc);
      } else {
        newObj[key] = obj[key];
      }
    }
  }
  newObj.default = obj;
  if (cache) {
    cache.set(obj, newObj);
  }
  return newObj;
}
function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}
const store = (0, _unistore.default)({ appUrl: null, bootstrap: true });
exports.store = store;
let lastStore = { appUrl: null, bootstrap: true };
function hasStoreChanged(nextStore) {
  if (
    [
      ...new Set([...Object.keys(lastStore), ...Object.keys(nextStore)]),
    ].every((key) => Object.is(lastStore[key], nextStore[key]))
  ) {
    return false;
  }
  lastStore = nextStore;
  return true;
}
store.subscribe((state) => {
  if (!hasStoreChanged(state)) {
    return;
  }
  if (state.bootstrap) {
    Log.wait("starting the development server ...");
    if (state.appUrl) {
      Log.info(`waiting on ${state.appUrl} ...`);
    }
    return;
  }
  if (state.loading) {
    startDate = new Date();
    Log.wait("compiling ...");
    return;
  }
  if (state.errors) {
    var endDate = new Date();
    var seconds = endDate.getTime() - startDate.getTime();

    Log.info("compiled time", seconds);
    Log.error(state.errors[0]);
    const cleanError = (0, _stripAnsi.default)(state.errors[0]);
    if (cleanError.indexOf("SyntaxError") > -1) {
      const matches = cleanError.match(/\[.*\]=/);
      if (matches) {
        for (const match of matches) {
          const prop = (match.split("]").shift() || "").substr(1);
          console.log(
            `AMP bind syntax [${prop}]='' is not supported in JSX, use 'data-amp-bind-${prop}' instead. https://err.sh/zeit/next.js/amp-bind-jsx-alt`
          );
        }
        return;
      }
    }
    return;
  }
  if (state.warnings) {
    Log.warn(state.warnings.join("\n\n"));
    if (state.appUrl) {
      Log.info(`ready on ${state.appUrl}`);
    }
    return;
  }
  if (state.typeChecking) {
    Log.info("bundled successfully, waiting for typecheck results...");
    return;
  }
  var endDate = new Date();
  var seconds = endDate.getTime() - startDate.getTime();

  Log.info("compiled time", seconds);

  Log.ready(
    "compiled successfully" +
      (state.appUrl ? ` - ready on ${state.appUrl}` : "")
  );
});
