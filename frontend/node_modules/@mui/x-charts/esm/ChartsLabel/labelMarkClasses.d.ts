import type { ChartsLabelMarkProps } from "./ChartsLabelMark.js";
export interface ChartsLabelMarkClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the "mask" that gives shape to the marks. */
  mask: string;
  /** Styles applied to the mark type "line". */
  line: string;
  /** Styles applied to the mark type "square". */
  square: string;
  /** Styles applied to the mark type "circle". */
  circle: string;
  /** Styles applied to the element with fill={color} attribute. */
  fill: string;
}
export declare function getLabelMarkUtilityClass(slot: string): string;
export declare const labelMarkClasses: ChartsLabelMarkClasses;
export declare const useUtilityClasses: (props: ChartsLabelMarkProps) => Record<"root" | "mask" | "fill", string>;