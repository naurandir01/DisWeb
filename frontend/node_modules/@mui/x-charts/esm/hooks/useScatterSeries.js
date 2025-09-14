'use client';

import { createSeriesSelectorsOfType, createAllSeriesSelectorOfType } from "../internals/createSeriesSelectorOfType.js";
const useSelectorSeries = createSeriesSelectorsOfType('scatter');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('scatter');

/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseScatterSeriesReturnValue} the scatter series
 */

/**
 * Get access to the internal state of scatter series.
 *
 * When called without arguments, it returns all scatter series.
 *
 * @returns {UseScatterSeriesReturnValue[]} the scatter series
 */

/**
 * Get access to the internal state of scatter series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseScatterSeriesReturnValue[]} the scatter series
 */

export function useScatterSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the scatter series
 */
export function useScatterSeriesContext() {
  return useSelectorSeriesContext();
}