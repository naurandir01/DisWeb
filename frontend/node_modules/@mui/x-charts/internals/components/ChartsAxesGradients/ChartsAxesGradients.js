"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxesGradients = ChartsAxesGradients;
var React = _interopRequireWildcard(require("react"));
var _hooks = require("../../../hooks");
var _ChartsPiecewiseGradient = _interopRequireDefault(require("./ChartsPiecewiseGradient"));
var _ChartsContinuousGradient = _interopRequireDefault(require("./ChartsContinuousGradient"));
var _ChartsContinuousGradientObjectBound = _interopRequireDefault(require("./ChartsContinuousGradientObjectBound"));
var _useZAxis = require("../../../hooks/useZAxis");
var _useChartGradientId = require("../../../hooks/useChartGradientId");
var _jsxRuntime = require("react/jsx-runtime");
function ChartsAxesGradients() {
  const {
    top,
    height,
    bottom,
    left,
    width,
    right
  } = (0, _hooks.useDrawingArea)();
  const svgHeight = top + height + bottom;
  const svgWidth = left + width + right;
  const getGradientId = (0, _useChartGradientId.useChartGradientIdBuilder)();
  const getObjectBoundGradientId = (0, _useChartGradientId.useChartGradientIdObjectBoundBuilder)();
  const {
    xAxis,
    xAxisIds
  } = (0, _hooks.useXAxes)();
  const {
    yAxis,
    yAxisIds
  } = (0, _hooks.useYAxes)();
  const {
    zAxis,
    zAxisIds
  } = (0, _useZAxis.useZAxes)();
  const filteredYAxisIds = yAxisIds.filter(axisId => yAxis[axisId].colorMap !== undefined);
  const filteredXAxisIds = xAxisIds.filter(axisId => xAxis[axisId].colorMap !== undefined);
  const filteredZAxisIds = zAxisIds.filter(axisId => zAxis[axisId].colorMap !== undefined);
  if (filteredYAxisIds.length === 0 && filteredXAxisIds.length === 0 && filteredZAxisIds.length === 0) {
    return null;
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)("defs", {
    children: [filteredYAxisIds.map(axisId => {
      const gradientId = getGradientId(axisId);
      const objectBoundGradientId = getObjectBoundGradientId(axisId);
      const {
        colorMap,
        scale,
        colorScale,
        reverse
      } = yAxis[axisId];
      if (colorMap?.type === 'piecewise') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsPiecewiseGradient.default, {
          isReversed: !reverse,
          scale: scale,
          colorMap: colorMap,
          size: svgHeight,
          gradientId: gradientId,
          direction: "y"
        }, gradientId);
      }
      if (colorMap?.type === 'continuous') {
        return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradient.default, {
            isReversed: !reverse,
            scale: scale,
            colorScale: colorScale,
            colorMap: colorMap,
            size: svgHeight,
            gradientId: gradientId,
            direction: "y"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradientObjectBound.default, {
            isReversed: reverse,
            colorScale: colorScale,
            colorMap: colorMap,
            gradientId: objectBoundGradientId
          })]
        }, gradientId);
      }
      return null;
    }), filteredXAxisIds.map(axisId => {
      const gradientId = getGradientId(axisId);
      const objectBoundGradientId = getObjectBoundGradientId(axisId);
      const {
        colorMap,
        scale,
        reverse,
        colorScale
      } = xAxis[axisId];
      if (colorMap?.type === 'piecewise') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsPiecewiseGradient.default, {
          isReversed: reverse,
          scale: scale,
          colorMap: colorMap,
          size: svgWidth,
          gradientId: gradientId,
          direction: "x"
        }, gradientId);
      }
      if (colorMap?.type === 'continuous') {
        return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradient.default, {
            isReversed: reverse,
            scale: scale,
            colorScale: colorScale,
            colorMap: colorMap,
            size: svgWidth,
            gradientId: gradientId,
            direction: "x"
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradientObjectBound.default, {
            isReversed: reverse,
            colorScale: colorScale,
            colorMap: colorMap,
            gradientId: objectBoundGradientId
          })]
        }, gradientId);
      }
      return null;
    }), filteredZAxisIds.map(axisId => {
      const objectBoundGradientId = getObjectBoundGradientId(axisId);
      const {
        colorMap,
        colorScale
      } = zAxis[axisId];
      if (colorMap?.type === 'continuous') {
        return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsContinuousGradientObjectBound.default, {
          colorScale: colorScale,
          colorMap: colorMap,
          gradientId: objectBoundGradientId
        }, objectBoundGradientId);
      }
      return null;
    })]
  });
}