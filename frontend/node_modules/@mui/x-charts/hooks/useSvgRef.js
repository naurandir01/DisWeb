"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSvgRef = useSvgRef;
var _ChartProvider = require("../context/ChartProvider");
/**
 * Get the ref for the SVG element.
 * @returns The SVG ref.
 */
function useSvgRef() {
  const context = (0, _ChartProvider.useChartContext)();
  if (!context) {
    throw new Error(['MUI X Charts: Could not find the svg ref context.', 'It looks like you rendered your component outside of a ChartContainer parent component.'].join('\n'));
  }
  return context.svgRef;
}