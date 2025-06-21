'use client';

import { useStore } from "../internals/store/useStore.js";
import { useSelector } from "../internals/store/useSelector.js";
import { selectorChartId } from "../internals/plugins/corePlugins/useChartId/useChartId.selectors.js";

/**
 * Get the unique identifier of the chart.
 * @returns chartId if it exists.
 */
export function useChartId() {
  const store = useStore();
  return useSelector(store, selectorChartId);
}