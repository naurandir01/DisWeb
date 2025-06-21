"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxis = useAxis;
var _useZAxis = require("../hooks/useZAxis");
var _useAxis = require("../hooks/useAxis");
/**
 * Helper to select an axis definition according to its direction and id.
 */
function useAxis({
  axisDirection,
  axisId
}) {
  const {
    xAxis,
    xAxisIds
  } = (0, _useAxis.useXAxes)();
  const {
    yAxis,
    yAxisIds
  } = (0, _useAxis.useYAxes)();
  const {
    zAxis,
    zAxisIds
  } = (0, _useZAxis.useZAxes)();
  switch (axisDirection) {
    case 'x':
      {
        const id = typeof axisId === 'string' ? axisId : xAxisIds[axisId ?? 0];
        return xAxis[id];
      }
    case 'y':
      {
        const id = typeof axisId === 'string' ? axisId : yAxisIds[axisId ?? 0];
        return yAxis[id];
      }
    case 'z':
    default:
      {
        const id = typeof axisId === 'string' ? axisId : zAxisIds[axisId ?? 0];
        return zAxis[id];
      }
  }
}