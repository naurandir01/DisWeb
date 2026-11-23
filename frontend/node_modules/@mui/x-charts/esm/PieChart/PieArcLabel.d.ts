import * as React from 'react';
import { PieItemId } from "../models/seriesType/pie.js";
export interface PieArcLabelClasses {
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
   * Needs to be suffixed with the series ID: `.${pieArcLabelClasses.series}-${seriesId}`.
   */
  series: string;
}
export type PieArcLabelClassKey = keyof PieArcLabelClasses;
interface PieArcLabelOwnerState {
  id: PieItemId;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  skipAnimation: boolean;
  classes?: Partial<PieArcLabelClasses>;
}
export declare function getPieArcLabelUtilityClass(slot: string): string;
export declare const pieArcLabelClasses: PieArcLabelClasses;
export type PieArcLabelProps = PieArcLabelOwnerState & Omit<React.SVGProps<SVGTextElement>, 'ref' | 'color' | 'id'> & {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  arcLabelRadius: number;
  cornerRadius: number;
  paddingAngle: number;
  skipAnimation: boolean;
  formattedArcLabel?: string | null;
};
declare const PieArcLabel: React.ForwardRefExoticComponent<PieArcLabelOwnerState & Omit<React.SVGProps<SVGTextElement>, "ref" | "color" | "id"> & {
  startAngle: number;
  endAngle: number;
  innerRadius: number;
  outerRadius: number;
  arcLabelRadius: number;
  cornerRadius: number;
  paddingAngle: number;
  skipAnimation: boolean;
  formattedArcLabel?: string | null;
} & React.RefAttributes<SVGTextElement>>;
export { PieArcLabel };