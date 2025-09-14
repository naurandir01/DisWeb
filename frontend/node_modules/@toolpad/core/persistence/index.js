"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useStorageState = require("./useStorageState");
Object.keys(_useStorageState).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useStorageState[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useStorageState[key];
    }
  });
});