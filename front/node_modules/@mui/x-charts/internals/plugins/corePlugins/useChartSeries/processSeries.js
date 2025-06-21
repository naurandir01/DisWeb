"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.preprocessSeries = void 0;
/**
 * This methods is the interface between what the developer is providing and what components receives
 * To simplify the components behaviors, it groups series by type, such that LinePlots props are not updated if some line data are modified
 * It also add defaultized values such as the ids, colors
 * @param series The array of series provided by the developer
 * @param colors The color palette used to defaultize series colors
 * @returns An object structuring all the series by type.
 */
const preprocessSeries = ({
  series,
  colors,
  seriesConfig,
  dataset
}) => {
  // Group series by type
  const seriesGroups = {};
  // Notice the line about uses `ChartSeriesType` instead of TSeriesType.
  // That's probably because the series.type is not propagated from the generic but hardcoded in the config.

  series.forEach((seriesData, seriesIndex) => {
    const seriesWithDefaultValues = seriesConfig[seriesData.type].getSeriesWithDefaultValues(seriesData, seriesIndex, colors);
    const id = seriesWithDefaultValues.id;
    if (seriesGroups[seriesData.type] === undefined) {
      seriesGroups[seriesData.type] = {
        series: {},
        seriesOrder: []
      };
    }
    if (seriesGroups[seriesData.type]?.series[id] !== undefined) {
      throw new Error(`MUI X Charts: series' id "${id}" is not unique.`);
    }
    seriesGroups[seriesData.type].series[id] = seriesWithDefaultValues;
    seriesGroups[seriesData.type].seriesOrder.push(id);
  });
  const processedSeries = {};
  // Apply formatter on a type group
  Object.keys(seriesConfig).forEach(type => {
    const group = seriesGroups[type];
    if (group !== undefined) {
      processedSeries[type] = seriesConfig[type]?.seriesProcessor?.(group, dataset) ?? seriesGroups[type];
    }
  });
  return processedSeries;
};
exports.preprocessSeries = preprocessSeries;