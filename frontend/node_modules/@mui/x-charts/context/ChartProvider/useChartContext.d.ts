import { ChartAnyPluginSignature } from "../../internals/plugins/models/index.js";
import { ChartContextValue } from "./ChartProvider.types.js";
export declare const useChartContext: <TSignatures extends readonly ChartAnyPluginSignature[], TOptionalSignatures extends readonly ChartAnyPluginSignature[] = []>() => ChartContextValue<TSignatures, TOptionalSignatures>;