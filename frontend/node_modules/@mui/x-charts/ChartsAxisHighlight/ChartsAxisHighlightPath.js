"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsAxisHighlightPath = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _styles = require("@mui/material/styles");
const ChartsAxisHighlightPath = exports.ChartsAxisHighlightPath = (0, _styles.styled)('path', {
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
    style: (0, _extends2.default)({
      fill: 'white',
      fillOpacity: 0.1
    }, theme.applyStyles('light', {
      fill: 'gray'
    }))
  }, {
    props: {
      axisHighlight: 'line'
    },
    style: (0, _extends2.default)({
      strokeDasharray: '5 2',
      stroke: '#ffffff'
    }, theme.applyStyles('light', {
      stroke: '#000000'
    }))
  }]
}));