import type { ChartsLabelProps } from "./ChartsLabel.js";
export interface ChartsLabelClasses {
  /** Styles applied to the root element. */
  root: string;
}
export declare function getLabelUtilityClass(slot: string): string;
export declare const labelClasses: ChartsLabelClasses;
export declare const useUtilityClasses: (props: ChartsLabelProps) => Record<"root", string>;