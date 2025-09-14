'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["children", "className", "classes"];
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { useUtilityClasses } from "./labelClasses.js";
import { consumeThemeProps } from "../internals/consumeThemeProps.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * Generates the label mark for the tooltip and legend.
 * @ignore - internal component.
 */
const ChartsLabel = consumeThemeProps('MuiChartsLabel', {
  classesResolver: useUtilityClasses
}, function ChartsLabel(props, ref) {
  const {
      children,
      className,
      classes
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  return /*#__PURE__*/_jsx("span", _extends({
    className: clsx(classes?.root, className),
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
  children: PropTypes.node,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object
} : void 0;
export { ChartsLabel };