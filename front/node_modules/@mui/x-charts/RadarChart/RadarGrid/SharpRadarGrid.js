"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SharpRadarGrid = SharpRadarGrid;
var React = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function SharpRadarGrid(props) {
  const {
    center,
    corners,
    divisions,
    strokeColor,
    classes
  } = props;
  const divisionRatio = Array.from({
    length: divisions
  }, (_, index) => (index + 1) / divisions);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [corners.map(({
      x,
      y
    }, i) => /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      d: `M ${center.x} ${center.y} L ${x} ${y}`,
      stroke: strokeColor,
      strokeWidth: 1,
      strokeOpacity: 0.3,
      fill: "none",
      className: classes?.radial
    }, i)), divisionRatio.map(ratio => /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      d: `M ${corners.map(({
        x,
        y
      }) => `${center.x * (1 - ratio) + ratio * x} ${center.y * (1 - ratio) + ratio * y}`).join(' L ')} Z`,
      stroke: strokeColor,
      strokeWidth: 1,
      strokeOpacity: 0.3,
      fill: "none",
      className: classes?.divider
    }, ratio))]
  });
}