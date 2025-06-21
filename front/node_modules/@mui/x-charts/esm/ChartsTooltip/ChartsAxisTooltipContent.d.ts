import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { ChartsTooltipClasses } from "./chartsTooltipClasses.js";
export interface ChartsAxisTooltipContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
}
declare function ChartsAxisTooltipContent(props: ChartsAxisTooltipContentProps): React.JSX.Element | null;
declare namespace ChartsAxisTooltipContent {
  var propTypes: any;
}
export { ChartsAxisTooltipContent };