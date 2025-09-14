'use client';

import { createSeriesSelectorsOfType, createAllSeriesSelectorOfType } from "../internals/createSeriesSelectorOfType.js";
const useSelectorSeries = createSeriesSelectorsOfType('radar');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('radar');

/**
 * Get access to the internal state of radar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseRadarSeriesReturnValue} the radar series
 */

/**
 * Get access to the internal state of radar series.
 *
 * When called without arguments, it returns all radar series.
 *
 * @returns {UseRadarSeriesReturnValue[]} the radar series
 */

/**
 * Get access to the internal state of radar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseRadarSeriesReturnValue[]} the radar series
 */

export function useRadarSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of radar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the radar series
 */
export function useRadarSeriesContext() {
  return useSelectorSeriesContext();
}