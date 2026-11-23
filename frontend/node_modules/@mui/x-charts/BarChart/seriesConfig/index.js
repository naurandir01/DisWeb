"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.seriesConfig = void 0;
var _extremums = require("./extremums");
var _seriesProcessor = _interopRequireDefault(require("./seriesProcessor"));
var _legend = _interopRequireDefault(require("./legend"));
var _getColor = _interopRequireDefault(require("./getColor"));
var _tooltip = _interopRequireWildcard(require("./tooltip"));
var _getSeriesWithDefaultValues = _interopRequireDefault(require("./getSeriesWithDefaultValues"));
const seriesConfig = exports.seriesConfig = {
  seriesProcessor: _seriesProcessor.default,
  colorProcessor: _getColor.default,
  legendGetter: _legend.default,
  tooltipGetter: _tooltip.default,
  axisTooltipGetter: _tooltip.axisTooltipGetter,
  xExtremumGetter: _extremums.getExtremumX,
  yExtremumGetter: _extremums.getExtremumY,
  getSeriesWithDefaultValues: _getSeriesWithDefaultValues.default
};