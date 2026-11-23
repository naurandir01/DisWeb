import { AxisId, AxisScaleConfig, D3Scale, ScaleName } from "../models/axis.js";
/**
 * For a given scale return a function that map value to their position.
 * Useful when dealing with specific scale such as band.
 * @param {D3Scale} scale The scale to use
 * @returns {(value: any) => number} A function that map value to their position
 */
export declare function getValueToPositionMapper(scale: D3Scale): (value: any) => number;
/**
 * Get the X scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns the scale for the x axis with axisId, else returns the values for the default x axis.
 * @returns {AxisScaleConfig[S]['scale']} The scale for the specified X axis.
 */
export declare function useXScale<S extends ScaleName>(axisId?: AxisId): AxisScaleConfig[S]['scale'];
/**
 * Get the Y scale.
 *
 * @param {AxisId | undefined} axisId - If provided returns the scale for the y axis with axisId, else returns the values for the default y axis.
 * @returns {AxisScaleConfig[S]['scale']} The scale for the specified Y axis.
 */
export declare function useYScale<S extends ScaleName>(axisId?: AxisId): AxisScaleConfig[S]['scale'];
export declare function useRotationScale<S extends ScaleName>(identifier?: number | string): AxisScaleConfig[S]['scale'] | undefined;
export declare function useRadiusScale<S extends ScaleName>(identifier?: number | string): AxisScaleConfig[S]['scale'] | undefined;