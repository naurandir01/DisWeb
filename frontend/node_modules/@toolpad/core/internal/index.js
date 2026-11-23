"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  Link: true
};
Object.defineProperty(exports, "Link", {
  enumerable: true,
  get: function () {
    return _Link.Link;
  }
});
var _Link = require("../shared/Link");
var _demo = require("./demo");
Object.keys(_demo).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _demo[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _demo[key];
    }
  });
});