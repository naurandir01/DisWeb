"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectorChartTopAxisSize = exports.selectorChartRightAxisSize = exports.selectorChartLeftAxisSize = exports.selectorChartBottomAxisSize = void 0;
var _useChartCartesianAxisLayout = require("./useChartCartesianAxisLayout.selectors");
var _selectors = require("../../utils/selectors");
const selectorChartLeftAxisSize = exports.selectorChartLeftAxisSize = (0, _selectors.createSelector)([_useChartCartesianAxisLayout.selectorChartRawYAxis], yAxis => (yAxis ?? []).reduce((acc, axis) => axis.position === 'left' ? acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0) : acc, 0));
const selectorChartRightAxisSize = exports.selectorChartRightAxisSize = (0, _selectors.createSelector)([_useChartCartesianAxisLayout.selectorChartRawYAxis], yAxis => (yAxis ?? []).reduce((acc, axis) => axis.position === 'right' ? acc + (axis.width || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0) : acc, 0));
const selectorChartTopAxisSize = exports.selectorChartTopAxisSize = (0, _selectors.createSelector)([_useChartCartesianAxisLayout.selectorChartRawXAxis], xAxis => (xAxis ?? []).reduce((acc, axis) => axis.position === 'top' ? acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0) : acc, 0));
const selectorChartBottomAxisSize = exports.selectorChartBottomAxisSize = (0, _selectors.createSelector)([_useChartCartesianAxisLayout.selectorChartRawXAxis], xAxis => (xAxis ?? []).reduce((acc, axis) => axis.position === 'bottom' ? acc + (axis.height || 0) + (axis.zoom?.slider.enabled ? axis.zoom.slider.size : 0) : acc, 0));