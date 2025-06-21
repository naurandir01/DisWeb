import * as React from 'react';
import { ComputedYAxis } from "../models/axis.js";
import { ChartsGridClasses } from "./chartsGridClasses.js";
interface ChartsGridHorizontalProps {
  axis: ComputedYAxis;
  start: number;
  end: number;
  classes: Partial<ChartsGridClasses>;
}
/**
 * @ignore - internal component.
 */
export declare function ChartsGridHorizontal(props: ChartsGridHorizontalProps): React.JSX.Element;
export {};