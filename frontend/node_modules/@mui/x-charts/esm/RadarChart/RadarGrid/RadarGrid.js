import * as React from 'react';
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import { useRadarGridData } from "./useRadarGridData.js";
import { SharpRadarGrid } from "./SharpRadarGrid.js";
import { CircularRadarGrid } from "./CircularRadarGrid.js";
import { SharpRadarStripes } from "./SharpRadarStripes.js";
import { CircularRadarStripes } from "./CircularRadarStripes.js";
import { useUtilityClasses } from "./radarGridClasses.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function RadarGrid(props) {
  const theme = useTheme();
  const {
    divisions = 5,
    shape = 'sharp',
    stripeColor = index => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
  } = props;
  const gridData = useRadarGridData();
  const classes = useUtilityClasses(props.classes);
  if (gridData === null) {
    return null;
  }
  const {
    center,
    corners,
    radius
  } = gridData;
  return shape === 'sharp' ? /*#__PURE__*/_jsxs(React.Fragment, {
    children: [stripeColor && /*#__PURE__*/_jsx(SharpRadarStripes, {
      divisions: divisions,
      corners: corners,
      center: center,
      radius: radius,
      stripeColor: stripeColor,
      classes: classes
    }), /*#__PURE__*/_jsx(SharpRadarGrid, {
      divisions: divisions,
      corners: corners,
      center: center,
      radius: radius,
      strokeColor: (theme.vars || theme).palette.text.primary,
      classes: classes
    })]
  }) : /*#__PURE__*/_jsxs(React.Fragment, {
    children: [stripeColor && /*#__PURE__*/_jsx(CircularRadarStripes, {
      divisions: divisions,
      corners: corners,
      center: center,
      radius: radius,
      stripeColor: stripeColor,
      classes: classes
    }), /*#__PURE__*/_jsx(CircularRadarGrid, {
      divisions: divisions,
      corners: corners,
      center: center,
      radius: radius,
      strokeColor: (theme.vars || theme).palette.text.primary,
      classes: classes
    })]
  });
}
process.env.NODE_ENV !== "production" ? RadarGrid.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions: PropTypes.number,
  /**
   * The grid shape.
   * @default 'sharp'
   */
  shape: PropTypes.oneOf(['circular', 'sharp']),
  /**
   * Get stripe fill color. Set it to `null` to remove stripes
   * @param {number} index The index of the stripe band.
   * @returns {string} The color to fill the stripe.
   * @default (index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
   */
  stripeColor: PropTypes.func
} : void 0;
export { RadarGrid };