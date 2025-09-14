export interface ChartsAxisHighlightClasses {
  /** Styles applied to the root element. */
  root: string;
}
export type ChartsAxisHighlightClassKey = keyof ChartsAxisHighlightClasses;
export declare function getAxisHighlightUtilityClass(slot: string): string;
export declare const chartsAxisHighlightClasses: ChartsAxisHighlightClasses;