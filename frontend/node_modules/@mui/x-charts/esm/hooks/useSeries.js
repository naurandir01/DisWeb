'use client';

import { useStore } from "../internals/store/useStore.js";
import { useSelector } from "../internals/store/useSelector.js";
import { selectorChartSeriesProcessed } from "../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors.js";
/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
export function useSeries() {
  const store = useStore();
  return useSelector(store, selectorChartSeriesProcessed);
}