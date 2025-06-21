"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartGradientId = useChartGradientId;
exports.useChartGradientIdBuilder = useChartGradientIdBuilder;
exports.useChartGradientIdObjectBound = useChartGradientIdObjectBound;
exports.useChartGradientIdObjectBoundBuilder = useChartGradientIdObjectBoundBuilder;
var React = _interopRequireWildcard(require("react"));
var _useChartId = require("./useChartId");
/**
 * Returns a function that generates a gradient id for the given axis id.
 */
function useChartGradientIdBuilder() {
  const chartId = (0, _useChartId.useChartId)();
  return React.useCallback(axisId => `${chartId}-gradient-${axisId}`, [chartId]);
}

/**
 * Returns a function that generates a gradient id for the given axis id.
 */
function useChartGradientIdObjectBoundBuilder() {
  const chartId = (0, _useChartId.useChartId)();
  return React.useCallback(axisId => `${chartId}-gradient-${axisId}-object-bound`, [chartId]);
}

/**
 * Returns a gradient id for the given axis id.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * For a gradient that respects the coordinates of the object on which it is applied, use `useChartGradientIdObjectBound` instead.
 *
 * @param axisId the axis id
 * @returns the gradient id
 */
function useChartGradientId(axisId) {
  return useChartGradientIdBuilder()(axisId);
}

/**
 * Returns a gradient id for the given axis id.
 *
 * Can be useful when reusing the same gradient on custom components.
 *
 * This gradient differs from `useChartGradientId` in that it respects the coordinates of the object on which it is applied.
 *
 * @param axisId the axis id
 * @returns the gradient id
 */
function useChartGradientIdObjectBound(axisId) {
  return useChartGradientIdObjectBoundBuilder()(axisId);
}