"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _NextAppProvider = require("./NextAppProvider");
Object.keys(_NextAppProvider).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _NextAppProvider[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _NextAppProvider[key];
    }
  });
});