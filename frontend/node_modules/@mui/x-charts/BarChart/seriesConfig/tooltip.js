"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.axisTooltipGetter = void 0;
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
  const label = (0, _getLabel.getLabel)(series.label, 'tooltip');
  const value = series.data[identifier.dataIndex];
  if (value == null) {
    return null;
  }
  const formattedValue = series.valueFormatter(value, {
    dataIndex: identifier.dataIndex
  });
  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: series.labelMarkType
  };
};
const axisTooltipGetter = series => {
  return Object.values(series).map(s => s.layout === 'horizontal' ? {
    direction: 'y',
    axisId: s.yAxisId
  } : {
    direction: 'x',
    axisId: s.xAxisId
  });
};
exports.axisTooltipGetter = axisTooltipGetter;
var _default = exports.default = tooltipGetter;