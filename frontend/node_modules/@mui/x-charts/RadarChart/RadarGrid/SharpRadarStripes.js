"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharpRadarStripes = SharpRadarStripes;
var React = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
const getPath = (corners, center, outerRatio, innerRatio) => ['M', [...corners, corners[0]].map(({
  x,
  y
}) => `${center.x * (1 - outerRatio) + outerRatio * x} ${center.y * (1 - outerRatio) + outerRatio * y}`).join(' L '), 'L', [...corners, corners[0]].reverse().map(({
  x,
  y
}) => `${center.x * (1 - innerRatio) + innerRatio * x} ${center.y * (1 - innerRatio) + innerRatio * y}`).join(' L '), 'Z'].join(' ');

/**
 * @ignore - internal component.
 */
function SharpRadarStripes(props) {
  const {
    center,
    corners,
    divisions,
    stripeColor,
    classes
  } = props;
  const divisionRatio = Array.from({
    length: divisions
  }, (_, index) => (index + 1) / divisions);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
    children: divisionRatio.map((ratio, index) => {
      const smallerRatio = divisionRatio[index - 1] ?? 0;
      return /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
        d: getPath(corners, center, ratio, smallerRatio),
        stroke: "none",
        fill: stripeColor?.(index) ?? 'none',
        fillOpacity: 0.1,
        className: classes?.stripe
      }, ratio);
    })
  });
}