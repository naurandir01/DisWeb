import { CartesianChartSeriesType } from "../../../../models/seriesType/config.js";
import { ChartSeriesConfig } from "../../models/seriesConfig/index.js";
import { ProcessedSeries } from "../../corePlugins/useChartSeries/useChartSeries.types.js";
import { AxisId } from "../../../../models/axis.js";
export declare const getAxisTriggerTooltip: <TSeriesType extends CartesianChartSeriesType>(axisDirection: "x" | "y", seriesConfig: ChartSeriesConfig<TSeriesType>, formattedSeries: ProcessedSeries<TSeriesType>, defaultAxisId: AxisId) => Set<AxisId>;