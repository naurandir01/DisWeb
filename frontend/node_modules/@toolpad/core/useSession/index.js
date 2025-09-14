"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _useSession = require("./useSession");
Object.keys(_useSession).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _useSession[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _useSession[key];
    }
  });
});