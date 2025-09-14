"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useLegend = useLegend;
var _useChartSeries = require("../internals/plugins/corePlugins/useChartSeries");
var _useSeries = require("./useSeries");
var _useStore = require("../internals/store/useStore");
var _useSelector = require("../internals/store/useSelector");
function getSeriesToDisplay(series, seriesConfig) {
  return Object.keys(series).flatMap(seriesType => {
    const getter = seriesConfig[seriesType].legendGetter;
    return getter === undefined ? [] : getter(series[seriesType]);
  });
}

/**
 * Get the legend items to display.
 *
 * This hook is used by the `ChartsLegend` component. And will return the legend items formatted for display.
 *
 * An alternative is to use the `useSeries` hook and format the legend items yourself.
 *
 * @returns legend data
 */
function useLegend() {
  const series = (0, _useSeries.useSeries)();
  const store = (0, _useStore.useStore)();
  const seriesConfig = (0, _useSelector.useSelector)(store, _useChartSeries.selectorChartSeriesConfig);
  return {
    items: getSeriesToDisplay(series, seriesConfig)
  };
}