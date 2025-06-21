"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useChartId: true
};
Object.defineProperty(exports, "useChartId", {
  enumerable: true,
  get: function () {
    return _useChartId.useChartId;
  }
});
var _useChartId = require("./useChartId");
var _useChartId2 = require("./useChartId.selectors");
Object.keys(_useChartId2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _useChartId2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useChartId2[key];
    }
  });
});