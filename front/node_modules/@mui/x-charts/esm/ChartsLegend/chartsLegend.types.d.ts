import type { ChartsLegendProps } from "./ChartsLegend.js";
import { ContinuousColorLegendProps } from "./ContinuousColorLegend.js";
import { ChartsLegendPosition } from "./legend.types.js";
import { PiecewiseColorLegendProps } from "./PiecewiseColorLegend.js";
export interface ChartsLegendSlots {
  /**
   * Custom rendering of the legend.
   * @default ChartsLegend
   */
  legend?: React.JSXElementConstructor<ChartsLegendProps> | React.JSXElementConstructor<ContinuousColorLegendProps> | React.JSXElementConstructor<PiecewiseColorLegendProps>;
}
export interface ChartsLegendSlotProps {
  legend?: Partial<ChartsLegendProps | ContinuousColorLegendProps | PiecewiseColorLegendProps> & ChartsLegendPosition;
}
export interface ChartsLegendSlotExtension {
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsLegendSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsLegendSlotProps;
}