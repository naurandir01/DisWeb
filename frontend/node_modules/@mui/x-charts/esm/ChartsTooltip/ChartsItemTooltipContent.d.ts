import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { ChartsTooltipClasses } from "./chartsTooltipClasses.js";
export interface ChartsItemTooltipContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
}
declare function ChartsItemTooltipContent(props: ChartsItemTooltipContentProps): React.JSX.Element | null;
declare namespace ChartsItemTooltipContent {
  var propTypes: any;
}
export { ChartsItemTooltipContent };