"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxis = ChartsAxis;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _ChartsXAxis = require("../ChartsXAxis");
var _ChartsYAxis = require("../ChartsYAxis");
var _hooks = require("../hooks");
var _jsxRuntime = require("react/jsx-runtime");
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsAxis API](https://mui.com/x/api/charts/charts-axis/)
 */
function ChartsAxis(props) {
  const {
    slots,
    slotProps
  } = props;
  const {
    xAxisIds,
    xAxis
  } = (0, _hooks.useXAxes)();
  const {
    yAxisIds,
    yAxis
  } = (0, _hooks.useYAxes)();
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [xAxisIds.map(axisId => {
      if (!xAxis[axisId].position || xAxis[axisId].position === 'none') {
        return null;
      }
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsXAxis.ChartsXAxis, {
        slots: slots,
        slotProps: slotProps,
        axisId: axisId
      }, axisId);
    }), yAxisIds.map(axisId => {
      if (!yAxis[axisId].position || yAxis[axisId].position === 'none') {
        return null;
      }
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartsYAxis.ChartsYAxis, {
        slots: slots,
        slotProps: slotProps,
        axisId: axisId
      }, axisId);
    })]
  });
}
process.env.NODE_ENV !== "production" ? ChartsAxis.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: _propTypes.default.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: _propTypes.default.object
} : void 0;