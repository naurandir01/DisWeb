import type { ChartsLabelGradientProps } from "./ChartsLabelGradient.js";
export interface ChartsLabelGradientClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the "mask" that gives shape to the gradient. */
  mask: string;
  /** Styles applied when direction is "column". */
  vertical: string;
  /** Styles applied when direction is "row". */
  horizontal: string;
  /** Styles applied to the element filled by the gradient */
  fill: string;
}
export declare function getLabelGradientUtilityClass(slot: string): string;
export declare const labelGradientClasses: ChartsLabelGradientClasses;
export declare const useUtilityClasses: (props: ChartsLabelGradientProps) => Record<"root" | "mask" | "fill", string>;