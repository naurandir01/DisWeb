"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartRootRef = useChartRootRef;
var _ChartProvider = require("../context/ChartProvider");
/**
 * Get the ref for the root chart element.
 * @returns The root chart element ref.
 */
function useChartRootRef() {
  const context = (0, _ChartProvider.useChartContext)();
  return context.chartRootRef;
}