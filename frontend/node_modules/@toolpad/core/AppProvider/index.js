"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _AppProvider = require("./AppProvider");
Object.keys(_AppProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _AppProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _AppProvider[key];
    }
  });
});
var _LocalizationProvider = require("./LocalizationProvider");
Object.keys(_LocalizationProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _LocalizationProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _LocalizationProvider[key];
    }
  });
});