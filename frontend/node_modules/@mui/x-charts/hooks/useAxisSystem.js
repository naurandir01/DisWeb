"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxisSystem = useAxisSystem;
var _useChartCartesianAxis = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var _useChartPolarAxis = require("../internals/plugins/featurePlugins/useChartPolarAxis");
var _useSelector = require("../internals/store/useSelector");
var _useStore = require("../internals/store/useStore");
/**
 * @internals
 *
 * Get the coordinate system implemented.
 * The hook assumes polar and cartesian are never implemented at the same time.
 * @returns The coordinate system
 */
function useAxisSystem() {
  const store = (0, _useStore.useStore)();
  const rawRotationAxis = (0, _useSelector.useSelector)(store, _useChartPolarAxis.selectorChartRawRotationAxis);
  const rawXAxis = (0, _useSelector.useSelector)(store, _useChartCartesianAxis.selectorChartRawXAxis);
  if (rawRotationAxis !== undefined) {
    return 'polar';
  }
  if (rawXAxis !== undefined) {
    return 'cartesian';
  }
  return 'none';
}