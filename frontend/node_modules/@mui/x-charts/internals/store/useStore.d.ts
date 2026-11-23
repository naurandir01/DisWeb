import { ChartStore } from "../plugins/utils/ChartStore.js";
import { UseChartInteractionSignature } from "../plugins/featurePlugins/useChartInteraction/index.js";
import { UseChartHighlightSignature } from "../plugins/featurePlugins/useChartHighlight/index.js";
import { ChartAnyPluginSignature } from "../plugins/models/index.js";
export declare function useStore<TSignatures extends ChartAnyPluginSignature[] = []>(): ChartStore<[...TSignatures, UseChartInteractionSignature, UseChartHighlightSignature]>;