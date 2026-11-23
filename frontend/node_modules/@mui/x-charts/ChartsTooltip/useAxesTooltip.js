"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxesTooltip = useAxesTooltip;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useAxisTooltip = require("./useAxisTooltip");
/**
 * Returns the axes to display in the tooltip and the series item related to them.
 */
function useAxesTooltip(params) {
  return (0, _useAxisTooltip.useAxisTooltip)((0, _extends2.default)({}, params, {
    multipleAxes: true
  }));
}