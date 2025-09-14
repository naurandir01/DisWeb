import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { ChartsLabelClasses } from "./labelClasses.js";
export interface ChartsLabelProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsLabelClasses>;
  children?: React.ReactNode;
  className?: string;
  sx?: SxProps<Theme>;
}
/**
 * Generates the label mark for the tooltip and legend.
 * @ignore - internal component.
 */
declare const ChartsLabel: React.ForwardRefExoticComponent<ChartsLabelProps & React.RefAttributes<{}>>;
export { ChartsLabel };