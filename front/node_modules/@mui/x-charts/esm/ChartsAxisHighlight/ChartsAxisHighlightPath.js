'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import { styled } from '@mui/material/styles';
export const ChartsAxisHighlightPath = styled('path', {
  name: 'MuiChartsAxisHighlight',
  slot: 'Root'
})(({
  theme
}) => ({
  pointerEvents: 'none',
  variants: [{
    props: {
      axisHighlight: 'band'
    },
    style: _extends({
      fill: 'white',
      fillOpacity: 0.1
    }, theme.applyStyles('light', {
      fill: 'gray'
    }))
  }, {
    props: {
      axisHighlight: 'line'
    },
    style: _extends({
      strokeDasharray: '5 2',
      stroke: '#ffffff'
    }, theme.applyStyles('light', {
      stroke: '#000000'
    }))
  }]
}));