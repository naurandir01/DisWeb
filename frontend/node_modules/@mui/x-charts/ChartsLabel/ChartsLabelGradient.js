"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLabelGradient = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _clsx = _interopRequireDefault(require("clsx"));
var _RtlProvider = require("@mui/system/RtlProvider");
var _labelGradientClasses = require("./labelGradientClasses");
var _consumeThemeProps = require("../internals/consumeThemeProps");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["gradientId", "direction", "classes", "className", "rotate", "reverse", "thickness"];
const getRotation = (direction, reverse, rotate, isRtl) => {
  const angle = (direction === 'vertical' ? -90 : 0) + (rotate ? 90 : 0) + (reverse ? 180 : 0);
  if (isRtl && direction !== 'vertical') {
    return angle + 180;
  }
  return angle;
};
const Root = (0, _styles.styled)('div', {
  name: 'MuiChartsLabelGradient',
  slot: 'Root'
})(({
  ownerState
}) => {
  const rotation = getRotation(ownerState.direction, ownerState.reverse, ownerState.rotate, ownerState.isRtl);
  return {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    [`.${_labelGradientClasses.labelGradientClasses.mask}`]: {
      borderRadius: 2,
      overflow: 'hidden'
    },
    [`&.${_labelGradientClasses.labelGradientClasses.horizontal}`]: {
      width: '100%',
      [`.${_labelGradientClasses.labelGradientClasses.mask}`]: {
        height: ownerState.thickness,
        width: '100%'
      }
    },
    [`&.${_labelGradientClasses.labelGradientClasses.vertical}`]: {
      height: '100%',
      [`.${_labelGradientClasses.labelGradientClasses.mask}`]: {
        width: ownerState.thickness,
        height: '100%',
        '> svg': {
          height: '100%'
        }
      }
    },
    svg: {
      transform: `rotate(${rotation}deg)`,
      display: 'block'
    }
  };
});

/**
 * Generates the label Gradient for the tooltip and legend.
 * @ignore - internal component.
 */
const ChartsLabelGradient = exports.ChartsLabelGradient = (0, _consumeThemeProps.consumeThemeProps)('MuiChartsLabelGradient', {
  defaultProps: {
    direction: 'horizontal',
    thickness: 12
  },
  classesResolver: _labelGradientClasses.useUtilityClasses
}, function ChartsLabelGradient(props, ref) {
  const {
      gradientId,
      classes,
      className
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const isRtl = (0, _RtlProvider.useRtl)();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(Root, (0, _extends2.default)({
    className: (0, _clsx.default)(classes?.root, className),
    ownerState: (0, _extends2.default)({}, props, {
      isRtl
    }),
    "aria-hidden": "true",
    ref: ref
  }, other, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      className: classes?.mask,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)("svg", {
        viewBox: "0 0 24 24",
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)("rect", {
          className: classes?.fill,
          width: "24",
          height: "24",
          fill: `url(#${gradientId})`
        })
      })
    })
  }));
});
process.env.NODE_ENV !== "production" ? ChartsLabelGradient.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * The direction of the gradient.
   * @default 'horizontal'
   */
  direction: _propTypes.default.oneOf(['vertical', 'horizontal']),
  /**
   * A unique identifier for the gradient.
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   */
  gradientId: _propTypes.default.string.isRequired,
  /**
   * If `true`, the gradient will be reversed.
   */
  reverse: _propTypes.default.bool,
  /**
   * If provided, the gradient will be rotated by 90deg.
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotate: _propTypes.default.bool,
  /**
   * The thickness of the gradient
   * @default 12
   */
  thickness: _propTypes.default.number
} : void 0;