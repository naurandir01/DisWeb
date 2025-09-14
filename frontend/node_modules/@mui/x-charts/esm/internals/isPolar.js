import { polarSeriesTypes } from "./configInit.js";
export function isPolarSeriesType(seriesType) {
  return polarSeriesTypes.getTypes().has(seriesType);
}