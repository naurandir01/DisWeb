import { SeriesId } from "../models/seriesType/common.js";
export interface BarElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element if it is highlighted. */
  highlighted: string;
  /** Styles applied to the root element if it is faded. */
  faded: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${barElementClasses.series}-${seriesId}`.
   */
  series: string;
}
export type BarElementClassKey = keyof BarElementClasses;
export interface BarElementOwnerState {
  id: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarElementClasses>;
}
export declare function getBarElementUtilityClass(slot: string): string;
export declare const barElementClasses: BarElementClasses;
export declare const useUtilityClasses: (ownerState: BarElementOwnerState) => Record<"root", string>;