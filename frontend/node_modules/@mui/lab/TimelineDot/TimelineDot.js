"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _clsx = _interopRequireDefault(require("clsx"));
var _styles = require("@mui/material/styles");
var _utils = require("@mui/material/utils");
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _timelineDotClasses = require("./timelineDotClasses");
var _jsxRuntime = require("react/jsx-runtime");
const useUtilityClasses = ownerState => {
  const {
    color,
    variant,
    classes
  } = ownerState;
  const slots = {
    root: ['root', variant, color !== 'inherit' && `${variant}${(0, _utils.capitalize)(color)}`]
  };
  return (0, _composeClasses.default)(slots, _timelineDotClasses.getTimelineDotUtilityClass, classes);
};
const TimelineDotRoot = (0, _styles.styled)('span', {
  name: 'MuiTimelineDot',
  slot: 'Root',
  overridesResolver: (props, styles) => {
    const {
      ownerState
    } = props;
    return [styles.root, styles[ownerState.color !== 'inherit' && `${ownerState.variant}${(0, _utils.capitalize)(ownerState.color)}`], styles[ownerState.variant]];
  }
})(({
  ownerState,
  theme
}) => ({
  display: 'flex',
  alignSelf: 'baseline',
  borderStyle: 'solid',
  borderWidth: 2,
  padding: 4,
  borderRadius: '50%',
  boxShadow: (theme.vars || theme).shadows[1],
  margin: '11.5px 0',
  ...(ownerState.variant === 'filled' && {
    borderColor: 'transparent',
    ...(ownerState.color !== 'inherit' && {
      ...(ownerState.color === 'grey' ? {
        color: (theme.vars || theme).palette.grey[50],
        backgroundColor: (theme.vars || theme).palette.grey[400]
      } : {
        color: (theme.vars || theme).palette[ownerState.color].contrastText,
        backgroundColor: (theme.vars || theme).palette[ownerState.color].main
      })
    })
  }),
  ...(ownerState.variant === 'outlined' && {
    boxShadow: 'none',
    backgroundColor: 'transparent',
    ...(ownerState.color !== 'inherit' && {
      ...(ownerState.color === 'grey' ? {
        borderColor: (theme.vars || theme).palette.grey[400]
      } : {
        borderColor: (theme.vars || theme).palette[ownerState.color].main
      })
    })
  })
}));
const TimelineDot = /*#__PURE__*/React.forwardRef(function TimelineDot(inProps, ref) {
  const props = (0, _styles.useThemeProps)({
    props: inProps,
    name: 'MuiTimelineDot'
  });
  const {
    className,
    color = 'grey',
    variant = 'filled',
    ...other
  } = props;
  const ownerState = {
    ...props,
    color,
    variant
  };
  const classes = useUtilityClasses(ownerState);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(TimelineDotRoot, {
    className: (0, _clsx.default)(classes.root, className),
    ownerState: ownerState,
    ref: ref,
    ...other
  });
});
process.env.NODE_ENV !== "production" ? TimelineDot.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │    To update them, edit the d.ts file and run `pnpm proptypes`.     │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: _propTypes.default.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: _propTypes.default.object,
  /**
   * @ignore
   */
  className: _propTypes.default.string,
  /**
   * The dot can have a different colors.
   * @default 'grey'
   */
  color: _propTypes.default /* @typescript-to-proptypes-ignore */.oneOfType([_propTypes.default.oneOf(['error', 'grey', 'info', 'inherit', 'primary', 'secondary', 'success', 'warning']), _propTypes.default.string]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  /**
   * The dot can appear filled or outlined.
   * @default 'filled'
   */
  variant: _propTypes.default /* @typescript-to-proptypes-ignore */.oneOfType([_propTypes.default.oneOf(['filled', 'outlined']), _propTypes.default.string])
} : void 0;
var _default = exports.default = TimelineDot;