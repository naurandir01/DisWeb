"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _RadarDataProvider = require("./RadarDataProvider");
Object.keys(_RadarDataProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _RadarDataProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _RadarDataProvider[key];
    }
  });
});