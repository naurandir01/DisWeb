import { CartesianChartSeriesType, PolarChartSeriesType } from "../models/seriesType/config.js";
declare class CartesianSeriesTypes {
  types: Set<CartesianChartSeriesType>;
  constructor();
  addType(value: CartesianChartSeriesType): void;
  getTypes(): Set<"line" | "scatter" | "bar">;
}
declare class PolarSeriesTypes {
  types: Set<PolarChartSeriesType>;
  constructor();
  addType(value: PolarChartSeriesType): void;
  getTypes(): Set<"radar">;
}
export declare const cartesianSeriesTypes: CartesianSeriesTypes;
export declare const polarSeriesTypes: PolarSeriesTypes;
export {};