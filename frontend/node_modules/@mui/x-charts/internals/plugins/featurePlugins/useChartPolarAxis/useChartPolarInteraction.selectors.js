"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectorChartsInteractionTooltipRotationAxes = exports.selectorChartsInteractionTooltipRadiusAxes = exports.selectorChartsInteractionRotationAxisValues = exports.selectorChartsInteractionRotationAxisValue = exports.selectorChartsInteractionRotationAxisIndexes = exports.selectorChartsInteractionRotationAxisIndex = exports.selectorChartsInteractionPolarAxisTooltip = void 0;
var _isDeepEqual = require("@mui/x-internals/isDeepEqual");
var _selectors = require("../../utils/selectors");
var _useChartInteraction = require("../useChartInteraction/useChartInteraction.selectors");
var _coordinateTransformation = require("./coordinateTransformation");
var _getAxisIndex = require("./getAxisIndex");
var _useChartPolarAxis = require("./useChartPolarAxis.selectors");
const optionalGetAxisId = (_, id) => id;
const optionalGetAxisIds = (_, ids) => ids;

/**
 * Get interaction indexes
 */

function indexGetter(value, axes, ids) {
  return Array.isArray(ids) ? ids.map(id => (0, _getAxisIndex.getAxisIndex)(axes.axis[id], value)) : (0, _getAxisIndex.getAxisIndex)(axes.axis[ids], value);
}

/**
 * Helper to get the rotation associated to the interaction coordinate.
 */
const selectorChartsInteractionRotationAngle = (0, _selectors.createSelector)([_useChartInteraction.selectorChartsInteractionPointerX, _useChartInteraction.selectorChartsInteractionPointerY, _useChartPolarAxis.selectorChartPolarCenter], (x, y, center) => {
  if (x === null || y === null) {
    return null;
  }
  return (0, _coordinateTransformation.generateSvg2rotation)(center)(x, y);
});
const selectorChartsInteractionRotationAxisIndex = exports.selectorChartsInteractionRotationAxisIndex = (0, _selectors.createSelector)([selectorChartsInteractionRotationAngle, _useChartPolarAxis.selectorChartRotationAxis, optionalGetAxisId], (rotation, rotationAxis, id = rotationAxis.axisIds[0]) => rotation === null ? null : indexGetter(rotation, rotationAxis, id));
const selectorChartsInteractionRotationAxisIndexes = exports.selectorChartsInteractionRotationAxisIndexes = (0, _selectors.createSelector)([selectorChartsInteractionRotationAngle, _useChartPolarAxis.selectorChartRotationAxis, optionalGetAxisIds], (rotation, rotationAxis, ids = rotationAxis.axisIds) => rotation === null ? null : indexGetter(rotation, rotationAxis, ids));
const selectorChartsInteractionRotationAxisValue = exports.selectorChartsInteractionRotationAxisValue = (0, _selectors.createSelector)([_useChartPolarAxis.selectorChartRotationAxis, selectorChartsInteractionRotationAxisIndex, optionalGetAxisId], (rotationAxis, rotationIndex, id = rotationAxis.axisIds[0]) => {
  if (rotationIndex === null || rotationIndex === -1 || rotationAxis.axisIds.length === 0) {
    return null;
  }
  const data = rotationAxis.axis[id]?.data;
  if (!data) {
    return null;
  }
  return data[rotationIndex];
});
const selectorChartsInteractionRotationAxisValues = exports.selectorChartsInteractionRotationAxisValues = (0, _selectors.createSelector)([_useChartPolarAxis.selectorChartRotationAxis, selectorChartsInteractionRotationAxisIndexes, optionalGetAxisIds], (rotationAxis, rotationIndexes, ids = rotationAxis.axisIds) => {
  if (rotationIndexes === null) {
    return null;
  }
  return ids.map((id, axisIndex) => {
    const rotationIndex = rotationIndexes[axisIndex];
    if (rotationIndex === -1) {
      return null;
    }
    return rotationAxis.axis[id].data?.[rotationIndex];
  });
});

/**
 * Get rotation-axis ids and corresponding data index that should be display in the tooltip.
 */
const selectorChartsInteractionTooltipRotationAxes = exports.selectorChartsInteractionTooltipRotationAxes = (0, _selectors.createSelector)([selectorChartsInteractionRotationAxisIndexes, _useChartPolarAxis.selectorChartRotationAxis], (indexes, axes) => {
  if (indexes === null) {
    return [];
  }
  return axes.axisIds.map((axisId, axisIndex) => ({
    axisId,
    dataIndex: indexes[axisIndex]
  })).filter(({
    axisId,
    dataIndex
  }) => axes.axis[axisId].triggerTooltip && dataIndex >= 0);
}, {
  memoizeOptions: {
    // Keep the same reference if array content is the same.
    // If possible, avoid this pattern by creating selectors that
    // uses string/number as arguments.
    resultEqualityCheck: _isDeepEqual.isDeepEqual
  }
});

/**
 * Get radius-axis ids and corresponding data index that should be displayed in the tooltip.
 */
const selectorChartsInteractionTooltipRadiusAxes = exports.selectorChartsInteractionTooltipRadiusAxes = (0, _selectors.createSelector)([], () => {
  // TODO implement this selector and add it to the `selectorChartsInteractionPolarAxisTooltip`
  return [];
});

/**
 * Return `true` if the axis tooltip has something to display.
 */
const selectorChartsInteractionPolarAxisTooltip = exports.selectorChartsInteractionPolarAxisTooltip = (0, _selectors.createSelector)([selectorChartsInteractionTooltipRotationAxes], rotationTooltip => rotationTooltip.length > 0);