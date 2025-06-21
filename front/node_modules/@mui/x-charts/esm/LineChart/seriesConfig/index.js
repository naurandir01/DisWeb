import { getExtremumX, getExtremumY } from "./extremums.js";
import seriesProcessor from "./seriesProcessor.js";
import getColor from "./getColor.js";
import legendGetter from "./legend.js";
import tooltipGetter, { axisTooltipGetter } from "./tooltip.js";
import getSeriesWithDefaultValues from "./getSeriesWithDefaultValues.js";
export const seriesConfig = {
  colorProcessor: getColor,
  seriesProcessor,
  legendGetter,
  tooltipGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues
};