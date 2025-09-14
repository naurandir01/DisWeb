"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useDialogs = require("./useDialogs");
Object.keys(_useDialogs).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useDialogs[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useDialogs[key];
    }
  });
});
var _DialogsProvider = require("./DialogsProvider");
Object.keys(_DialogsProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _DialogsProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _DialogsProvider[key];
    }
  });
});