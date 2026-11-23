"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.RadarGrid = RadarGrid;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _useRadarGridData = require("./useRadarGridData");
var _SharpRadarGrid = require("./SharpRadarGrid");
var _CircularRadarGrid = require("./CircularRadarGrid");
var _SharpRadarStripes = require("./SharpRadarStripes");
var _CircularRadarStripes = require("./CircularRadarStripes");
var _radarGridClasses = require("./radarGridClasses");
var _jsxRuntime = require("react/jsx-runtime");
function RadarGrid(props) {
  const theme = (0, _styles.useTheme)();
  const {
    divisions = 5,
    shape = 'sharp',
    stripeColor = index => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
  } = props;
  const gridData = (0, _useRadarGridData.useRadarGridData)();
  const classes = (0, _radarGridClasses.useUtilityClasses)(props.classes);
  if (gridData === null) {
    return null;
  }
  const {
    center,
    corners,
    radius
  } = gridData;
  return shape === 'sharp' ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [stripeColor && /*#__PURE__*/(0, _jsxRuntime.jsx)(_SharpRadarStripes.SharpRadarStripes, {
      divisions: divisions,
      corners: corners,
      center: center,
      radius: radius,
      stripeColor: stripeColor,
      classes: classes
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_SharpRadarGrid.SharpRadarGrid, {
      divisions: divisions,
      corners: corners,
      center: center,
      radius: radius,
      strokeColor: (theme.vars || theme).palette.text.primary,
      classes: classes
    })]
  }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [stripeColor && /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularRadarStripes.CircularRadarStripes, {
      divisions: divisions,
      corners: corners,
      center: center,
      radius: radius,
      stripeColor: stripeColor,
      classes: classes
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularRadarGrid.CircularRadarGrid, {
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
  classes: _propTypes.default.object,
  /**
   * The number of divisions in the radar grid.
   * @default 5
   */
  divisions: _propTypes.default.number,
  /**
   * The grid shape.
   * @default 'sharp'
   */
  shape: _propTypes.default.oneOf(['circular', 'sharp']),
  /**
   * Get stripe fill color. Set it to `null` to remove stripes
   * @param {number} index The index of the stripe band.
   * @returns {string} The color to fill the stripe.
   * @default (index) => index % 2 === 1 ? (theme.vars || theme).palette.text.secondary : 'none'
   */
  stripeColor: _propTypes.default.func
} : void 0;