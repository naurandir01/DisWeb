"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useChartInteraction: true
};
Object.defineProperty(exports, "useChartInteraction", {
  enumerable: true,
  get: function () {
    return _useChartInteraction.useChartInteraction;
  }
});
var _useChartInteraction = require("./useChartInteraction");
var _useChartInteraction2 = require("./useChartInteraction.selectors");
Object.keys(_useChartInteraction2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _useChartInteraction2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useChartInteraction2[key];
    }
  });
});