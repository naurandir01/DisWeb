"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAxisTooltip = useAxisTooltip;
var _useSeries = require("../hooks/useSeries");
var _useColorProcessor = require("../internals/plugins/corePlugins/useChartSeries/useColorProcessor");
var _useStore = require("../internals/store/useStore");
var _useSelector = require("../internals/store/useSelector");
var _getLabel = require("../internals/getLabel");
var _isCartesian = require("../internals/isCartesian");
var _utils = require("./utils");
var _useAxis = require("../hooks/useAxis");
var _useZAxis = require("../hooks/useZAxis");
var _useChartCartesianAxis = require("../internals/plugins/featurePlugins/useChartCartesianAxis");
var _useChartPolarInteraction = require("../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors");
var _isPolar = require("../internals/isPolar");
function defaultAxisTooltipConfig(axis, dataIndex, axisDirection) {
  const axisValue = axis.data?.[dataIndex] ?? null;
  const axisFormatter = axis.valueFormatter ?? (v => axis.scaleType === 'utc' ? (0, _utils.utcFormatter)(v) : v.toLocaleString());
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

function useAxisTooltip(params = {}) {
  const {
    multipleAxes,
    directions
  } = params;
  const defaultXAxis = (0, _useAxis.useXAxis)();
  const defaultYAxis = (0, _useAxis.useYAxis)();
  const defaultRotationAxis = (0, _useAxis.useRotationAxis)();
  const store = (0, _useStore.useStore)();
  const tooltipXAxes = (0, _useSelector.useSelector)(store, _useChartCartesianAxis.selectorChartsInteractionTooltipXAxes);
  const tooltipYAxes = (0, _useSelector.useSelector)(store, _useChartCartesianAxis.selectorChartsInteractionTooltipYAxes);
  const tooltipRotationAxes = (0, _useSelector.useSelector)(store, _useChartPolarInteraction.selectorChartsInteractionTooltipRotationAxes);
  const series = (0, _useSeries.useSeries)();
  const {
    xAxis
  } = (0, _useAxis.useXAxes)();
  const {
    yAxis
  } = (0, _useAxis.useYAxes)();
  const {
    zAxis,
    zAxisIds
  } = (0, _useZAxis.useZAxes)();
  const {
    rotationAxis
  } = (0, _useAxis.useRotationAxes)();
  const colorProcessors = (0, _useColorProcessor.useColorProcessor)();
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
  Object.keys(series).filter(_isCartesian.isCartesianSeriesType).forEach(seriesType => {
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
        const formattedLabel = (0, _getLabel.getLabel)(seriesToAdd.label, 'tooltip') ?? null;
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
  Object.keys(series).filter(_isPolar.isPolarSeriesType).forEach(seriesType => {
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
        const formattedLabel = (0, _getLabel.getLabel)(seriesToAdd.label, 'tooltip') ?? null;
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