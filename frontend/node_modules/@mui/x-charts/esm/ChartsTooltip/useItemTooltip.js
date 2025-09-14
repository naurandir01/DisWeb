'use client';

import { useSeries } from "../hooks/useSeries.js";
import { selectorChartsInteractionItem } from "../internals/plugins/featurePlugins/useChartInteraction/index.js";
import { useSelector } from "../internals/store/useSelector.js";
import { useStore } from "../internals/store/useStore.js";
import { useRadiusAxes, useRotationAxes, useXAxes, useYAxes } from "../hooks/useAxis.js";
import { useZAxes } from "../hooks/useZAxis.js";
import { selectorChartSeriesConfig } from "../internals/plugins/corePlugins/useChartSeries/useChartSeries.selectors.js";
export function useInternalItemTooltip() {
  const store = useStore();
  const identifier = useSelector(store, selectorChartsInteractionItem);
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);
  const series = useSeries();
  const {
    xAxis,
    xAxisIds
  } = useXAxes();
  const {
    yAxis,
    yAxisIds
  } = useYAxes();
  const {
    zAxis,
    zAxisIds
  } = useZAxes();
  const {
    rotationAxis,
    rotationAxisIds
  } = useRotationAxes();
  const {
    radiusAxis,
    radiusAxisIds
  } = useRadiusAxes();
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
export const useItemTooltip = () => {
  return useInternalItemTooltip();
};

/**
 * Contains an object per value with their content and the label of the associated metric.
 * @returns The tooltip item configs
 */
export const useRadarItemTooltip = () => {
  return useInternalItemTooltip();
};