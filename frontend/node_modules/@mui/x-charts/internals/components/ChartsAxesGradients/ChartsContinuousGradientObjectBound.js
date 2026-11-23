"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = ChartsContinuousGradientObjectBound;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _d3Interpolate = require("@mui/x-charts-vendor/d3-interpolate");
var _jsxRuntime = require("react/jsx-runtime");
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
function ChartsContinuousGradientObjectBound(props) {
  const {
    isReversed,
    gradientId,
    colorScale,
    colorMap
  } = props;
  const extremumValues = [colorMap.min ?? 0, colorMap.max ?? 100];
  const interpolator = typeof extremumValues[0] === 'number' ? (0, _d3Interpolate.interpolateNumber)(extremumValues[0], extremumValues[1]) : (0, _d3Interpolate.interpolateDate)(extremumValues[0], extremumValues[1]);
  const numberOfPoints = PX_PRECISION;
  const keyPrefix = `${extremumValues[0]}-${extremumValues[1]}-`;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("linearGradient", (0, _extends2.default)({
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
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("stop", {
        offset: offset,
        stopColor: color,
        stopOpacity: 1
      }, keyPrefix + index);
    })
  }));
}