'use client';

import { createSeriesSelectorsOfType, createAllSeriesSelectorOfType } from "../internals/createSeriesSelectorOfType.js";
const useSelectorSeries = createSeriesSelectorsOfType('line');
const useSelectorSeriesContext = createAllSeriesSelectorOfType('line');

/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId} seriesId The id of the series to get.
 * @returns {UseLineSeriesReturnValue} the line series
 */

/**
 * Get access to the internal state of line series.
 *
 * When called without arguments, it returns all line series.
 *
 * @returns {UseLineSeriesReturnValue[]} the line series
 */

/**
 * Get access to the internal state of line series.
 *
 * @param {SeriesId[]} seriesIds The ids of the series to get. Order is preserved.
 * @returns {UseLineSeriesReturnValue[]} the line series
 */

export function useLineSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of line series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * - stackingGroups: the array of stacking groups. Each group contains the series ids stacked and the strategy to use.
 * @returns the line series
 */
export function useLineSeriesContext() {
  return useSelectorSeriesContext();
}