"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useDrawingArea = useDrawingArea;
var _useStore = require("../internals/store/useStore");
var _useSelector = require("../internals/store/useSelector");
var _useChartDimensions = require("../internals/plugins/corePlugins/useChartDimensions/useChartDimensions.selectors");
/**
 * Get the drawing area dimensions and coordinates. The drawing area is the area where the chart is rendered.
 *
 * It includes the left, top, width, height, bottom, and right dimensions.
 *
 * @returns The drawing area dimensions.
 */
function useDrawingArea() {
  const store = (0, _useStore.useStore)();
  return (0, _useSelector.useSelector)(store, _useChartDimensions.selectorChartDrawingArea);
}