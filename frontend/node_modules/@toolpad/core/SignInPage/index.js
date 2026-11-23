"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _SignInPage = require("./SignInPage");
Object.keys(_SignInPage).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (key in exports && exports[key] === _SignInPage[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _SignInPage[key];
    }
  });
});