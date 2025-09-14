"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ChartDataProvider = require("./ChartDataProvider");
Object.keys(_ChartDataProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ChartDataProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ChartDataProvider[key];
    }
  });
});