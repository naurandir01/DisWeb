import type { LegendItemParams } from "../ChartsLegend/index.js";
/**
 * Get the legend items to display.
 *
 * This hook is used by the `ChartsLegend` component. And will return the legend items formatted for display.
 *
 * An alternative is to use the `useSeries` hook and format the legend items yourself.
 *
 * @returns legend data
 */
export declare function useLegend(): {
  items: LegendItemParams[];
};