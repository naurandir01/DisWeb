import { ProcessedSeries } from "../internals/plugins/corePlugins/useChartSeries/useChartSeries.types.js";
import { SeriesId } from "../models/seriesType/common.js";
import { ChartSeriesDefaultized } from "../models/seriesType/config.js";
export type UseRadarSeriesReturnValue = ChartSeriesDefaultized<'radar'>;
export type UseRadarSeriesContextReturnValue = ProcessedSeries['radar'];
/**
 * Get access to the internal state of radar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseRadarSeriesReturnValue} the radar series
 */
export declare function useRadarSeries(seriesId: SeriesId): UseRadarSeriesReturnValue | undefined;
/**
 * Get access to the internal state of radar series.
 *
 * When called without arguments, it returns all radar series.
 *
 * @returns {UseRadarSeriesReturnValue[]} the radar series
 */
export declare function useRadarSeries(): UseRadarSeriesReturnValue[];
/**
 * Get access to the internal state of radar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseRadarSeriesReturnValue[]} the radar series
 */
export declare function useRadarSeries(seriesIds?: SeriesId[]): UseRadarSeriesReturnValue[];
/**
 * Get access to the internal state of radar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the radar series
 */
export declare function useRadarSeriesContext(): UseRadarSeriesContextReturnValue;