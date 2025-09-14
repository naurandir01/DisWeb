'use client';

import { selectorChartSkipAnimation } from "../internals/plugins/corePlugins/useChartAnimation/index.js";
import { useStore } from "../internals/store/useStore.js";
import { useSelector } from "../internals/store/useSelector.js";

/**
 * A hook to get if chart animations should be skipped.
 *
 * @returns {boolean} whether to skip animations
 */
export function useSkipAnimation(skipAnimation) {
  const store = useStore();
  const storeSkipAnimation = useSelector(store, selectorChartSkipAnimation);
  return skipAnimation || storeSkipAnimation;
}