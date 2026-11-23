"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultizeMargin = defaultizeMargin;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
function defaultizeMargin(input, defaultMargin) {
  if (typeof input === 'number') {
    return {
      top: input,
      bottom: input,
      left: input,
      right: input
    };
  }
  if (defaultMargin) {
    return (0, _extends2.default)({}, defaultMargin, input);
  }
  return input;
}