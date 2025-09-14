import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { interpolateDate, interpolateNumber } from '@mui/x-charts-vendor/d3-interpolate';
import { jsx as _jsx } from "react/jsx-runtime";
const PX_PRECISION = 10;
const getDirection = isReversed => {
  if (isReversed) {
    return {
      x1: '1',
      x2: '0',
      y1: '0',
      y2: '0'
    };
  }
  return {
    x1: '0',
    x2: '1',
    y1: '0',
    y2: '0'
  };
};

/**
 * Generates gradients to be used in tooltips and legends.
 */
export default function ChartsContinuousGradientObjectBound(props) {
  const {
    isReversed,
    gradientId,
    colorScale,
    colorMap
  } = props;
  const extremumValues = [colorMap.min ?? 0, colorMap.max ?? 100];
  const interpolator = typeof extremumValues[0] === 'number' ? interpolateNumber(extremumValues[0], extremumValues[1]) : interpolateDate(extremumValues[0], extremumValues[1]);
  const numberOfPoints = PX_PRECISION;
  const keyPrefix = `${extremumValues[0]}-${extremumValues[1]}-`;
  return /*#__PURE__*/_jsx("linearGradient", _extends({
    id: gradientId
  }, getDirection(isReversed), {
    gradientUnits: 'objectBoundingBox' // Use the SVG coordinate instead of the component ones.
    ,
    children: Array.from({
      length: numberOfPoints + 1
    }, (_, index) => {
      const offset = index / numberOfPoints;
      const value = interpolator(offset);
      if (value === undefined) {
        return null;
      }
      const color = colorScale(value);
      if (color === null) {
        return null;
      }
      return /*#__PURE__*/_jsx("stop", {
        offset: offset,
        stopColor: color,
        stopOpacity: 1
      }, keyPrefix + index);
    })
  }));
}