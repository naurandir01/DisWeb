"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _StaticDatePicker.default;
  }
});
var _StaticDatePicker = _interopRequireWildcard(require("./StaticDatePicker"));
Object.keys(_StaticDatePicker).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _StaticDatePicker[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _StaticDatePicker[key];
    }
  });
});