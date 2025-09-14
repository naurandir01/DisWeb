"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
const getSeriesWithDefaultValues = (seriesData, seriesIndex, colors) => {
  return (0, _extends2.default)({
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: colors[seriesIndex % colors.length]
  }, seriesData);
};
var _default = exports.default = getSeriesWithDefaultValues;