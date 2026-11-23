import * as React from 'react';
import { GaugeContainerProps } from "./GaugeContainer.js";
import { GaugeClasses } from "./gaugeClasses.js";
import { GaugeValueTextProps } from "./GaugeValueText.js";
export interface GaugeProps extends GaugeContainerProps, Pick<GaugeValueTextProps, 'text'> {
  classes?: Partial<GaugeClasses>;
  children?: React.ReactNode;
}
declare const Gauge: React.ForwardRefExoticComponent<Omit<GaugeProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
export { Gauge };