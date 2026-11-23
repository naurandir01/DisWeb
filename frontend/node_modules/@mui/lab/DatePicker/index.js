"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _DatePicker.default;
  }
});
var _DatePicker = _interopRequireWildcard(require("./DatePicker"));
Object.keys(_DatePicker).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _DatePicker[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _DatePicker[key];
    }
  });
});