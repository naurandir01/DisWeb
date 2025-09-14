import * as React from 'react';
import type { ChartProviderProps } from "./ChartProvider.types.js";
import { ChartAnyPluginSignature } from "../../internals/plugins/models/index.js";
import { ChartSeriesConfig } from "../../internals/plugins/models/seriesConfig/index.js";
import { ChartSeriesType } from "../../models/seriesType/config.js";
export declare const defaultSeriesConfig: ChartSeriesConfig<'bar' | 'scatter' | 'line' | 'pie'>;
declare function ChartProvider<TSeriesType extends ChartSeriesType, TSignatures extends readonly ChartAnyPluginSignature[]>(props: React.PropsWithChildren<ChartProviderProps<TSeriesType, TSignatures>>): React.JSX.Element;
export { ChartProvider };