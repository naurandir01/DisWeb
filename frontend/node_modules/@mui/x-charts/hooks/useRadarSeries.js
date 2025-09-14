"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRadarSeries = useRadarSeries;
exports.useRadarSeriesContext = useRadarSeriesContext;
var _createSeriesSelectorOfType = require("../internals/createSeriesSelectorOfType");
const useSelectorSeries = (0, _createSeriesSelectorOfType.createSeriesSelectorsOfType)('radar');
const useSelectorSeriesContext = (0, _createSeriesSelectorOfType.createAllSeriesSelectorOfType)('radar');

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

function useRadarSeries(seriesIds) {
  return useSelectorSeries(seriesIds);
}

/**
 * Get access to the internal state of radar series.
 * The returned object contains:
 * - series: a mapping from ids to series attributes.
 * - seriesOrder: the array of series ids.
 * @returns the radar series
 */
function useRadarSeriesContext() {
  return useSelectorSeriesContext();
}