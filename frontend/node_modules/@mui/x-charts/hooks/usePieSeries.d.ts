import { ProcessedSeries } from "../internals/plugins/corePlugins/useChartSeries/useChartSeries.types.js";
import { SeriesId } from "../models/seriesType/common.js";
import { ChartSeriesDefaultized } from "../models/seriesType/config.js";
export type UsePieSeriesReturnValue = ChartSeriesDefaultized<'pie'>;
export type UsePieSeriesContextReturnValue = ProcessedSeries['pie'];
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UsePieSeriesReturnValue} the pie series
 */
export declare function usePieSeries(seriesId: SeriesId): UsePieSeriesReturnValue | undefined;
/**
 * Get access to the internal state of pie series.
 *
 * When called without arguments, it returns all pie series.
 *
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */
export declare function usePieSeries(): UsePieSeriesReturnValue[];
/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */
export declare function usePieSeries(seriesIds: SeriesId[]): UsePieSeriesReturnValue[];
/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the pie series
 */
export declare function usePieSeriesContext(): UsePieSeriesContextReturnValue;