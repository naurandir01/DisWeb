"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.BarLabel = BarLabel;
exports.BarLabelComponent = void 0;
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _propTypes = _interopRequireDefault(require("prop-types"));
var _useAnimateBarLabel = require("../../hooks/animation/useAnimateBarLabel");
var _barLabelClasses = require("./barLabelClasses");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["seriesId", "dataIndex", "color", "isFaded", "isHighlighted", "classes", "skipAnimation", "layout", "xOrigin", "yOrigin"];
const BarLabelComponent = exports.BarLabelComponent = (0, _styles.styled)('text', {
  name: 'MuiBarLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => [{
    [`&.${_barLabelClasses.barLabelClasses.faded}`]: styles.faded
  }, {
    [`&.${_barLabelClasses.barLabelClasses.highlighted}`]: styles.highlighted
  }, styles.root]
})(({
  theme
}) => (0, _extends2.default)({}, theme?.typography?.body2, {
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
  opacity: 1,
  [`&.${_barLabelClasses.barLabelClasses.faded}`]: {
    opacity: 0.3
  }
}));
function BarLabel(inProps) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiBarLabel'
  });
  const otherProps = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const animatedProps = (0, _useAnimateBarLabel.useAnimateBarLabel)(props);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(BarLabelComponent, (0, _extends2.default)({}, otherProps, animatedProps));
}
process.env.NODE_ENV !== "production" ? BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: _propTypes.default.object,
  dataIndex: _propTypes.default.number.isRequired,
  /**
   * Height of the bar this label belongs to.
   */
  height: _propTypes.default.number.isRequired,
  isFaded: _propTypes.default.bool.isRequired,
  isHighlighted: _propTypes.default.bool.isRequired,
  layout: _propTypes.default.oneOf(['horizontal', 'vertical']).isRequired,
  seriesId: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  skipAnimation: _propTypes.default.bool.isRequired,
  /**
   * Width of the bar this label belongs to.
   */
  width: _propTypes.default.number.isRequired,
  /**
   * Position in the x-axis of the bar this label belongs to.
   */
  x: _propTypes.default.number.isRequired,
  /**
   * The x-coordinate of the stack this bar label belongs to.
   */
  xOrigin: _propTypes.default.number.isRequired,
  /**
   * Position in the y-axis of the bar this label belongs to.
   */
  y: _propTypes.default.number.isRequired,
  /**
   * The y-coordinate of the stack this bar label belongs to.
   */
  yOrigin: _propTypes.default.number.isRequired
} : void 0;