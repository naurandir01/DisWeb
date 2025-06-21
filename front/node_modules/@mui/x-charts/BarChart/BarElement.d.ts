import * as React from 'react';
import { SlotComponentPropsFromProps } from '@mui/x-internals/types';
import { BarElementOwnerState } from "./barElementClasses.js";
import { BarProps } from "./AnimatedBarElement.js";
export interface BarElementSlots {
  /**
   * The component that renders the bar.
   * @default BarElementPath
   */
  bar?: React.ElementType<BarProps>;
}
export interface BarElementSlotProps {
  bar?: SlotComponentPropsFromProps<BarProps, {}, BarElementOwnerState>;
}
export type BarElementProps = Omit<BarElementOwnerState, 'isFaded' | 'isHighlighted'> & Omit<React.SVGProps<SVGRectElement>, 'ref' | 'id'> & {
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: BarElementSlotProps;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: BarElementSlots;
  x: number;
  xOrigin: number;
  y: number;
  yOrigin: number;
  width: number;
  height: number;
  layout: 'horizontal' | 'vertical';
  skipAnimation: boolean;
};
declare function BarElement(props: BarElementProps): React.JSX.Element;
declare namespace BarElement {
  var propTypes: any;
}
export { BarElement };