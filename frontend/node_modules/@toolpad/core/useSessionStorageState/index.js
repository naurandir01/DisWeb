"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useSessionStorageState = require("./useSessionStorageState");
Object.keys(_useSessionStorageState).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useSessionStorageState[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useSessionStorageState[key];
    }
  });
});