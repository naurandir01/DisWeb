'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { ChartsXAxis } from "../ChartsXAxis/index.js";
import { ChartsYAxis } from "../ChartsYAxis/index.js";
import { useXAxes, useYAxes } from "../hooks/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
  } = useXAxes();
  const {
    yAxisIds,
    yAxis
  } = useYAxes();
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [xAxisIds.map(axisId => {
      if (!xAxis[axisId].position || xAxis[axisId].position === 'none') {
        return null;
      }
      return /*#__PURE__*/_jsx(ChartsXAxis, {
        slots: slots,
        slotProps: slotProps,
        axisId: axisId
      }, axisId);
    }), yAxisIds.map(axisId => {
      if (!yAxis[axisId].position || yAxis[axisId].position === 'none') {
        return null;
      }
      return /*#__PURE__*/_jsx(ChartsYAxis, {
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
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object
} : void 0;
export { ChartsAxis };