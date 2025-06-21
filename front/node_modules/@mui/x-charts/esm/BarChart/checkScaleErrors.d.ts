import { AxisId, ComputedXAxis, ComputedYAxis } from "../models/axis.js";
import { DefaultizedBarSeriesType } from "../models/seriesType/bar.js";
import { SeriesId } from "../models/seriesType/common.js";
export declare function checkScaleErrors(verticalLayout: boolean, seriesId: SeriesId, series: DefaultizedBarSeriesType & {
  stackedData: [number, number][];
}, xAxisId: AxisId, xAxis: {
  [axisId: AxisId]: ComputedXAxis;
}, yAxisId: AxisId, yAxis: {
  [axisId: AxisId]: ComputedYAxis;
}): void;