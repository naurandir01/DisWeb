export interface RadarGridClasses {
  /** Styles applied to every radial line element. */
  radial: string;
  /** Styles applied to every divider element. */
  divider: string;
  /** Styles applied to every stripe element. */
  stripe: string;
}
export type RadarGridClassKey = keyof RadarGridClasses;
export declare function getRadarGridUtilityClass(slot: string): string;
export declare const chartsGridClasses: RadarGridClasses;
export declare const useUtilityClasses: (classes?: Partial<RadarGridClasses>) => Record<"divider" | "radial" | "stripe", string>;