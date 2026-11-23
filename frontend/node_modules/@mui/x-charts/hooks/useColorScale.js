"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useXColorScale = useXColorScale;
exports.useYColorScale = useYColorScale;
exports.useZColorScale = useZColorScale;
var _useAxis = require("./useAxis");
var _useZAxis = require("./useZAxis");
/**
 * Get the X axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified X axis, or undefined if not found.
 */
function useXColorScale(axisId) {
  const axis = (0, _useAxis.useXAxis)(axisId);
  return axis.colorScale;
}

/**
 * Get the Y axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Y axis, or undefined if not found.
 */
function useYColorScale(axisId) {
  const axis = (0, _useAxis.useYAxis)(axisId);
  return axis.colorScale;
}

/**
 * Get the Z axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Z axis, or undefined if not found.
 */
function useZColorScale(axisId) {
  const axis = (0, _useZAxis.useZAxis)(axisId);
  return axis.colorScale;
}