'use client';

import * as React from 'react';
import { useCharts } from "../../internals/store/useCharts.js";
import { ChartContext } from "./ChartContext.js";
import { useChartCartesianAxis } from "../../internals/plugins/featurePlugins/useChartCartesianAxis/index.js";
import { useChartInteraction } from "../../internals/plugins/featurePlugins/useChartInteraction/index.js";
import { useChartZAxis } from "../../internals/plugins/featurePlugins/useChartZAxis/index.js";
import { useChartHighlight } from "../../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.js";
import { seriesConfig as barSeriesConfig } from "../../BarChart/seriesConfig/index.js";
import { seriesConfig as scatterSeriesConfig } from "../../ScatterChart/seriesConfig/index.js";
import { seriesConfig as lineSeriesConfig } from "../../LineChart/seriesConfig/index.js";
import { seriesConfig as pieSeriesConfig } from "../../PieChart/seriesConfig/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const defaultSeriesConfig = {
  bar: barSeriesConfig,
  scatter: scatterSeriesConfig,
  line: lineSeriesConfig,
  pie: pieSeriesConfig
};

// For consistency with the v7, the cartesian axes are set by default.
// To remove them, you can provide a `plugins` props.
const defaultPlugins = [useChartZAxis, useChartCartesianAxis, useChartInteraction, useChartHighlight];
function ChartProvider(props) {
  const {
    children,
    plugins = defaultPlugins,
    pluginParams = {},
    seriesConfig = defaultSeriesConfig
  } = props;
  const {
    contextValue
  } = useCharts(plugins, pluginParams, seriesConfig);
  return /*#__PURE__*/_jsx(ChartContext.Provider, {
    value: contextValue,
    children: children
  });
}
export { ChartProvider };