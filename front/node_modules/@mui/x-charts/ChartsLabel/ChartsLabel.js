"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLabel = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _labelClasses = require("./labelClasses");
var _consumeThemeProps = require("../internals/consumeThemeProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["children", "className", "classes"];
/**
 * Generates the label mark for the tooltip and legend.
 * @ignore - internal component.
 */
const ChartsLabel = exports.ChartsLabel = (0, _consumeThemeProps.consumeThemeProps)('MuiChartsLabel', {
  classesResolver: _labelClasses.useUtilityClasses
}, function ChartsLabel(props, ref) {
  const {
      children,
      className,
      classes
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("span", (0, _extends2.default)({
    className: (0, _clsx.default)(classes?.root, className),
    ref: ref
  }, other, {
    children: children
  }));
});
process.env.NODE_ENV !== "production" ? ChartsLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object
} : void 0;