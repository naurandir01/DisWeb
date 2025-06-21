import { getExtremumX, getExtremumY } from "./extremums.js";
import seriesProcessor from "./seriesProcessor.js";
import getColor from "./getColor.js";
import legendGetter from "./legend.js";
import tooltipGetter from "./tooltip.js";
import getSeriesWithDefaultValues from "./getSeriesWithDefaultValues.js";
export const seriesConfig = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues
};