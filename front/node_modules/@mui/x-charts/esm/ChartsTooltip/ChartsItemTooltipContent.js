'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import Typography from '@mui/material/Typography';
import { useUtilityClasses } from "./chartsTooltipClasses.js";
import { useInternalItemTooltip } from "./useItemTooltip.js";
import { ChartsTooltipCell, ChartsTooltipPaper, ChartsTooltipRow, ChartsTooltipTable } from "./ChartsTooltipTable.js";
import { ChartsLabelMark } from "../ChartsLabel/ChartsLabelMark.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function ChartsItemTooltipContent(props) {
  const {
    classes: propClasses,
    sx
  } = props;
  const tooltipData = useInternalItemTooltip();
  const classes = useUtilityClasses(propClasses);
  if (!tooltipData) {
    return null;
  }
  if ('values' in tooltipData) {
    const {
      label: seriesLabel,
      color,
      markType
    } = tooltipData;
    return /*#__PURE__*/_jsx(ChartsTooltipPaper, {
      sx: sx,
      className: classes.paper,
      children: /*#__PURE__*/_jsxs(ChartsTooltipTable, {
        className: classes.table,
        children: [/*#__PURE__*/_jsxs(Typography, {
          component: "caption",
          children: [/*#__PURE__*/_jsx("div", {
            className: classes.markContainer,
            children: /*#__PURE__*/_jsx(ChartsLabelMark, {
              type: markType,
              color: color,
              className: classes.mark
            })
          }), seriesLabel]
        }), /*#__PURE__*/_jsx("tbody", {
          children: tooltipData.values.map(({
            formattedValue,
            label
          }) => /*#__PURE__*/_jsxs(ChartsTooltipRow, {
            className: classes.row,
            children: [/*#__PURE__*/_jsx(ChartsTooltipCell, {
              className: clsx(classes.labelCell, classes.cell),
              component: "th",
              children: label
            }), /*#__PURE__*/_jsx(ChartsTooltipCell, {
              className: clsx(classes.valueCell, classes.cell),
              component: "td",
              children: formattedValue
            })]
          }, label))
        })]
      })
    });
  }
  const {
    color,
    label,
    formattedValue,
    markType
  } = tooltipData;
  return /*#__PURE__*/_jsx(ChartsTooltipPaper, {
    sx: sx,
    className: classes.paper,
    children: /*#__PURE__*/_jsx(ChartsTooltipTable, {
      className: classes.table,
      children: /*#__PURE__*/_jsx("tbody", {
        children: /*#__PURE__*/_jsxs(ChartsTooltipRow, {
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
            }), label]
          }), /*#__PURE__*/_jsx(ChartsTooltipCell, {
            className: clsx(classes.valueCell, classes.cell),
            component: "td",
            children: formattedValue
          })]
        })
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? ChartsItemTooltipContent.propTypes = {
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
export { ChartsItemTooltipContent };