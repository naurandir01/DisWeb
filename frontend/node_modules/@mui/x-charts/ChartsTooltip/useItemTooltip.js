"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInternalItemTooltip = useInternalItemTooltip;
exports.useRadarItemTooltip = exports.useItemTooltip = void 0;
var _useSeries = require("../hooks/useSeries");
var _useChartInteraction = require("../internals/plugins/featurePlugins/useChartInteraction");
var _useSelector = require("../internals/store/useSelector");
var _useStore = require("../internals/store/useStore");
var _useAxis = require("../hooks/useAxis");
var _useZAxis = require("../hooks/useZAxis");
var _useChartSeries = require("../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors");
function useInternalItemTooltip() {
  const store = (0, _useStore.useStore)();
  const identifier = (0, _useSelector.useSelector)(store, _useChartInteraction.selectorChartsInteractionItem);
  const seriesConfig = (0, _useSelector.useSelector)(store, _useChartSeries.selectorChartSeriesConfig);
  const series = (0, _useSeries.useSeries)();
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
  const {
    rotationAxis,
    rotationAxisIds
  } = (0, _useAxis.useRotationAxes)();
  const {
    radiusAxis,
    radiusAxisIds
  } = (0, _useAxis.useRadiusAxes)();
  const xAxisId = series.xAxisId ?? xAxisIds[0];
  const yAxisId = series.yAxisId ?? yAxisIds[0];
  const zAxisId = series.zAxisId ?? zAxisIds[0];
  const rotationAxisId = series.rotationAxisId ?? rotationAxisIds[0];
  const radiusAxisId = series.radiusAxisId ?? radiusAxisIds[0];
  if (!identifier) {
    return null;
  }
  const itemSeries = series[identifier.type]?.series[identifier.seriesId];
  if (!itemSeries) {
    return null;
  }
  const getColor = seriesConfig[itemSeries.type].colorProcessor?.(itemSeries, xAxisId && xAxis[xAxisId], yAxisId && yAxis[yAxisId], zAxisId && zAxis[zAxisId]) ?? (() => '');
  const axesConfig = {};
  if (xAxisId !== undefined) {
    axesConfig.x = xAxis[xAxisId];
  }
  if (yAxisId !== undefined) {
    axesConfig.y = yAxis[yAxisId];
  }
  if (rotationAxisId !== undefined) {
    axesConfig.rotation = rotationAxis[rotationAxisId];
  }
  if (radiusAxisId !== undefined) {
    axesConfig.radius = radiusAxis[radiusAxisId];
  }
  return seriesConfig[itemSeries.type].tooltipGetter({
    series: itemSeries,
    axesConfig,
    getColor,
    identifier
  });
}

/**
 * Returns a config object when the tooltip contains a single item to display.
 * Some specific charts like radar need more complex structure. Use specific hook like `useRadarItemTooltip` for them.
 * @returns The tooltip item config
 */
const useItemTooltip = () => {
  return useInternalItemTooltip();
};

/**
 * Contains an object per value with their content and the label of the associated metric.
 * @returns The tooltip item configs
 */
exports.useItemTooltip = useItemTooltip;
const useRadarItemTooltip = () => {
  return useInternalItemTooltip();
};
exports.useRadarItemTooltip = useRadarItemTooltip;