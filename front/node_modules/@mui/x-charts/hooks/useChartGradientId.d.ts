import { AxisId } from "../models/axis.js";
/**
 * Returns a function that generates a gradient id for the given axis id.
 */
export declare function useChartGradientIdBuilder(): (axisId: AxisId) => string;
/**
 * Returns a function that generates a gradient id for the given axis id.
 */
export declare function useChartGradientIdObjectBoundBuilder(): (axisId: AxisId) => string;
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
export declare function useChartGradientId(axisId: AxisId): string;
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
export declare function useChartGradientIdObjectBound(axisId: AxisId): string;