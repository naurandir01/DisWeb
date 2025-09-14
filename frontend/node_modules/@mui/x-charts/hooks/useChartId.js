"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartId = useChartId;
var _useStore = require("../internals/store/useStore");
var _useSelector = require("../internals/store/useSelector");
var _useChartId = require("../internals/plugins/corePlugins/useChartId/useChartId.selectors");
/**
 * Get the unique identifier of the chart.
 * @returns chartId if it exists.
 */
function useChartId() {
  const store = (0, _useStore.useStore)();
  return (0, _useSelector.useSelector)(store, _useChartId.selectorChartId);
}