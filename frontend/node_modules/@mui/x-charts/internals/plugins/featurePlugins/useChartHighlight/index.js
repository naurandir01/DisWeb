"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useChartHighlight: true
};
Object.defineProperty(exports, "useChartHighlight", {
  enumerable: true,
  get: function () {
    return _useChartHighlight.useChartHighlight;
  }
});
var _useChartHighlight = require("./useChartHighlight");
var _useChartHighlight2 = require("./useChartHighlight.selectors");
Object.keys(_useChartHighlight2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _useChartHighlight2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useChartHighlight2[key];
    }
  });
});