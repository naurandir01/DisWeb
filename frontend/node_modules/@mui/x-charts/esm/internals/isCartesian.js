import { cartesianSeriesTypes } from "./configInit.js";
export function isCartesianSeriesType(seriesType) {
  return cartesianSeriesTypes.getTypes().has(seriesType);
}