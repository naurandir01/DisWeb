import type { PolarChartSeriesType, ChartSeriesDefaultized } from "../../../../models/seriesType/config.js";
import type { AxisConfig } from "../../../../models/axis.js";
import type { SeriesId } from "../../../../models/seriesType/common.js";
type PolarExtremumGetterParams<TSeriesType extends PolarChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>;
  axis: AxisConfig;
  axisIndex: number;
  isDefaultAxis: boolean;
};
export type PolarExtremumGetterResult = [number, number];
export type PolarExtremumGetter<TSeriesType extends PolarChartSeriesType> = (params: PolarExtremumGetterParams<TSeriesType>) => PolarExtremumGetterResult;
export {};