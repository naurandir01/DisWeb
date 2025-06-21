import seriesProcessor from "./seriesProcessor.js";
import getColor from "./getColor.js";
import legendGetter from "./legend.js";
import tooltipGetter from "./tooltip.js";
import getSeriesWithDefaultValues from "./getSeriesWithDefaultValues.js";
export const seriesConfig = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  getSeriesWithDefaultValues
};