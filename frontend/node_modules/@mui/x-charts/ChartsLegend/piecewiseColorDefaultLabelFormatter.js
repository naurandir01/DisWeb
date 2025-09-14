"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.piecewiseColorDefaultLabelFormatter = piecewiseColorDefaultLabelFormatter;
function piecewiseColorDefaultLabelFormatter(params) {
  if (params.min === null) {
    return `<${params.formattedMax}`;
  }
  if (params.max === null) {
    return `>${params.formattedMin}`;
  }
  return `${params.formattedMin}-${params.formattedMax}`;
}