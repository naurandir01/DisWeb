import * as React from 'react';
import { ComputedXAxis } from "../models/axis.js";
import { ChartsGridClasses } from "./chartsGridClasses.js";
interface ChartsGridVerticalProps {
  axis: ComputedXAxis;
  start: number;
  end: number;
  classes: Partial<ChartsGridClasses>;
}
/**
 * @ignore - internal component.
 */
export declare function ChartsGridVertical(props: ChartsGridVerticalProps): React.JSX.Element;
export {};