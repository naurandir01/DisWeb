"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurveFactory = getCurveFactory;
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
function getCurveFactory(curveType) {
  switch (curveType) {
    case 'catmullRom':
      return _d3Shape.curveCatmullRom.alpha(0.5);
    case 'linear':
      return _d3Shape.curveLinear;
    case 'monotoneX':
      return _d3Shape.curveMonotoneX;
    case 'monotoneY':
      return _d3Shape.curveMonotoneY;
    case 'natural':
      return _d3Shape.curveNatural;
    case 'step':
      return _d3Shape.curveStep;
    case 'stepBefore':
      return _d3Shape.curveStepBefore;
    case 'stepAfter':
      return _d3Shape.curveStepAfter;
    case 'bumpY':
      return _d3Shape.curveBumpY;
    case 'bumpX':
      return _d3Shape.curveBumpX;
    default:
      return _d3Shape.curveMonotoneX;
  }
}