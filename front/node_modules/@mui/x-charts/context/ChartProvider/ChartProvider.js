"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartProvider = ChartProvider;
exports.defaultSeriesConfig = void 0;
var React = _interopRequireWildcard(require("react"));
var _useCharts = require("../../internals/store/useCharts");
var _ChartContext = require("./ChartContext");
var _useChartCartesianAxis = require("../../internals/plugins/featurePlugins/useChartCartesianAxis");
var _useChartInteraction = require("../../internals/plugins/featurePlugins/useChartInteraction");
var _useChartZAxis = require("../../internals/plugins/featurePlugins/useChartZAxis");
var _useChartHighlight = require("../../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight");
var _seriesConfig = require("../../BarChart/seriesConfig");
var _seriesConfig2 = require("../../ScatterChart/seriesConfig");
var _seriesConfig3 = require("../../LineChart/seriesConfig");
var _seriesConfig4 = require("../../PieChart/seriesConfig");
var _jsxRuntime = require("react/jsx-runtime");
const defaultSeriesConfig = exports.defaultSeriesConfig = {
  bar: _seriesConfig.seriesConfig,
  scatter: _seriesConfig2.seriesConfig,
  line: _seriesConfig3.seriesConfig,
  pie: _seriesConfig4.seriesConfig
};

// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
const defaultPlugins = [_useChartZAxis.useChartZAxis, _useChartCartesianAxis.useChartCartesianAxis, _useChartInteraction.useChartInteraction, _useChartHighlight.useChartHighlight];
function ChartProvider(props) {
  const {
    children,
    plugins = defaultPlugins,
    pluginParams = {},
    seriesConfig = defaultSeriesConfig
  } = props;
  const {
    contextValue
  } = (0, _useCharts.useCharts)(plugins, pluginParams, seriesConfig);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_ChartContext.ChartContext.Provider, {
    value: contextValue,
    children: children
  });
}