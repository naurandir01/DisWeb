'use client';

import { createSeriesSelectorsOfType, createAllSeriesSelectorOfType } from "../internals/createSeriesSelectorOfType.js";
const useSelectorSeries = createSeriesSelectorsOfType('bar');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('bar');

/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseBarSeriesReturnValue} the bar series
 */

/**
 * Get access to the internal state of bar series.
 *
 * When called without arguments, it returns all bar series.
 *
 * @returns {UseBarSeriesReturnValue[]} the bar series
 */

/**
 * Get access to the internal state of bar series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseBarSeriesReturnValue[]} the bar series
 */

export function useBarSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of bar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * - stackingGroups: the array of stacking groups. Each group contains the series ids stacked and the strategy to use.
 * @returns the bar series
 */
export function useBarSeriesContext() {
  return useSelectorSeriesContext();
}