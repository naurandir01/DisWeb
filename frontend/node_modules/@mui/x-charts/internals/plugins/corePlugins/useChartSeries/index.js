"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useChartSeries: true
};
Object.defineProperty(exports, "useChartSeries", {
  enumerable: true,
  get: function () {
    return _useChartSeries.useChartSeries;
  }
});
var _useChartSeries = require("./useChartSeries");
var _useChartSeries2 = require("./useChartSeries.selectors");
Object.keys(_useChartSeries2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _useChartSeries2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useChartSeries2[key];
    }
  });
});