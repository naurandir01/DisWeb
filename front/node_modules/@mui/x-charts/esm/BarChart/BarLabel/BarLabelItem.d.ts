import * as React from 'react';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { BarLabelOwnerState, BarItem, BarLabelContext } from "./BarLabel.types.js";
import { BarLabelProps } from "./BarLabel.js";
export interface BarLabelSlots {
  /**
   * The component that renders the bar label.
   * @default BarLabel
   */
  barLabel?: React.JSXElementConstructor<BarLabelProps>;
}
export interface BarLabelSlotProps {
  barLabel?: SlotComponentPropsFromProps<BarLabelProps, {}, BarLabelOwnerState>;
}
export type BarLabelItemProps = Omit<BarLabelOwnerState, 'isFaded' | 'isHighlighted'> & Pick<BarLabelProps, 'style'> & {
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarLabelSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarLabelSlots;
  /**
   * The position in the x-axis of the stack this bar label belongs to.
   */
  xOrigin: number;
  /**
   * The position in the y-axis of the stack this bar label belongs to.
   */
  yOrigin: number;
  /**
   * The position of the bar in the x-axis.
   */
  x: number;
  /**
   * The position of the bar in the y-axis.
   */
  y: number;
  /**
   * The height of the bar.
   */
  height: number;
  /**
   * The width of the bar.
   */
  width: number;
  /**
   * The orientation of the bar.
   */
  layout: 'vertical' | 'horizontal';
  /**
   * The value of the data point.
   */
  value: number | null;
  /**
   * If true, no animations should be applied.
   */
  skipAnimation: boolean;
  /**
   * If provided, the function will be used to format the label of the bar.
   * It can be set to 'value' to display the current value.
   * @param {BarItem} item The item to format.
   * @param {BarLabelContext} context data about the bar.
   * @returns {string} The formatted label.
   */
  barLabel?: 'value' | ((item: BarItem, context: BarLabelContext) => string | null | undefined);
};
/**
 * @ignore - internal component.
 */
declare function BarLabelItem(props: BarLabelItemProps): React.JSX.Element | null;
declare namespace BarLabelItem {
  var propTypes: any;
}
export { BarLabelItem };