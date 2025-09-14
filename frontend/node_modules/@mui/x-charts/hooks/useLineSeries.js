"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLineSeries = useLineSeries;
exports.useLineSeriesContext = useLineSeriesContext;
var _createSeriesSelectorOfType = require("../internals/createSeriesSelectorOfType");
const useSelectorSeries = (0, _createSeriesSelectorOfType.createSeriesSelectorsOfType)('line');
const useSelectorSeriesContext = (0, _createSeriesSelectorOfType.createAllSeriesSelectorOfType)('line');

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

function useLineSeries(seriesIds) {
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
function useLineSeriesContext() {
  return useSelectorSeriesContext();
}