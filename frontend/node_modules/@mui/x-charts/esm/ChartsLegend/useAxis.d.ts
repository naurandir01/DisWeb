import { ComputedAxis } from "../models/axis.js";
import { ZAxisDefaultized } from "../models/z-axis.js";
import { ColorLegendSelector } from "./colorLegend.types.js";
/**
 * Helper to select an axis definition according to its direction and id.
 */
export declare function useAxis({
  axisDirection,
  axisId
}: ColorLegendSelector): ZAxisDefaultized | ComputedAxis;