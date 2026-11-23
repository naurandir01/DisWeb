"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useChartPolarAxis: true
};
Object.defineProperty(exports, "useChartPolarAxis", {
  enumerable: true,
  get: function () {
    return _useChartPolarAxis.useChartPolarAxis;
  }
});
var _useChartPolarAxis = require("./useChartPolarAxis");
var _useChartPolarAxis2 = require("./useChartPolarAxis.selectors");
Object.keys(_useChartPolarAxis2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _useChartPolarAxis2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useChartPolarAxis2[key];
    }
  });
});