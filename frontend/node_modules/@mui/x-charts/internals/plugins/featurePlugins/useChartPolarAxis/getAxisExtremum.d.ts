import { AxisConfig } from "../../../../models/axis.js";
import { PolarChartSeriesType } from "../../../../models/seriesType/config.js";
import { ChartSeriesConfig } from "../../models/seriesConfig/index.js";
import { ProcessedSeries } from "../../corePlugins/useChartSeries/useChartSeries.types.js";
export declare const getAxisExtremum: <TSeriesType extends PolarChartSeriesType>(axis: AxisConfig, axisDirection: "rotation" | "radius", seriesConfig: ChartSeriesConfig<TSeriesType>, axisIndex: number, formattedSeries: ProcessedSeries<TSeriesType>) => number[];