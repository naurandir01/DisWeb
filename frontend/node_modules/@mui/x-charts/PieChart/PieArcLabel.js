"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PieArcLabel = void 0;
exports.getPieArcLabelUtilityClass = getPieArcLabelUtilityClass;
exports.pieArcLabelClasses = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _styles = require("@mui/material/styles");
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _animation = require("../internals/animation/animation");
var _useAnimatePieArcLabel = require("../hooks/animation/useAnimatePieArcLabel");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["id", "classes", "color", "startAngle", "endAngle", "paddingAngle", "arcLabelRadius", "innerRadius", "outerRadius", "cornerRadius", "formattedArcLabel", "isHighlighted", "isFaded", "style", "skipAnimation"];
function getPieArcLabelUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiPieArcLabel', slot);
}
const pieArcLabelClasses = exports.pieArcLabelClasses = (0, _generateUtilityClasses.default)('MuiPieArcLabel', ['root', 'highlighted', 'faded', 'animate', 'series']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isFaded,
    isHighlighted,
    skipAnimation
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded', !skipAnimation && 'animate']
  };
  return (0, _composeClasses.default)(slots, getPieArcLabelUtilityClass, classes);
};
const PieArcLabelRoot = (0, _styles.styled)('text', {
  name: 'MuiPieArcLabel',
  slot: 'Root'
})(({
  theme
}) => ({
  fill: (theme.vars || theme).palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'middle',
  pointerEvents: 'none',
  animationName: 'animate-opacity',
  animationDuration: '0s',
  animationTimingFunction: _animation.ANIMATION_TIMING_FUNCTION,
  [`&.${pieArcLabelClasses.animate}`]: {
    animationDuration: `${_animation.ANIMATION_DURATION_MS}ms`
  },
  '@keyframes animate-opacity': {
    from: {
      opacity: 0
    }
  }
}));
const PieArcLabel = exports.PieArcLabel = /*#__PURE__*/React.forwardRef(function PieArcLabel(props, ref) {
  const {
      id,
      classes: innerClasses,
      color,
      startAngle,
      endAngle,
      paddingAngle,
      arcLabelRadius,
      cornerRadius,
      formattedArcLabel,
      isHighlighted,
      isFaded,
      skipAnimation
    } = props,
    other = (0, _objectWithoutPropertiesLoose2.default)(props, _excluded);
  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    skipAnimation
  };
  const classes = useUtilityClasses(ownerState);
  const animatedProps = (0, _useAnimatePieArcLabel.useAnimatePieArcLabel)({
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius: arcLabelRadius,
    outerRadius: arcLabelRadius,
    paddingAngle,
    skipAnimation,
    ref
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(PieArcLabelRoot, (0, _extends2.default)({
    className: classes.root
  }, other, animatedProps, {
    children: formattedArcLabel
  }));
});
if (process.env.NODE_ENV !== "production") PieArcLabel.displayName = "PieArcLabel";
process.env.NODE_ENV !== "production" ? PieArcLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  arcLabelRadius: _propTypes.default.number.isRequired,
  classes: _propTypes.default.object,
  color: _propTypes.default.string.isRequired,
  cornerRadius: _propTypes.default.number.isRequired,
  endAngle: _propTypes.default.number.isRequired,
  formattedArcLabel: _propTypes.default.string,
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  innerRadius: _propTypes.default.number.isRequired,
  isFaded: _propTypes.default.bool.isRequired,
  isHighlighted: _propTypes.default.bool.isRequired,
  outerRadius: _propTypes.default.number.isRequired,
  paddingAngle: _propTypes.default.number.isRequired,
  skipAnimation: _propTypes.default.bool.isRequired,
  startAngle: _propTypes.default.number.isRequired
} : void 0;