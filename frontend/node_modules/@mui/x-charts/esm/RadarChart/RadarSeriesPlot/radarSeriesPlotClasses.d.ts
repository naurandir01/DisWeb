export interface RadarSeriesPlotClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the series element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the series element if it is faded. */
  faded: string;
  /** Styles applied to the series area element. */
  area: string;
  /** Styles applied to the series mark element. */
  mark: string;
}
export type RadarSeriesPlotClassKey = keyof RadarSeriesPlotClasses;
export declare function getRadarSeriesPlotUtilityClass(slot: string): string;
export declare const radarSeriesPlotClasses: Record<"root" | "area" | "mark" | "highlighted" | "faded", string>;
export declare const useUtilityClasses: (classes?: Partial<RadarSeriesPlotClasses>) => Record<"root" | "area" | "mark" | "highlighted" | "faded", string>;