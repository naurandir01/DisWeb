import { PolarAxisDefaultized } from "../../../../models/axis.js";
/**
 * For a pointer coordinate, this function returns the value and dataIndex associated.
 * Returns `-1` if the coordinate does not match a value.
 */
export declare function getAxisIndex(axisConfig: PolarAxisDefaultized, pointerValue: number): number;