"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadarMetricLabels = RadarMetricLabels;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _useRadarMetricData = require("./useRadarMetricData");
var _defaultTextPlacement = require("../../ChartsText/defaultTextPlacement");
var _ChartsText = require("../../ChartsText");
var _jsxRuntime = require("react/jsx-runtime");
function RadarMetricLabels() {
  const {
    corners
  } = (0, _useRadarMetricData.useRadarMetricData)();
  const theme = (0, _styles.useTheme)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
    children: corners.map(({
      x,
      y,
      angle,
      label
    }, i) => /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsText.ChartsText, {
      x: x,
      y: y,
      fontSize: 14,
      fill: (theme.vars || theme).palette.text.primary,
      stroke: "none",
      text: label,
      style: (0, _extends2.default)({}, theme.typography.caption, {
        fontSize: 12,
        lineHeight: 1.25,
        textAnchor: (0, _defaultTextPlacement.getDefaultTextAnchor)(180 + angle),
        dominantBaseline: (0, _defaultTextPlacement.getDefaultBaseline)(180 + angle)
      })
    }, i))
  });
}