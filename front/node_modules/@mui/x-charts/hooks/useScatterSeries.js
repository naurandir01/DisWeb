"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useScatterSeries = useScatterSeries;
exports.useScatterSeriesContext = useScatterSeriesContext;
var _createSeriesSelectorOfType = require("../internals/createSeriesSelectorOfType");
const useSelectorSeries = (0, _createSeriesSelectorOfType.createSeriesSelectorsOfType)('scatter');
const useSelectorSeriesContext = (0, _createSeriesSelectorOfType.createAllSeriesSelectorOfType)('scatter');

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

function useScatterSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of scatter series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the scatter series
 */
function useScatterSeriesContext() {
  return useSelectorSeriesContext();
}