import * as React from 'react';
import { ChartsSurfaceProps } from "../ChartsSurface/index.js";
import { ChartDataProviderProps } from "../ChartDataProvider/index.js";
import type { ChartContainerProps } from "./ChartContainer.js";
import { ChartSeriesType } from "../models/seriesType/config.js";
import { AllPluginSignatures } from "../internals/plugins/allPlugins.js";
import { ChartAnyPluginSignature } from "../internals/plugins/models/plugin.js";
export type UseChartContainerPropsReturnValue<TSeries extends ChartSeriesType, TSignatures extends readonly ChartAnyPluginSignature[]> = {
  chartDataProviderProps: Omit<ChartDataProviderProps<TSeries, TSignatures>, 'children'>;
  chartsSurfaceProps: ChartsSurfaceProps & {
    ref: React.Ref<SVGSVGElement>;
  };
  children: React.ReactNode;
};
export declare const useChartContainerProps: <TSeries extends ChartSeriesType = ChartSeriesType, TSignatures extends readonly ChartAnyPluginSignature[] = AllPluginSignatures<TSeries>>(props: ChartContainerProps<TSeries, TSignatures>, ref: React.Ref<SVGSVGElement>) => UseChartContainerPropsReturnValue<TSeries, TSignatures>;