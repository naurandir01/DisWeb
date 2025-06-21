"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSeries = useSeries;
var _useStore = require("../internals/store/useStore");
var _useSelector = require("../internals/store/useSelector");
var _useChartSeries = require("../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors");
/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
function useSeries() {
  const store = (0, _useStore.useStore)();
  return (0, _useSelector.useSelector)(store, _useChartSeries.selectorChartSeriesProcessed);
}