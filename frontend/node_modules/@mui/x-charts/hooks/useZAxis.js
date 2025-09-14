"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useZAxes = useZAxes;
exports.useZAxis = useZAxis;
var _useStore = require("../internals/store/useStore");
var _useChartZAxis = require("../internals/plugins/featurePlugins/useChartZAxis");
var _useSelector = require("../internals/store/useSelector");
function useZAxes() {
  const store = (0, _useStore.useStore)();
  const {
    axis: zAxis,
    axisIds: zAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartZAxis.selectorChartZAxis) ?? {
    axis: {},
    axisIds: []
  };
  return {
    zAxis,
    zAxisIds
  };
}
function useZAxis(identifier) {
  const {
    zAxis,
    zAxisIds
  } = useZAxes();
  const id = typeof identifier === 'string' ? identifier : zAxisIds[identifier ?? 0];
  return zAxis[id];
}