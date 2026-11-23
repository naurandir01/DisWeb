"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useActivePage = require("./useActivePage");
Object.keys(_useActivePage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useActivePage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useActivePage[key];
    }
  });
});