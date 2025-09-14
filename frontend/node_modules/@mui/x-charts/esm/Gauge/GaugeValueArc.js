'use client';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["cx", "cy", "startAngle", "endAngle", "cornerRadius", "innerRadius", "outerRadius", "skipAnimation"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useSkipAnimation } from "../hooks/useSkipAnimation.js";
import { useAnimateGaugeValueArc } from "../hooks/animation/useAnimateGaugeValueArc.js";
import { useGaugeState } from "./GaugeProvider.js";
import { jsx as _jsx } from "react/jsx-runtime";
const StyledPath = styled('path', {
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
  } = useGaugeState();
  if (value === null) {
    return null;
  }
  const valueAngle = startAngle + (value - valueMin) / (valueMax - valueMin) * (endAngle - startAngle);
  return /*#__PURE__*/_jsx(AnimatedGaugeValueArc, _extends({}, props, {
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
  skipAnimation: PropTypes.bool
} : void 0;
export { GaugeValueArc };
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
    other = _objectWithoutPropertiesLoose(_ref, _excluded);
  const skipAnimation = useSkipAnimation(inSkipAnimation);
  const animatedProps = useAnimateGaugeValueArc({
    startAngle,
    endAngle,
    cornerRadius,
    innerRadius,
    outerRadius,
    skipAnimation
  });
  return /*#__PURE__*/_jsx(StyledPath, _extends({}, animatedProps, {
    transform: `translate(${cx}, ${cy})`
  }, other));
}
process.env.NODE_ENV !== "production" ? AnimatedGaugeValueArc.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  cornerRadius: PropTypes.number.isRequired,
  cx: PropTypes.number.isRequired,
  cy: PropTypes.number.isRequired,
  endAngle: PropTypes.number.isRequired,
  innerRadius: PropTypes.number.isRequired,
  outerRadius: PropTypes.number.isRequired,
  skipAnimation: PropTypes.bool,
  startAngle: PropTypes.number.isRequired
} : void 0;