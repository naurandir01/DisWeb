"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  isDefaultizedBarSeries: true,
  isBarSeries: true
};
exports.isBarSeries = isBarSeries;
exports.isDefaultizedBarSeries = isDefaultizedBarSeries;
var _line = require("./line");
Object.keys(_line).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _line[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _line[key];
    }
  });
});
var _bar = require("./bar");
Object.keys(_bar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _bar[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _bar[key];
    }
  });
});
var _scatter = require("./scatter");
Object.keys(_scatter).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _scatter[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _scatter[key];
    }
  });
});
var _pie = require("./pie");
Object.keys(_pie).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _pie[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _pie[key];
    }
  });
});
var _radar = require("./radar");
Object.keys(_radar).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _radar[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _radar[key];
    }
  });
});
// Series definition

/**
 * @deprecated We do not use this type in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */

/**
 * @deprecated We do not use this type in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */

/**
 * @deprecated We do not use this type in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */

// item identifier

// Helpers

/**
 * @deprecated We do not use this function in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */
function isDefaultizedBarSeries(series) {
  return series.type === 'bar';
}

/**
 * @deprecated We do not use this function in v8. If it's useful for you use case, please open an issue explaining why.
 * Otherwise, it will be removed in next major.
 */
function isBarSeries(series) {
  return series.type === 'bar';
}