import * as React from 'react';
import { useDrawingArea, useXAxes, useYAxes } from "../../../hooks/index.js";
import ChartsPiecewiseGradient from "./ChartsPiecewiseGradient.js";
import ChartsContinuousGradient from "./ChartsContinuousGradient.js";
import ChartsContinuousGradientObjectBound from "./ChartsContinuousGradientObjectBound.js";
import { useZAxes } from "../../../hooks/useZAxis.js";
import { useChartGradientIdBuilder, useChartGradientIdObjectBoundBuilder } from "../../../hooks/useChartGradientId.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function ChartsAxesGradients() {
  const {
    top,
    height,
    bottom,
    left,
    width,
    right
  } = useDrawingArea();
  const svgHeight = top + height + bottom;
  const svgWidth = left + width + right;
  const getGradientId = useChartGradientIdBuilder();
  const getObjectBoundGradientId = useChartGradientIdObjectBoundBuilder();
  const {
    xAxis,
    xAxisIds
  } = useXAxes();
  const {
    yAxis,
    yAxisIds
  } = useYAxes();
  const {
    zAxis,
    zAxisIds
  } = useZAxes();
  const filteredYAxisIds = yAxisIds.filter(axisId => yAxis[axisId].colorMap !== undefined);
  const filteredXAxisIds = xAxisIds.filter(axisId => xAxis[axisId].colorMap !== undefined);
  const filteredZAxisIds = zAxisIds.filter(axisId => zAxis[axisId].colorMap !== undefined);
  if (filteredYAxisIds.length === 0 && filteredXAxisIds.length === 0 && filteredZAxisIds.length === 0) {
    return null;
  }
  return /*#__PURE__*/_jsxs("defs", {
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
        return /*#__PURE__*/_jsx(ChartsPiecewiseGradient, {
          isReversed: !reverse,
          scale: scale,
          colorMap: colorMap,
          size: svgHeight,
          gradientId: gradientId,
          direction: "y"
        }, gradientId);
      }
      if (colorMap?.type === 'continuous') {
        return /*#__PURE__*/_jsxs(React.Fragment, {
          children: [/*#__PURE__*/_jsx(ChartsContinuousGradient, {
            isReversed: !reverse,
            scale: scale,
            colorScale: colorScale,
            colorMap: colorMap,
            size: svgHeight,
            gradientId: gradientId,
            direction: "y"
          }), /*#__PURE__*/_jsx(ChartsContinuousGradientObjectBound, {
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
        return /*#__PURE__*/_jsx(ChartsPiecewiseGradient, {
          isReversed: reverse,
          scale: scale,
          colorMap: colorMap,
          size: svgWidth,
          gradientId: gradientId,
          direction: "x"
        }, gradientId);
      }
      if (colorMap?.type === 'continuous') {
        return /*#__PURE__*/_jsxs(React.Fragment, {
          children: [/*#__PURE__*/_jsx(ChartsContinuousGradient, {
            isReversed: reverse,
            scale: scale,
            colorScale: colorScale,
            colorMap: colorMap,
            size: svgWidth,
            gradientId: gradientId,
            direction: "x"
          }), /*#__PURE__*/_jsx(ChartsContinuousGradientObjectBound, {
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
        return /*#__PURE__*/_jsx(ChartsContinuousGradientObjectBound, {
          colorScale: colorScale,
          colorMap: colorMap,
          gradientId: objectBoundGradientId
        }, objectBoundGradientId);
      }
      return null;
    })]
  });
}