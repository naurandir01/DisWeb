"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
var _exportNames = {
  timelineSeparatorClasses: true
};
Object.defineProperty(exports, "default", {
  enumerable: true,
  get: function () {
    return _TimelineSeparator.default;
  }
});
Object.defineProperty(exports, "timelineSeparatorClasses", {
  enumerable: true,
  get: function () {
    return _timelineSeparatorClasses.default;
  }
});
var _TimelineSeparator = _interopRequireDefault(require("./TimelineSeparator"));
var _timelineSeparatorClasses = _interopRequireWildcard(require("./timelineSeparatorClasses"));
Object.keys(_timelineSeparatorClasses).forEach(function (key) {
  if (key === "default" || key === "__esModule") return;
  if (Object.prototype.hasOwnProperty.call(_exportNames, key)) return;
  if (key in exports && exports[key] === _timelineSeparatorClasses[key]) return;
  Object.defineProperty(exports, key, {
    enumerable: true,
    get: function () {
      return _timelineSeparatorClasses[key];
    }
  });
});