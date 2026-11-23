import * as React from 'react';
import type { ChartAnyPluginSignature, ChartInstance, ChartPublicAPI, ConvertSignaturesIntoPlugins, MergeSignaturesProperty } from "../../internals/plugins/models/index.js";
import type { ChartStore } from "../../internals/plugins/utils/ChartStore.js";
import type { ChartCorePluginSignatures } from "../../internals/plugins/corePlugins/index.js";
import type { ChartSeriesConfig } from "../../internals/plugins/models/seriesConfig/index.js";
import type { UseChartBaseProps } from "../../internals/store/useCharts.types.js";
import type { ChartSeriesType } from "../../models/seriesType/config.js";
export type ChartContextValue<TSignatures extends readonly ChartAnyPluginSignature[], TOptionalSignatures extends readonly ChartAnyPluginSignature[] = []> = {
  /**
   * And object with all the methods needed to interact with the chart.
   */
  instance: ChartInstance<TSignatures, TOptionalSignatures>;
  /**
   * A subset of the `instance` method that are exposed to the developers.
   */
  publicAPI: ChartPublicAPI<TSignatures, TOptionalSignatures>;
  /**
   * The internal state of the chart.
   */
  store: ChartStore<TSignatures>;
  /**
   * The ref to the <svg />.
   */
  svgRef: React.RefObject<SVGSVGElement | null>;
  /**
   * The ref to the chart root element.
   */
  chartRootRef: React.RefObject<HTMLDivElement | null>;
};
export type ChartPluginParams<TSignatures extends readonly ChartAnyPluginSignature[]> = UseChartBaseProps<TSignatures> & MergeSignaturesProperty<[...ChartCorePluginSignatures, ...TSignatures], 'params'>;
export interface ChartProviderProps<TSeries extends ChartSeriesType = ChartSeriesType, TSignatures extends readonly ChartAnyPluginSignature[] = []> {
  /**
   * Array of plugins used to add features to the chart.
   */
  plugins?: ConvertSignaturesIntoPlugins<TSignatures>;
  pluginParams?: ChartPluginParams<TSignatures>;
  /**
   * The configuration helpers used to compute attributes according to the series type.
   * @ignore Unstable props for internal usage.
   */
  seriesConfig?: ChartSeriesConfig<TSeries>;
}