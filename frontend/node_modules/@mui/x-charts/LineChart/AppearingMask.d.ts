import * as React from 'react';
import { SeriesId } from "../models/seriesType/common.js";
interface AppearingMaskProps {
  id: SeriesId;
  skipAnimation?: boolean;
  children: React.ReactNode;
}
export interface AppearingMaskClasses {
  /** Styles applied if the element should be animated. */
  animate: string;
}
export declare const appearingMaskClasses: AppearingMaskClasses;
/**
 * @ignore - internal component.
 */
export declare function AppearingMask(props: AppearingMaskProps): React.JSX.Element;
export {};