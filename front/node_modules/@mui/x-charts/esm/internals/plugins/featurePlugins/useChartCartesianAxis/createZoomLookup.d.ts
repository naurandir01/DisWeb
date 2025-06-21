import { AxisConfig, ChartsXAxisProps, ChartsYAxisProps, ScaleName } from "../../../../models/index.js";
import { AxisId } from "../../../../models/axis.js";
import { DefaultizedZoomOptions } from "./useChartCartesianAxis.types.js";
export declare const createZoomLookup: (axisDirection: "x" | "y") => (axes?: AxisConfig<ScaleName, any, ChartsXAxisProps | ChartsYAxisProps>[]) => Record<AxisId, DefaultizedZoomOptions>;