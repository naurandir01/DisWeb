import type { ContinuousColorLegendProps } from "./ContinuousColorLegend.js";
import type { ChartsLegendSlotExtension } from "./chartsLegend.types.js";
export interface ContinuousColorLegendClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the list item that renders the `minLabel`. */
  minLabel: string;
  /** Styles applied to the list item that renders the `maxLabel`. */
  maxLabel: string;
  /** Styles applied to the list item with the gradient. */
  gradient: string;
  /** Styles applied to the legend in column layout. */
  vertical: string;
  /** Styles applied to the legend in row layout. */
  horizontal: string;
  /** Styles applied to the legend with the labels before the gradient. */
  start: string;
  /** Styles applied to the legend with the labels after the gradient. */
  end: string;
  /** Styles applied to the legend with the labels on the extremes of the gradient. */
  extremes: string;
  /** Styles applied to the series label. */
  label: string;
}
export declare const useUtilityClasses: (props: ContinuousColorLegendProps & ChartsLegendSlotExtension) => Record<"root" | "label" | "mark" | "gradient" | "minLabel" | "maxLabel", string>;
export declare const continuousColorLegendClasses: ContinuousColorLegendClasses;