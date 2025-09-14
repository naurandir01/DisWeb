import { isCartesianSeriesType } from "../../../isCartesian.js";
export const getAxisTriggerTooltip = (axisDirection, seriesConfig, formattedSeries, defaultAxisId) => {
  const tooltipAxesIds = new Set();
  const chartTypes = Object.keys(seriesConfig).filter(isCartesianSeriesType);
  chartTypes.forEach(chartType => {
    const series = formattedSeries[chartType]?.series ?? {};
    const tooltipAxes = seriesConfig[chartType].axisTooltipGetter?.(series);
    if (tooltipAxes === undefined) {
      return;
    }
    tooltipAxes.forEach(({
      axisId,
      direction
    }) => {
      if (direction === axisDirection) {
        tooltipAxesIds.add(axisId ?? defaultAxisId);
      }
    });
  });
  return tooltipAxesIds;
};