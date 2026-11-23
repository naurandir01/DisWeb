'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { useUtilityClasses } from "./chartsTooltipClasses.js";
import { ChartsTooltipCell, ChartsTooltipPaper, ChartsTooltipRow, ChartsTooltipTable } from "./ChartsTooltipTable.js";
import { useAxesTooltip } from "./useAxesTooltip.js";
import { ChartsLabelMark } from "../ChartsLabel/ChartsLabelMark.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function ChartsAxisTooltipContent(props) {
  const classes = useUtilityClasses(props.classes);
  const tooltipData = useAxesTooltip();
  if (tooltipData === null) {
    return null;
  }
  return /*#__PURE__*/_jsx(ChartsTooltipPaper, {
    sx: props.sx,
    className: classes.paper,
    children: tooltipData.map(({
      axisId,
      mainAxis,
      axisValue,
      axisFormattedValue,
      seriesItems
    }) => {
      return /*#__PURE__*/_jsxs(ChartsTooltipTable, {
        className: classes.table,
        children: [axisValue != null && !mainAxis.hideTooltip && /*#__PURE__*/_jsx(Typography, {
          component: "caption",
          children: axisFormattedValue
        }), /*#__PURE__*/_jsx("tbody", {
          children: seriesItems.map(({
            seriesId,
            color,
            formattedValue,
            formattedLabel,
            markType
          }) => {
            if (formattedValue == null) {
              return null;
            }
            return /*#__PURE__*/_jsxs(ChartsTooltipRow, {
              className: classes.row,
              children: [/*#__PURE__*/_jsxs(ChartsTooltipCell, {
                className: clsx(classes.labelCell, classes.cell),
                component: "th",
                children: [/*#__PURE__*/_jsx("div", {
                  className: classes.markContainer,
                  children: /*#__PURE__*/_jsx(ChartsLabelMark, {
                    type: markType,
                    color: color,
                    className: classes.mark
                  })
                }), formattedLabel || null]
              }), /*#__PURE__*/_jsx(ChartsTooltipCell, {
                className: clsx(classes.valueCell, classes.cell),
                component: "td",
                children: formattedValue
              })]
            }, seriesId);
          })
        })]
      }, axisId);
    })
  });
}
process.env.NODE_ENV !== "production" ? ChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { ChartsAxisTooltipContent };