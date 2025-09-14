import { ProcessedSeries } from "../internals/plugins/corePlugins/useChartSeries/useChartSeries.types.js";
import { SeriesId } from "../models/seriesType/common.js";
import { ChartSeriesDefaultized } from "../models/seriesType/config.js";
export type UseScatterSeriesReturnValue = ChartSeriesDefaultized<'scatter'>;
export type UseScatterSeriesContextReturnValue = ProcessedSeries['scatter'];
/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseScatterSeriesReturnValue} the scatter series
 */
export declare function useScatterSeries(seriesId: SeriesId): UseScatterSeriesReturnValue | undefined;
/**
 * Get access to the internal state of scatter series.
 *
 * When called without arguments, it returns all scatter series.
 *
 * @returns {UseScatterSeriesReturnValue[]} the scatter series
 */
export declare function useScatterSeries(): UseScatterSeriesReturnValue[];
/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseScatterSeriesReturnValue[]} the scatter series
 */
export declare function useScatterSeries(seriesIds: SeriesId[]): UseScatterSeriesReturnValue[];
/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the scatter series
 */
export declare function useScatterSeriesContext(): UseScatterSeriesContextReturnValue;