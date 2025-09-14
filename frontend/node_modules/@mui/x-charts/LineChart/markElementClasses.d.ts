import { SeriesId } from "../models/seriesType/common.js";
export interface MarkElementClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the root element when highlighted. */
  highlighted: string;
  /** Styles applied to the root element when faded. */
  faded: string;
  /** Styles applied to the root element when animation is not skipped. */
  animate: string;
  /**
   * Styles applied to the root element for a specified series.
   * Needs to be suffixed with the series ID: `.${markElementClasses.series}-${seriesId}`.
   */
  series: string;
}
export type MarkElementClassKey = keyof MarkElementClasses;
export interface MarkElementOwnerState {
  id: SeriesId;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<MarkElementClasses>;
  skipAnimation?: boolean;
}
export declare function getMarkElementUtilityClass(slot: string): string;
export declare const markElementClasses: MarkElementClasses;
export declare const useUtilityClasses: (ownerState: MarkElementOwnerState) => Record<"root", string>;