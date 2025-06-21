import type { ChartSeriesDefaultized, ChartSeriesType, ChartsSeriesConfig, DatasetType } from "../../../../models/seriesType/config.js";
import type { SeriesId } from "../../../../models/seriesType/common.js";
import type { StackingGroupsType } from "../../../stackSeries.js";
export type SeriesProcessorParams<TSeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartsSeriesConfig[TSeriesType]['seriesInput']>;
  seriesOrder: SeriesId[];
};
export type SeriesProcessorResult<TSeriesType extends ChartSeriesType> = {
  series: Record<SeriesId, ChartSeriesDefaultized<TSeriesType>>;
  seriesOrder: SeriesId[];
} & (ChartsSeriesConfig[TSeriesType] extends {
  canBeStacked: true;
} ? {
  stackingGroups: StackingGroupsType;
} : {});
export type SeriesProcessor<TSeriesType extends ChartSeriesType> = (params: SeriesProcessorParams<TSeriesType>, dataset?: Readonly<DatasetType>) => SeriesProcessorResult<TSeriesType>;