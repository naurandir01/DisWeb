import type { BarLabelOwnerState } from "./BarLabel.types.js";
export interface BarLabelClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
  /** Styles applied to the root element if it is animated. */
  animate: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${barLabelClasses.series}-${seriesId}`.
   */
  series: string;
}
export type BarLabelClassKey = keyof BarLabelClasses;
export declare function getBarLabelUtilityClass(slot: string): string;
export declare const barLabelClasses: Record<"root" | "animate" | "highlighted" | "faded", string>;
export declare const useUtilityClasses: (ownerState: BarLabelOwnerState) => Record<"root", string>;