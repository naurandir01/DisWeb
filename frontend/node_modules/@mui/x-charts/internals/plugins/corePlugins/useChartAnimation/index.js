"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  useChartAnimation: true
};
Object.defineProperty(exports, "useChartAnimation", {
  enumerable: true,
  get: function () {
    return _useChartAnimation.useChartAnimation;
  }
});
var _useChartAnimation = require("./useChartAnimation");
var _useChartAnimation2 = require("./useChartAnimation.selectors");
Object.keys(_useChartAnimation2).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _useChartAnimation2[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useChartAnimation2[key];
    }
  });
});