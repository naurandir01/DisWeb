'use client';

import { useStore } from "../internals/store/useStore.js";
import { selectorChartZAxis } from "../internals/plugins/featurePlugins/useChartZAxis/index.js";
import { useSelector } from "../internals/store/useSelector.js";
export function useZAxes() {
  const store = useStore();
  const {
    axis: zAxis,
    axisIds: zAxisIds
  } = useSelector(store, selectorChartZAxis) ?? {
    axis: {},
    axisIds: []
  };
  return {
    zAxis,
    zAxisIds
  };
}
export function useZAxis(identifier) {
  const {
    zAxis,
    zAxisIds
  } = useZAxes();
  const id = typeof identifier === 'string' ? identifier : zAxisIds[identifier ?? 0];
  return zAxis[id];
}