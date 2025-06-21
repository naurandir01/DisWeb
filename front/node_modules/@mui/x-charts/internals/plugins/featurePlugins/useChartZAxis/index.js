"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useChartZAxis: true
};
Object.defineProperty(exports, "useChartZAxis", {
  enumerable: true,
  get: function () {
    return _useChartZAxis.useChartZAxis;
  }
});
var _useChartZAxis = require("./useChartZAxis");
var _useChartZAxis2 = require("./useChartZAxis.selectors");
Object.keys(_useChartZAxis2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _useChartZAxis2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useChartZAxis2[key];
    }
  });
});