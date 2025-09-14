'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["x", "y", "id", "classes", "color", "shape"];
import * as React from 'react';
import PropTypes from 'prop-types';
import reactMajor from '@mui/x-internals/reactMajor';
import { symbol as d3Symbol, symbolsFill as d3SymbolsFill } from '@mui/x-charts-vendor/d3-shape';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { getSymbol } from "../internals/getSymbol.js";
import { jsx as _jsx } from "react/jsx-runtime";
export function getHighlightElementUtilityClass(slot) {
  return generateUtilityClass('MuiHighlightElement', slot);
}
export const lineHighlightElementClasses = generateUtilityClasses('MuiHighlightElement', ['root']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`]
  };
  return composeClasses(slots, getHighlightElementUtilityClass, classes);
};
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [LineHighlightElement API](https://mui.com/x/api/charts/line-highlight-element/)
 */
function LineHighlightElement(props) {
  const {
      x,
      y,
      color,
      shape
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const classes = useUtilityClasses(props);
  const Element = shape === 'circle' ? 'circle' : 'path';
  const additionalProps = shape === 'circle' ? {
    cx: 0,
    cy: 0,
    r: other.r === undefined ? 5 : other.r
  } : {
    d: d3Symbol(d3SymbolsFill[getSymbol(shape)])()
  };

  // React 18 does not recognize `transformOrigin` and React 19 does not recognize `transform-origin`
  const transformOrigin = reactMajor > 18 ? {
    transformOrigin: `${x} ${y}`
  } : {
    'transform-origin': `${x} ${y}`
  };
  return /*#__PURE__*/_jsx(Element, _extends({
    pointerEvents: "none",
    className: classes.root,
    transform: `translate(${x} ${y})`,
    fill: color
  }, transformOrigin, additionalProps, other));
}
process.env.NODE_ENV !== "production" ? LineHighlightElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  shape: PropTypes.oneOf(['circle', 'cross', 'diamond', 'square', 'star', 'triangle', 'wye']).isRequired
} : void 0;
export { LineHighlightElement };