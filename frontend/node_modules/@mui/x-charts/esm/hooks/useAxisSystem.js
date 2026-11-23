'use client';

import { selectorChartRawXAxis } from "../internals/plugins/featurePlugins/useChartCartesianAxis/index.js";
import { selectorChartRawRotationAxis } from "../internals/plugins/featurePlugins/useChartPolarAxis/index.js";
import { useSelector } from "../internals/store/useSelector.js";
import { useStore } from "../internals/store/useStore.js";

/**
 * @internals
 *
 * Get the coordinate system implemented.
 * The hook assumes polar and cartesian are never implemented at the same time.
 * @returns The coordinate system
 */
export function useAxisSystem() {
  const store = useStore();
  const rawRotationAxis = useSelector(store, selectorChartRawRotationAxis);
  const rawXAxis = useSelector(store, selectorChartRawXAxis);
  if (rawRotationAxis !== undefined) {
    return 'polar';
  }
  if (rawXAxis !== undefined) {
    return 'cartesian';
  }
  return 'none';
}