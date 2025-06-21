"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useRadiusAxes = useRadiusAxes;
exports.useRadiusAxis = useRadiusAxis;
exports.useRotationAxes = useRotationAxes;
exports.useRotationAxis = useRotationAxis;
exports.useXAxes = useXAxes;
exports.useXAxis = useXAxis;
exports.useYAxes = useYAxes;
exports.useYAxis = useYAxis;
var _useChartCartesianAxisRendering = require("../internals/plugins/featurePlugins/useChartCartesianAxis/useChartCartesianAxisRendering.selectors");
var _useChartPolarAxis = require("../internals/plugins/featurePlugins/useChartPolarAxis");
var _useSelector = require("../internals/store/useSelector");
var _useStore = require("../internals/store/useStore");
/**
 * Get all the x-axes.
 *
 * - `xAxis` is an object with the shape `{ [axisId]: axis }`.
 * - `xAxisIds` is an array of axis IDs.
 *
 * If access to a specific X axis is needed, use the `useXAxis` hook instead.
 *
 * @returns `{ xAxis, xAxisIds }` - The x-axes and their IDs.
 */
function useXAxes() {
  const store = (0, _useStore.useStore)();
  const {
    axis: xAxis,
    axisIds: xAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartCartesianAxisRendering.selectorChartXAxis);
  return {
    xAxis,
    xAxisIds
  };
}

/**
 * Get all the y-axes.
 *
 * - `yAxis` is an object with the shape `{ [axisId]: axis }`.
 * - `yAxisIds` is an array of axis IDs.
 *
 * If access to a specific Y axis is needed, use the `useYAxis` hook instead.
 *
 * @returns `{ yAxis, yAxisIds }` - The y-axes and their IDs.
 */
function useYAxes() {
  const store = (0, _useStore.useStore)();
  const {
    axis: yAxis,
    axisIds: yAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartCartesianAxisRendering.selectorChartYAxis);
  return {
    yAxis,
    yAxisIds
  };
}

/**
 * Get the X axis.
 * @param {AxisId | undefined} axisId - If provided returns the x axis with axisId, else returns the values for the default x axis.
 * @returns The X axis.
 */
function useXAxis(axisId) {
  const store = (0, _useStore.useStore)();
  const {
    axis: xAxis,
    axisIds: xAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartCartesianAxisRendering.selectorChartXAxis);
  const id = axisId ?? xAxisIds[0];
  return xAxis[id];
}

/**
 * Get the Y axis.
 * @param {AxisId | undefined} axisId - If provided returns the y axis with axisId, else returns the values for the default y axis.
 * @returns The Y axis.
 */
function useYAxis(axisId) {
  const store = (0, _useStore.useStore)();
  const {
    axis: yAxis,
    axisIds: yAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartCartesianAxisRendering.selectorChartYAxis);
  const id = axisId ?? yAxisIds[0];
  return yAxis[id];
}
function useRotationAxes() {
  const store = (0, _useStore.useStore)();
  const {
    axis: rotationAxis,
    axisIds: rotationAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartPolarAxis.selectorChartRotationAxis);
  return {
    rotationAxis,
    rotationAxisIds
  };
}
function useRadiusAxes() {
  const store = (0, _useStore.useStore)();
  const {
    axis: radiusAxis,
    axisIds: radiusAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartPolarAxis.selectorChartRadiusAxis);
  return {
    radiusAxis,
    radiusAxisIds
  };
}
function useRotationAxis(identifier) {
  const store = (0, _useStore.useStore)();
  const {
    axis: rotationAxis,
    axisIds: rotationAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartPolarAxis.selectorChartRotationAxis);
  const id = typeof identifier === 'string' ? identifier : rotationAxisIds[identifier ?? 0];
  return rotationAxis[id];
}
function useRadiusAxis(identifier) {
  const store = (0, _useStore.useStore)();
  const {
    axis: radiusAxis,
    axisIds: radiusAxisIds
  } = (0, _useSelector.useSelector)(store, _useChartPolarAxis.selectorChartRadiusAxis);
  const id = typeof identifier === 'string' ? identifier : radiusAxisIds[identifier ?? 0];
  return radiusAxis[id];
}