"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const getColor = series => {
  return () => series.color;
};
var _default = exports.default = getColor;