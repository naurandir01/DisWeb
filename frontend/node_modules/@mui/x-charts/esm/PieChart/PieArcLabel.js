'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["id", "classes", "color", "startAngle", "endAngle", "paddingAngle", "arcLabelRadius", "innerRadius", "outerRadius", "cornerRadius", "formattedArcLabel", "isHighlighted", "isFaded", "style", "skipAnimation"];
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from "../internals/animation/animation.js";
import { useAnimatePieArcLabel } from "../hooks/animation/useAnimatePieArcLabel.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function getPieArcLabelUtilityClass(slot) {
  return generateUtilityClass('MuiPieArcLabel', slot);
}
export const pieArcLabelClasses = generateUtilityClasses('MuiPieArcLabel', ['root', 'highlighted', 'faded', 'animate', 'series']);
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
  return composeClasses(slots, getPieArcLabelUtilityClass, classes);
};
const PieArcLabelRoot = styled('text', {
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
  animationTimingFunction: ANIMATION_TIMING_FUNCTION,
  [`&.${pieArcLabelClasses.animate}`]: {
    animationDuration: `${ANIMATION_DURATION_MS}ms`
  },
  '@keyframes animate-opacity': {
    from: {
      opacity: 0
    }
  }
}));
const PieArcLabel = /*#__PURE__*/React.forwardRef(function PieArcLabel(props, ref) {
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
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const ownerState = {
    id,
    classes: innerClasses,
    color,
    isFaded,
    isHighlighted,
    skipAnimation
  };
  const classes = useUtilityClasses(ownerState);
  const animatedProps = useAnimatePieArcLabel({
    cornerRadius,
    startAngle,
    endAngle,
    innerRadius: arcLabelRadius,
    outerRadius: arcLabelRadius,
    paddingAngle,
    skipAnimation,
    ref
  });
  return /*#__PURE__*/_jsx(PieArcLabelRoot, _extends({
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
  arcLabelRadius: PropTypes.number.isRequired,
  classes: PropTypes.object,
  color: PropTypes.string.isRequired,
  cornerRadius: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  formattedArcLabel: PropTypes.string,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  innerRadius: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  outerRadius: PropTypes.number.isRequired,
  paddingAngle: PropTypes.number.isRequired,
  skipAnimation: PropTypes.bool.isRequired,
  startAngle: PropTypes.number.isRequired
} : void 0;
export { PieArcLabel };