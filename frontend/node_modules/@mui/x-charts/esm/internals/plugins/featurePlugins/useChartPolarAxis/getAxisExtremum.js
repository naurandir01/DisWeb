import { isPolarSeriesType } from "../../../isPolar.js";
const axisExtremumCallback = (acc, chartType, axis, axisDirection, seriesConfig, axisIndex, formattedSeries) => {
  const getter = axisDirection === 'rotation' ? seriesConfig[chartType].rotationExtremumGetter : seriesConfig[chartType].radiusExtremumGetter;
  const series = formattedSeries[chartType]?.series ?? {};
  const [minChartTypeData, maxChartTypeData] = getter?.({
    series,
    axis,
    axisIndex,
    isDefaultAxis: axisIndex === 0
  }) ?? [Infinity, -Infinity];
  const [minData, maxData] = acc;
  return [Math.min(minChartTypeData, minData), Math.max(maxChartTypeData, maxData)];
};
export const getAxisExtremum = (axis, axisDirection, seriesConfig, axisIndex, formattedSeries) => {
  const polarSeriesTypes = Object.keys(seriesConfig).filter(isPolarSeriesType);
  const extremums = polarSeriesTypes.reduce((acc, charType) => axisExtremumCallback(acc, charType, axis, axisDirection, seriesConfig, axisIndex, formattedSeries), [Infinity, -Infinity]);
  if (Number.isNaN(extremums[0]) || Number.isNaN(extremums[1])) {
    return [Infinity, -Infinity];
  }
  return extremums;
};