"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CircularRadarGrid = CircularRadarGrid;
var React = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
/**
 * @ignore - internal component.
 */
function CircularRadarGrid(props) {
  const {
    center,
    corners,
    divisions,
    radius,
    strokeColor,
    classes
  } = props;
  const divisionRadius = Array.from({
    length: divisions
  }, (_, index) => radius * (index + 1) / divisions);
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
    }, i)), divisionRadius.map(r => /*#__PURE__*/(0, _jsxRuntime.jsx)("circle", {
      cx: center.x,
      cy: center.y,
      r: r,
      stroke: strokeColor,
      strokeWidth: 1,
      strokeOpacity: 0.3,
      fill: "none",
      className: classes?.divider
    }, r))]
  });
}