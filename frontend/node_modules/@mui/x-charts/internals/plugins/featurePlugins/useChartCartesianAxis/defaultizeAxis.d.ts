import { ZoomOptions } from "./zoom.types.js";
import { XAxis, YAxis } from "../../../../models/index.js";
import { DefaultedXAxis, DefaultedYAxis } from "../../../../models/axis.js";
import { DatasetType } from "../../../../models/seriesType/config.js";
type InXAxis = XAxis & {
  zoom?: boolean | ZoomOptions;
};
export declare function defaultizeXAxis(inAxes: readonly InXAxis[] | undefined, dataset: Readonly<DatasetType> | undefined): DefaultedXAxis[];
type InYAxis = YAxis & {
  zoom?: boolean | ZoomOptions;
};
export declare function defaultizeYAxis(inAxes: readonly InYAxis[] | undefined, dataset: Readonly<DatasetType> | undefined): DefaultedYAxis[];
export {};