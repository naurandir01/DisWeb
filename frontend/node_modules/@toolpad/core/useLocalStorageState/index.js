"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useLocalStorageState = require("./useLocalStorageState");
Object.keys(_useLocalStorageState).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useLocalStorageState[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useLocalStorageState[key];
    }
  });
});