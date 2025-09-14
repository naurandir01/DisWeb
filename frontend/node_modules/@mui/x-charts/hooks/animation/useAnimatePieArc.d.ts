import * as React from 'react';
import type { PieArcProps } from "../../PieChart/index.js";
type UseAnimatePieArcParams = Pick<PieArcProps, 'startAngle' | 'endAngle' | 'cornerRadius' | 'paddingAngle' | 'innerRadius' | 'outerRadius' | 'skipAnimation'> & {
  ref?: React.Ref<SVGPathElement>;
};
type UseAnimatePieArcReturnValue = {
  ref: React.Ref<SVGPathElement>;
  d: string;
  visibility: 'hidden' | 'visible';
};
/** Animates a slice of a pie chart by increasing the start and end angles from the middle angle to their final values.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export declare function useAnimatePieArc(props: UseAnimatePieArcParams): UseAnimatePieArcReturnValue;
export {};