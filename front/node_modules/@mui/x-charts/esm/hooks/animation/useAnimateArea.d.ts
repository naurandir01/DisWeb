import * as React from 'react';
import type { AnimatedAreaProps } from "../../LineChart/index.js";
type UseAnimateAreaParams = Pick<AnimatedAreaProps, 'd' | 'skipAnimation'> & {
  ref?: React.Ref<SVGPathElement>;
};
type UseAnimatedAreaReturn = {
  ref: React.Ref<SVGPathElement>;
  d: string;
};
/** Animates an area of a line chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
export declare function useAnimateArea(props: UseAnimateAreaParams): UseAnimatedAreaReturn;
export {};