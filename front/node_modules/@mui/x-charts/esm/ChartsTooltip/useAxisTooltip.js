'use client';

import { useSeries } from "../hooks/useSeries.js";
import { useColorProcessor } from "../internals/plugins/corePlugins/useChartSeries/useColorProcessor.js";
import { useStore } from "../internals/store/useStore.js";
import { useSelector } from "../internals/store/useSelector.js";
import { getLabel } from "../internals/getLabel.js";
import { isCartesianSeriesType } from "../internals/isCartesian.js";
import { utcFormatter } from "./utils.js";
import { useRotationAxes, useRotationAxis, useXAxes, useXAxis, useYAxes, useYAxis } from "../hooks/useAxis.js";
import { useZAxes } from "../hooks/useZAxis.js";
import { selectorChartsInteractionTooltipXAxes, selectorChartsInteractionTooltipYAxes } from "../internals/plugins/featurePlugins/useChartCartesianAxis/index.js";
import { selectorChartsInteractionTooltipRotationAxes } from "../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors.js";
import { isPolarSeriesType } from "../internals/isPolar.js";
function defaultAxisTooltipConfig(axis, dataIndex, axisDirection) {
  const axisValue = axis.data?.[dataIndex] ?? null;
  const axisFormatter = axis.valueFormatter ?? (v => axis.scaleType === 'utc' ? utcFormatter(v) : v.toLocaleString());
  const axisFormattedValue = axisFormatter(axisValue, {
    location: 'tooltip',
    scale: axis.scale
  });
  return {
    axisDirection,
    axisId: axis.id,
    mainAxis: axis,
    dataIndex,
    axisValue,
    axisFormattedValue,
    seriesItems: []
  };
}

/**
 * @deprecated Use `useAxesTooltip` instead.
 */

export function useAxisTooltip(params = {}) {
  const {
    multipleAxes,
    directions
  } = params;
  const defaultXAxis = useXAxis();
  const defaultYAxis = useYAxis();
  const defaultRotationAxis = useRotationAxis();
  const store = useStore();
  const tooltipXAxes = useSelector(store, selectorChartsInteractionTooltipXAxes);
  const tooltipYAxes = useSelector(store, selectorChartsInteractionTooltipYAxes);
  const tooltipRotationAxes = useSelector(store, selectorChartsInteractionTooltipRotationAxes);
  const series = useSeries();
  const {
    xAxis
  } = useXAxes();
  const {
    yAxis
  } = useYAxes();
  const {
    zAxis,
    zAxisIds
  } = useZAxes();
  const {
    rotationAxis
  } = useRotationAxes();
  const colorProcessors = useColorProcessor();
  if (tooltipXAxes.length === 0 && tooltipYAxes.length === 0 && tooltipRotationAxes.length === 0) {
    return null;
  }
  const tooltipAxes = [];
  if (directions === undefined || directions.includes('x')) {
    tooltipXAxes.forEach(({
      axisId,
      dataIndex
    }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
      tooltipAxes.push(defaultAxisTooltipConfig(xAxis[axisId], dataIndex, 'x'));
    });
  }
  if (directions === undefined || directions.includes('y')) {
    tooltipYAxes.forEach(({
      axisId,
      dataIndex
    }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
      tooltipAxes.push(defaultAxisTooltipConfig(yAxis[axisId], dataIndex, 'y'));
    });
  }
  if (directions === undefined || directions.includes('rotation')) {
    tooltipRotationAxes.forEach(({
      axisId,
      dataIndex
    }) => {
      if (!multipleAxes && tooltipAxes.length > 1) {
        return;
      }
      tooltipAxes.push(defaultAxisTooltipConfig(rotationAxis[axisId], dataIndex, 'rotation'));
    });
  }
  Object.keys(series).filter(isCartesianSeriesType).forEach(seriesType => {
    const seriesOfType = series[seriesType];
    if (!seriesOfType) {
      return [];
    }
    return seriesOfType.seriesOrder.forEach(seriesId => {
      const seriesToAdd = seriesOfType.series[seriesId];
      const providedXAxisId = seriesToAdd.xAxisId ?? defaultXAxis.id;
      const providedYAxisId = seriesToAdd.yAxisId ?? defaultYAxis.id;
      const tooltipItemIndex = tooltipAxes.findIndex(({
        axisDirection,
        axisId
      }) => axisDirection === 'x' && axisId === providedXAxisId || axisDirection === 'y' && axisId === providedYAxisId);
      // Test if the series uses the default axis
      if (tooltipItemIndex >= 0) {
        const zAxisId = 'zAxisId' in seriesToAdd ? seriesToAdd.zAxisId : zAxisIds[0];
        const {
          dataIndex
        } = tooltipAxes[tooltipItemIndex];
        const color = colorProcessors[seriesType]?.(seriesToAdd, xAxis[providedXAxisId], yAxis[providedYAxisId], zAxisId ? zAxis[zAxisId] : undefined)(dataIndex) ?? '';
        const value = seriesToAdd.data[dataIndex] ?? null;
        const formattedValue = seriesToAdd.valueFormatter(value, {
          dataIndex
        });
        const formattedLabel = getLabel(seriesToAdd.label, 'tooltip') ?? null;
        tooltipAxes[tooltipItemIndex].seriesItems.push({
          seriesId,
          color,
          value,
          formattedValue,
          formattedLabel,
          markType: seriesToAdd.labelMarkType
        });
      }
    });
  });
  Object.keys(series).filter(isPolarSeriesType).forEach(seriesType => {
    const seriesOfType = series[seriesType];
    if (!seriesOfType) {
      return [];
    }
    return seriesOfType.seriesOrder.forEach(seriesId => {
      const seriesToAdd = seriesOfType.series[seriesId];
      const providedRotationAxisId =
      // @ts-expect-error Should be fixed when we introduce a polar series with a rotationAxisId
      seriesToAdd.rotationAxisId ?? defaultRotationAxis?.id;
      const tooltipItemIndex = tooltipAxes.findIndex(({
        axisDirection,
        axisId
      }) => axisDirection === 'rotation' && axisId === providedRotationAxisId);
      // Test if the series uses the default axis
      if (tooltipItemIndex >= 0) {
        const {
          dataIndex
        } = tooltipAxes[tooltipItemIndex];
        const color = colorProcessors[seriesType]?.(seriesToAdd)(dataIndex) ?? '';
        const value = seriesToAdd.data[dataIndex] ?? null;
        const formattedValue = seriesToAdd.valueFormatter(value, {
          dataIndex
        });
        const formattedLabel = getLabel(seriesToAdd.label, 'tooltip') ?? null;
        tooltipAxes[tooltipItemIndex].seriesItems.push({
          seriesId,
          color,
          value,
          formattedValue,
          formattedLabel,
          markType: seriesToAdd.labelMarkType
        });
      }
    });
  });
  if (!multipleAxes) {
    return tooltipAxes.length === 0 ? tooltipAxes[0] : null;
  }
  return tooltipAxes;
}