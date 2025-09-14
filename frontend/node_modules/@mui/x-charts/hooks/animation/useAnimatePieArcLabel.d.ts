import * as React from 'react';
import type { PieArcLabelProps } from "../../PieChart/index.js";
type UseAnimatePieArcLabelParams = Pick<PieArcLabelProps, 'startAngle' | 'endAngle' | 'cornerRadius' | 'paddingAngle' | 'skipAnimation'> & {
  ref?: React.Ref<SVGTextElement>;
  arcLabelRadius?: number;
  /**
   * @deprecated Use `arcLabelRadius` instead. This prop will be removed in the next major version.
   */
  innerRadius: PieArcLabelProps['innerRadius'];
  /**
   * @deprecated Use `arcLabelRadius` instead. This prop will be removed in the next major version.
   */
  outerRadius: PieArcLabelProps['outerRadius'];
};
type UseAnimatePieArcLabelReturn = {
  ref: React.Ref<SVGTextElement>;
  x: number;
  y: number;
};
/** Animates the label of pie slice from its middle point to the centroid of the slice.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export declare function useAnimatePieArcLabel(props: UseAnimatePieArcLabelParams): UseAnimatePieArcLabelReturn;
export {};