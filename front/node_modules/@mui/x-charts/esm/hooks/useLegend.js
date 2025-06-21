'use client';

import { selectorChartSeriesConfig } from "../internals/plugins/corePlugins/useChartSeries/index.js";
import { useSeries } from "./useSeries.js";
import { useStore } from "../internals/store/useStore.js";
import { useSelector } from "../internals/store/useSelector.js";
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
export function useLegend() {
  const series = useSeries();
  const store = useStore();
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);
  return {
    items: getSeriesToDisplay(series, seriesConfig)
  };
}