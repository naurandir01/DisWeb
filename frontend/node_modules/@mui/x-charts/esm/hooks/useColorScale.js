'use client';

import { useXAxis, useYAxis } from "./useAxis.js";
import { useZAxis } from "./useZAxis.js";

/**
 * Get the X axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified X axis, or undefined if not found.
 */
export function useXColorScale(axisId) {
  const axis = useXAxis(axisId);
  return axis.colorScale;
}

/**
 * Get the Y axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Y axis, or undefined if not found.
 */
export function useYColorScale(axisId) {
  const axis = useYAxis(axisId);
  return axis.colorScale;
}

/**
 * Get the Z axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Z axis, or undefined if not found.
 */
export function useZColorScale(axisId) {
  const axis = useZAxis(axisId);
  return axis.colorScale;
}