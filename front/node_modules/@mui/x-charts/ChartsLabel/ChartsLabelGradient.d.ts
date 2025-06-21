import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { ChartsLabelGradientClasses } from "./labelGradientClasses.js";
export interface ChartsLabelGradientProps {
  /**
   * A unique identifier for the gradient.
   * The `gradientId` will be used as `fill="url(#gradientId)"`.
   */
  gradientId: string;
  /**
   * The direction of the gradient.
   * @default 'horizontal'
   */
  direction?: 'vertical' | 'horizontal';
  /**
   * If `true`, the gradient will be reversed.
   */
  reverse?: boolean;
  /**
   * If provided, the gradient will be rotated by 90deg.
   * Useful for linear gradients that are not in the correct orientation.
   */
  rotate?: boolean;
  /**
   * The thickness of the gradient
   * @default 12
   */
  thickness?: number;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelGradientClasses>;
  className?: string;
  sx?: SxProps<Theme>;
}
/**
 * Generates the label Gradient for the tooltip and legend.
 * @ignore - internal component.
 */
declare const ChartsLabelGradient: React.ForwardRefExoticComponent<ChartsLabelGradientProps & React.RefAttributes<{}>>;
export { ChartsLabelGradient };