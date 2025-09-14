"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _ChartsWrapper = require("./ChartsWrapper");
Object.keys(_ChartsWrapper).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _ChartsWrapper[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _ChartsWrapper[key];
    }
  });
});