import * as React from 'react';
import type { BarProps } from "../../BarChart/AnimatedBarElement.js";
type UseAnimateBarParams = Pick<BarProps, 'x' | 'y' | 'xOrigin' | 'yOrigin' | 'width' | 'height' | 'skipAnimation' | 'layout'> & {
  ref?: React.Ref<SVGRectElement>;
};
type UseAnimateBarReturnValue = {
  ref: React.Ref<SVGRectElement>;
} & Pick<BarProps, 'x' | 'y' | 'width' | 'height'>;
/**
 * Animates a bar from the start of the axis (x-axis for vertical layout, y-axis for horizontal layout) to its
 * final position.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
export declare function useAnimateBar(props: UseAnimateBarParams): UseAnimateBarReturnValue;
export {};