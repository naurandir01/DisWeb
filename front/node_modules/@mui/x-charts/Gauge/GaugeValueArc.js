"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.GaugeValueArc = GaugeValueArc;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _useSkipAnimation = require("../hooks/useSkipAnimation");
var _useAnimateGaugeValueArc = require("../hooks/animation/useAnimateGaugeValueArc");
var _GaugeProvider = require("./GaugeProvider");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["cx", "cy", "startAngle", "endAngle", "cornerRadius", "innerRadius", "outerRadius", "skipAnimation"];
const StyledPath = (0, _styles.styled)('path', {
  name: 'MuiGauge',
  slot: 'ReferenceArc'
})(({
  theme
}) => ({
  fill: (theme.vars || theme).palette.primary.main
}));
function GaugeValueArc(props) {
  const {
    value,
    valueMin,
    valueMax,
    startAngle,
    endAngle,
    outerRadius,
    innerRadius,
    cornerRadius,
    cx,
    cy
  } = (0, _GaugeProvider.useGaugeState)();
  if (value === null) {
    return null;
  }
  const valueAngle = startAngle + (value - valueMin) / (valueMax - valueMin) * (endAngle - startAngle);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedGaugeValueArc, (0, _extends2.default)({}, props, {
    cx: cx,
    cy: cy,
    startAngle: startAngle,
    endAngle: valueAngle,
    cornerRadius: cornerRadius,
    innerRadius: innerRadius,
    outerRadius: outerRadius
  }));
}
process.env.NODE_ENV !== "production" ? GaugeValueArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  skipAnimation: _propTypes.default.bool
} : void 0;
function AnimatedGaugeValueArc(_ref) {
  let {
      cx,
      cy,
      startAngle,
      endAngle,
      cornerRadius,
      innerRadius,
      outerRadius,
      skipAnimation: inSkipAnimation
    } = _ref,
    other = (0, _objectWithoutPropertiesLoose2.default)(_ref, _excluded);
  const skipAnimation = (0, _useSkipAnimation.useSkipAnimation)(inSkipAnimation);
  const animatedProps = (0, _useAnimateGaugeValueArc.useAnimateGaugeValueArc)({
    startAngle,
    endAngle,
    cornerRadius,
    innerRadius,
    outerRadius,
    skipAnimation
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(StyledPath, (0, _extends2.default)({}, animatedProps, {
    transform: `translate(${cx}, ${cy})`
  }, other));
}
process.env.NODE_ENV !== "production" ? AnimatedGaugeValueArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  cornerRadius: _propTypes.default.number.isRequired,
  cx: _propTypes.default.number.isRequired,
  cy: _propTypes.default.number.isRequired,
  endAngle: _propTypes.default.number.isRequired,
  innerRadius: _propTypes.default.number.isRequired,
  outerRadius: _propTypes.default.number.isRequired,
  skipAnimation: _propTypes.default.bool,
  startAngle: _propTypes.default.number.isRequired
} : void 0;