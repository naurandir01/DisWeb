'use client';

import { useStore } from "../internals/store/useStore.js";
import { useSelector } from "../internals/store/useSelector.js";
import { selectorChartDrawingArea } from "../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors.js";
/**
 * Get the drawing area dimensions and coordinates. The drawing area is the area where the chart is rendered.
 *
 * It includes the left, top, width, height, bottom, and right dimensions.
 *
 * @returns The drawing area dimensions.
 */
export function useDrawingArea() {
  const store = useStore();
  return useSelector(store, selectorChartDrawingArea);
}