import _extends from "@babel/runtime/helpers/esm/extends";
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { useRadarMetricData } from "./useRadarMetricData.js";
import { getDefaultBaseline, getDefaultTextAnchor } from "../../ChartsText/defaultTextPlacement.js";
import { ChartsText } from "../../ChartsText/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
function RadarMetricLabels() {
  const {
    corners
  } = useRadarMetricData();
  const theme = useTheme();
  return /*#__PURE__*/_jsx(React.Fragment, {
    children: corners.map(({
      x,
      y,
      angle,
      label
    }, i) => /*#__PURE__*/_jsx(ChartsText, {
      x: x,
      y: y,
      fontSize: 14,
      fill: (theme.vars || theme).palette.text.primary,
      stroke: "none",
      text: label,
      style: _extends({}, theme.typography.caption, {
        fontSize: 12,
        lineHeight: 1.25,
        textAnchor: getDefaultTextAnchor(180 + angle),
        dominantBaseline: getDefaultBaseline(180 + angle)
      })
    }, i))
  });
}
export { RadarMetricLabels };