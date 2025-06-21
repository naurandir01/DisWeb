'use client';

import { useChartContext } from "../context/ChartProvider/index.js";

/**
 * Get the ref for the SVG element.
 * @returns The SVG ref.
 */
export function useSvgRef() {
  const context = useChartContext();
  if (!context) {
    throw new Error(['MUI X Charts: Could not find the svg ref context.', 'It looks like you rendered your component outside of a ChartContainer parent component.'].join('\n'));
  }
  return context.svgRef;
}