"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLabelMark = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _clsx = _interopRequireDefault(require("clsx"));
var _labelMarkClasses = require("./labelMarkClasses");
var _consumeThemeProps = require("../internals/consumeThemeProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["type", "color", "className", "classes"];
const Root = (0, _styles.styled)('div', {
  name: 'MuiChartsLabelMark',
  slot: 'Root'
})(() => {
  return {
    display: 'flex',
    width: 14,
    height: 14,
    [`&.${_labelMarkClasses.labelMarkClasses.line}`]: {
      width: 16,
      height: 'unset',
      alignItems: 'center',
      [`.${_labelMarkClasses.labelMarkClasses.mask}`]: {
        height: 4,
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden'
      }
    },
    [`&.${_labelMarkClasses.labelMarkClasses.square}`]: {
      height: 13,
      width: 13,
      borderRadius: 2,
      overflow: 'hidden'
    },
    [`&.${_labelMarkClasses.labelMarkClasses.circle}`]: {
      height: 15,
      width: 15
    },
    svg: {
      display: 'block'
    },
    [`& .${_labelMarkClasses.labelMarkClasses.mask} > *`]: {
      height: '100%',
      width: '100%'
    },
    [`& .${_labelMarkClasses.labelMarkClasses.mask}`]: {
      height: '100%',
      width: '100%'
    }
  };
});

/**
 * Generates the label mark for the tooltip and legend.
 * @ignore - internal component.
 */
const ChartsLabelMark = exports.ChartsLabelMark = (0, _consumeThemeProps.consumeThemeProps)('MuiChartsLabelMark', {
  defaultProps: {
    type: 'square'
  },
  classesResolver: _labelMarkClasses.useUtilityClasses
}, function ChartsLabelMark(props, ref) {
  const {
      type,
      color,
      className,
      classes
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const Component = type;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Root, (0, _extends2.default)({
    className: (0, _clsx.default)(classes?.root, className),
    ownerState: props,
    "aria-hidden": "true",
    ref: ref
  }, other, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes?.mask,
      children: typeof Component === 'function' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(Component, {
        className: classes?.fill,
        color: color
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
        viewBox: "0 0 24 24",
        preserveAspectRatio: type === 'line' ? 'none' : undefined,
        children: type === 'circle' ? /*#__PURE__*/(0, _jsxRuntime.jsx)("circle", {
          className: classes?.fill,
          r: "12",
          cx: "12",
          cy: "12",
          fill: color
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
          className: classes?.fill,
          width: "24",
          height: "24",
          fill: color
        })
      })
    })
  }));
});
process.env.NODE_ENV !== "production" ? ChartsLabelMark.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * The color of the mark.
   */
  color: _propTypes.default.string,
  /**
   * The type of the mark.
   * @default 'square'
   */
  type: _propTypes.default.oneOf(['circle', 'line', 'square'])
} : void 0;