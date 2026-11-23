import type { LegendItemParams } from "../../../../ChartsLegend/index.js";
import type { ChartSeriesType } from "../../../../models/seriesType/config.js";
import type { SeriesProcessorResult } from "./seriesProcessor.types.js";
export type LegendGetter<T extends ChartSeriesType> = (series: SeriesProcessorResult<T>) => LegendItemParams[];