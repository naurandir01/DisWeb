'use client';

import { useChartContext } from "../context/ChartProvider/index.js";

/**
 * Get the ref for the root chart element.
 * @returns The root chart element ref.
 */
export function useChartRootRef() {
  const context = useChartContext();
  return context.chartRootRef;
}