"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.radarSeriesConfig = void 0;
var _formatter = _interopRequireDefault(require("./formatter"));
var _getColor = _interopRequireDefault(require("./getColor"));
var _extremums = require("./extremums");
var _legend = _interopRequireDefault(require("./legend"));
var _tooltip = _interopRequireWildcard(require("./tooltip"));
var _getSeriesWithDefaultValues = _interopRequireDefault(require("./getSeriesWithDefaultValues"));
const radarSeriesConfig = exports.radarSeriesConfig = {
  colorProcessor: _getColor.default,
  seriesProcessor: _formatter.default,
  legendGetter: _legend.default,
  tooltipGetter: _tooltip.default,
  axisTooltipGetter: _tooltip.axisTooltipGetter,
  getSeriesWithDefaultValues: _getSeriesWithDefaultValues.default,
  radiusExtremumGetter: _extremums.radiusExtremumGetter,
  rotationExtremumGetter: _extremums.rotationExtremumGetter
};