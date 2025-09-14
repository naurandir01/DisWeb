'use client';

import { createSeriesSelectorsOfType, createAllSeriesSelectorOfType } from "../internals/createSeriesSelectorOfType.js";
const useSelectorSeries = createSeriesSelectorsOfType('pie');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('pie');

/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UsePieSeriesReturnValue} the pie series
 */

/**
 * Get access to the internal state of pie series.
 *
 * When called without arguments, it returns all pie series.
 *
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */

/**
 * Get access to the internal state of pie series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UsePieSeriesReturnValue[]} the pie series
 */

export function usePieSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the pie series
 */
export function usePieSeriesContext() {
  return useSelectorSeriesContext();
}