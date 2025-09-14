"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _defaultizeValueFormatter = require("../../internals/defaultizeValueFormatter");
const formatter = params => {
  const {
    seriesOrder,
    series
  } = params;
  return {
    seriesOrder,
    series: (0, _defaultizeValueFormatter.defaultizeValueFormatter)(series, v => v == null ? '' : v.toLocaleString())
  };
};
var _default = exports.default = formatter;