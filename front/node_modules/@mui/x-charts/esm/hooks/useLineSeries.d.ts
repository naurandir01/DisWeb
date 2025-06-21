import { ProcessedSeries } from "../internals/plugins/corePlugins/useChartSeries/useChartSeries.types.js";
import { SeriesId } from "../models/seriesType/common.js";
import { ChartSeriesDefaultized } from "../models/seriesType/config.js";
export type UseLineSeriesReturnValue = ChartSeriesDefaultized<'line'>;
export type UseLineSeriesContextReturnValue = ProcessedSeries['line'];
/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseLineSeriesReturnValue} the line series
 */
export declare function useLineSeries(seriesId: SeriesId): UseLineSeriesReturnValue | undefined;
/**
 * Get access to the internal state of line series.
 *
 * When called without arguments, it returns all line series.
 *
 * @returns {UseLineSeriesReturnValue[]} the line series
 */
export declare function useLineSeries(): UseLineSeriesReturnValue[];
/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseLineSeriesReturnValue[]} the line series
 */
export declare function useLineSeries(seriesIds: SeriesId[]): UseLineSeriesReturnValue[];
/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * - stackingGroups: the array of stacking groups. Each group contains the series ids stacked and the strategy to use.
 * @returns the line series
 */
export declare function useLineSeriesContext(): UseLineSeriesContextReturnValue;