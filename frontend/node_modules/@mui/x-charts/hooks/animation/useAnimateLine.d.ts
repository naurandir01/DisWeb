import * as React from 'react';
import type { AnimatedLineProps } from "../../LineChart/index.js";
type UseAnimateLineParams = Pick<AnimatedLineProps, 'd' | 'skipAnimation'> & {
  ref?: React.Ref<SVGPathElement>;
};
type UseAnimatedReturnValue = {
  ref: React.Ref<SVGPathElement>;
  d: string;
};
/** Animates a line of a line chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
export declare function useAnimateLine(props: UseAnimateLineParams): UseAnimatedReturnValue;
export {};