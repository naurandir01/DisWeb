"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _getLabel = require("../../internals/getLabel");
const tooltipGetter = params => {
  const {
    series,
    getColor,
    identifier
  } = params;
  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const point = series.data[identifier.dataIndex];
  if (point == null) {
    return null;
  }
  const label = (0, _getLabel.getLabel)(point.label, 'tooltip');
  const value = (0, _extends2.default)({}, point, {
    label
  });
  const formattedValue = series.valueFormatter(value, {
    dataIndex: identifier.dataIndex
  });
  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: point.labelMarkType ?? series.labelMarkType
  };
};
var _default = exports.default = tooltipGetter;