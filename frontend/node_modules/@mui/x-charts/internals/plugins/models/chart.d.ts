import type { ChartAnyPluginSignature } from "./plugin.js";
import type { MergeSignaturesProperty } from "./helpers.js";
import type { ChartCorePluginSignatures } from "../corePlugins/index.js";
export type ChartInstance<TSignatures extends readonly ChartAnyPluginSignature[], TOptionalSignatures extends readonly ChartAnyPluginSignature[] = []> = MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'instance'> & Partial<MergeSignaturesProperty<TOptionalSignatures, 'instance'>>;
export type ChartPublicAPI<TSignatures extends readonly ChartAnyPluginSignature[], TOptionalSignatures extends readonly ChartAnyPluginSignature[] = []> = MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'publicAPI'> & Partial<MergeSignaturesProperty<TOptionalSignatures, 'instance'>>;
export type ChartStateCacheKey = {
  id: number;
};
export type ChartState<TSignatures extends readonly ChartAnyPluginSignature[], TOptionalSignatures extends readonly ChartAnyPluginSignature[] = []> = MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'state'> & Partial<MergeSignaturesProperty<TOptionalSignatures, 'state'>> & {
  /**
   * The key used to identify the chart in the global cache object.
   */
  cacheKey: ChartStateCacheKey;
};