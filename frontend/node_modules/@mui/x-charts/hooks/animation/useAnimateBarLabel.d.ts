import * as React from 'react';
import type { BarLabelProps } from "../../BarChart/index.js";
type UseAnimateBarLabelParams = Pick<BarLabelProps, 'xOrigin' | 'yOrigin' | 'x' | 'y' | 'width' | 'height' | 'layout' | 'skipAnimation'> & {
  ref?: React.Ref<SVGTextElement>;
};
type UseAnimateBarLabelReturn = {
  ref: React.Ref<SVGTextElement>;
} & Pick<BarLabelProps, 'x' | 'y' | 'width' | 'height'>;
/**
 * Animates a bar label from the start of the axis (x-axis for vertical layout, y-axis for horizontal layout) to the
 * center of the bar it belongs to.
 * The label is horizontally centered within the bar when the layout is vertical, and vertically centered for laid out
 * horizontally.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
export declare function useAnimateBarLabel(props: UseAnimateBarLabelParams): UseAnimateBarLabelReturn;
export {};