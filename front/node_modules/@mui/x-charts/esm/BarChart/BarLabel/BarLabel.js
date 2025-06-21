'use client';

import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
import _extends from "@babel/runtime/helpers/esm/extends";
const _excluded = ["seriesId", "dataIndex", "color", "isFaded", "isHighlighted", "classes", "skipAnimation", "layout", "xOrigin", "yOrigin"];
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useAnimateBarLabel } from "../../hooks/animation/useAnimateBarLabel.js";
import { barLabelClasses } from "./barLabelClasses.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const BarLabelComponent = styled('text', {
  name: 'MuiBarLabel',
  slot: 'Root',
  overridesResolver: (_, styles) => [{
    [`&.${barLabelClasses.faded}`]: styles.faded
  }, {
    [`&.${barLabelClasses.highlighted}`]: styles.highlighted
  }, styles.root]
})(({
  theme
}) => _extends({}, theme?.typography?.body2, {
  stroke: 'none',
  fill: (theme.vars || theme)?.palette?.text?.primary,
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
  textAnchor: 'middle',
  dominantBaseline: 'central',
  pointerEvents: 'none',
  opacity: 1,
  [`&.${barLabelClasses.faded}`]: {
    opacity: 0.3
  }
}));
function BarLabel(inProps) {
  const props = useThemeProps({
    props: inProps,
    name: 'MuiBarLabel'
  });
  const otherProps = _objectWithoutPropertiesLoose(props, _excluded);
  const animatedProps = useAnimateBarLabel(props);
  return /*#__PURE__*/_jsx(BarLabelComponent, _extends({}, otherProps, animatedProps));
}
process.env.NODE_ENV !== "production" ? BarLabel.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  dataIndex: PropTypes.number.isRequired,
  /**
   * Height of the bar this label belongs to.
   */
  height: PropTypes.number.isRequired,
  isFaded: PropTypes.bool.isRequired,
  isHighlighted: PropTypes.bool.isRequired,
  layout: PropTypes.oneOf(['horizontal', 'vertical']).isRequired,
  seriesId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  skipAnimation: PropTypes.bool.isRequired,
  /**
   * Width of the bar this label belongs to.
   */
  width: PropTypes.number.isRequired,
  /**
   * Position in the x-axis of the bar this label belongs to.
   */
  x: PropTypes.number.isRequired,
  /**
   * The x-coordinate of the stack this bar label belongs to.
   */
  xOrigin: PropTypes.number.isRequired,
  /**
   * Position in the y-axis of the bar this label belongs to.
   */
  y: PropTypes.number.isRequired,
  /**
   * The y-coordinate of the stack this bar label belongs to.
   */
  yOrigin: PropTypes.number.isRequired
} : void 0;
export { BarLabel };