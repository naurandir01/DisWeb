import formatter from "./formatter.js";
import getColor from "./getColor.js";
import { radiusExtremumGetter, rotationExtremumGetter } from "./extremums.js";
import legendGetter from "./legend.js";
import tooltipGetter, { axisTooltipGetter } from "./tooltip.js";
import getSeriesWithDefaultValues from "./getSeriesWithDefaultValues.js";
export const radarSeriesConfig = {
  colorProcessor: getColor,
  seriesProcessor: formatter,
  legendGetter,
  tooltipGetter,
  axisTooltipGetter,
  getSeriesWithDefaultValues,
  radiusExtremumGetter,
  rotationExtremumGetter
};