"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.usePieSeries = usePieSeries;
exports.usePieSeriesContext = usePieSeriesContext;
var _createSeriesSelectorOfType = require("../internals/createSeriesSelectorOfType");
const useSelectorSeries = (0, _createSeriesSelectorOfType.createSeriesSelectorsOfType)('pie');
const useSelectorSeriesContext = (0, _createSeriesSelectorOfType.createAllSeriesSelectorOfType)('pie');

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

function usePieSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of pie series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the pie series
 */
function usePieSeriesContext() {
  return useSelectorSeriesContext();
}