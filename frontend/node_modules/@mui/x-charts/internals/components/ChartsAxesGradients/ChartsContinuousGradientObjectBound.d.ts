import * as React from 'react';
import { ContinuousColorConfig } from "../../../models/colorMapping.js";
type ChartsContinuousGradientObjectBoundProps = {
  isReversed?: boolean;
  gradientId: string;
  colorMap: ContinuousColorConfig;
  colorScale: (value: any) => string | null;
};
/**
 * Generates gradients to be used in tooltips and legends.
 */
export default function ChartsContinuousGradientObjectBound(props: ChartsContinuousGradientObjectBoundProps): React.JSX.Element;
export {};