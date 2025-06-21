export interface RadarAxisHighlightClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the highlighted axis line element. */
  line: string;
  /** Styles applied to every highlight dot. */
  dot: string;
}
export type RadarAxisHighlightClassKey = keyof RadarAxisHighlightClasses;
export declare function getRadarAxisHighlightUtilityClass(slot: string): string;
export declare const chartsAxisHighlightClasses: RadarAxisHighlightClasses;