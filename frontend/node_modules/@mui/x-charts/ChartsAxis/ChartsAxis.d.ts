import * as React from 'react';
import { ChartsAxisSlotProps, ChartsAxisSlots } from "../models/axis.js";
export interface ChartsAxisProps {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsAxisSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsAxisSlotProps;
}
/**
 * Demos:
 *
 * - [Axis](https://mui.com/x/react-charts/axis/)
 *
 * API:
 *
 * - [ChartsAxis API](https://mui.com/x/api/charts/charts-axis/)
 */
declare function ChartsAxis(props: ChartsAxisProps): React.JSX.Element;
declare namespace ChartsAxis {
  var propTypes: any;
}
export { ChartsAxis };