import { AxisId, AxisScaleComputedConfig, ScaleName } from "../models/axis.js";
/**
 * Get the X axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified X axis, or undefined if not found.
 */
export declare function useXColorScale<S extends ScaleName>(axisId?: AxisId): AxisScaleComputedConfig[S]['colorScale'] | undefined;
/**
 * Get the Y axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Y axis, or undefined if not found.
 */
export declare function useYColorScale<S extends ScaleName>(axisId?: AxisId): AxisScaleComputedConfig[S]['colorScale'] | undefined;
/**
 * Get the Z axis color scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns color scale for axisId, else returns the values for the default axis.
 * @returns {AxisScaleComputedConfig[S]['colorScale'] | undefined} The color scale for the specified Z axis, or undefined if not found.
 */
export declare function useZColorScale<S extends ScaleName>(axisId?: AxisId): AxisScaleComputedConfig[S]['colorScale'] | undefined;