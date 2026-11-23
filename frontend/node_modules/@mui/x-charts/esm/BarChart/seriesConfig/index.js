import { getExtremumX, getExtremumY } from "./extremums.js";
import seriesProcessor from "./seriesProcessor.js";
import legendGetter from "./legend.js";
import getColor from "./getColor.js";
import tooltipGetter, { axisTooltipGetter } from "./tooltip.js";
import getSeriesWithDefaultValues from "./getSeriesWithDefaultValues.js";
export const seriesConfig = {
  seriesProcessor,
  colorProcessor: getColor,
  legendGetter,
  tooltipGetter,
  axisTooltipGetter,
  xExtremumGetter: getExtremumX,
  yExtremumGetter: getExtremumY,
  getSeriesWithDefaultValues
};