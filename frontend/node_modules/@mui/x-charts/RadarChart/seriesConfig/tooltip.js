"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.axisTooltipGetter = void 0;
var _getLabel = require("../../internals/getLabel");
const tooltipGetter = params => {
  const {
    series,
    axesConfig,
    getColor,
    identifier
  } = params;
  const rotationAxis = axesConfig.rotation;
  if (!identifier || !rotationAxis) {
    return null;
  }
  const label = (0, _getLabel.getLabel)(series.label, 'tooltip');
  const formatter = v => rotationAxis.valueFormatter?.(v, {
    location: 'tooltip',
    scale: rotationAxis.scale
  }) ?? (v == null ? '' : v.toLocaleString());
  return {
    identifier,
    color: getColor(),
    label,
    markType: series.labelMarkType,
    values: series.data.map((value, dataIndex) => ({
      value,
      formattedValue: series.valueFormatter(value, {
        dataIndex
      }),
      markType: series.labelMarkType,
      label: formatter(rotationAxis?.data?.[dataIndex])
    }))
  };
};
const axisTooltipGetter = series => {
  return Object.values(series).map(() => ({
    direction: 'rotation',
    axisId: undefined
  }));
};
exports.axisTooltipGetter = axisTooltipGetter;
var _default = exports.default = tooltipGetter;