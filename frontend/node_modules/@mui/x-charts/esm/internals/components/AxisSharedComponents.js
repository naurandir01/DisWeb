import _extends from "@babel/runtime/helpers/esm/extends";
import { styled } from '@mui/material/styles';
import { axisClasses } from "../../ChartsAxis/axisClasses.js";
export const AxisRoot = styled('g', {
  name: 'MuiChartsAxis',
  slot: 'Root'
})(({
  theme
}) => ({
  [`& .${axisClasses.tickLabel}`]: _extends({}, theme.typography.caption, {
    fill: (theme.vars || theme).palette.text.primary
  }),
  [`& .${axisClasses.label}`]: {
    fill: (theme.vars || theme).palette.text.primary
  },
  [`& .${axisClasses.line}`]: {
    stroke: (theme.vars || theme).palette.text.primary,
    shapeRendering: 'crispEdges',
    strokeWidth: 1
  },
  [`& .${axisClasses.tick}`]: {
    stroke: (theme.vars || theme).palette.text.primary,
    shapeRendering: 'crispEdges'
  }
}));