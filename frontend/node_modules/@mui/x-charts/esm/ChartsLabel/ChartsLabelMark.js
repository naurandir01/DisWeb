'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["type", "color", "className", "classes"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import clsx from 'clsx';
import { labelMarkClasses, useUtilityClasses } from "./labelMarkClasses.js";
import { consumeThemeProps } from "../internals/consumeThemeProps.js";
import { jsx as _jsx } from "react/jsx-runtime";
const Root = styled('div', {
  name: 'MuiChartsLabelMark',
  slot: 'Root'
})(() => {
  return {
    display: 'flex',
    width: 14,
    height: 14,
    [`&.${labelMarkClasses.line}`]: {
      width: 16,
      height: 'unset',
      alignItems: 'center',
      [`.${labelMarkClasses.mask}`]: {
        height: 4,
        width: '100%',
        borderRadius: 1,
        overflow: 'hidden'
      }
    },
    [`&.${labelMarkClasses.square}`]: {
      height: 13,
      width: 13,
      borderRadius: 2,
      overflow: 'hidden'
    },
    [`&.${labelMarkClasses.circle}`]: {
      height: 15,
      width: 15
    },
    svg: {
      display: 'block'
    },
    [`& .${labelMarkClasses.mask} > *`]: {
      height: '100%',
      width: '100%'
    },
    [`& .${labelMarkClasses.mask}`]: {
      height: '100%',
      width: '100%'
    }
  };
});

/**
 * Generates the label mark for the tooltip and legend.
 * @ignore - internal component.
 */
const ChartsLabelMark = consumeThemeProps('MuiChartsLabelMark', {
  defaultProps: {
    type: 'square'
  },
  classesResolver: useUtilityClasses
}, function ChartsLabelMark(props, ref) {
  const {
      type,
      color,
      className,
      classes
    } = props,
    other = _objectWithoutPropertiesLoose(props, _excluded);
  const Component = type;
  return /*#__PURE__*/_jsx(Root, _extends({
    className: clsx(classes?.root, className),
    ownerState: props,
    "aria-hidden": "true",
    ref: ref
  }, other, {
    children: /*#__PURE__*/_jsx("div", {
      className: classes?.mask,
      children: typeof Component === 'function' ? /*#__PURE__*/_jsx(Component, {
        className: classes?.fill,
        color: color
      }) : /*#__PURE__*/_jsx("svg", {
        viewBox: "0 0 24 24",
        preserveAspectRatio: type === 'line' ? 'none' : undefined,
        children: type === 'circle' ? /*#__PURE__*/_jsx("circle", {
          className: classes?.fill,
          r: "12",
          cx: "12",
          cy: "12",
          fill: color
        }) : /*#__PURE__*/_jsx("rect", {
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
  classes: PropTypes.object,
  /**
   * The color of the mark.
   */
  color: PropTypes.string,
  /**
   * The type of the mark.
   * @default 'square'
   */
  type: PropTypes.oneOf(['circle', 'line', 'square'])
} : void 0;
export { ChartsLabelMark };