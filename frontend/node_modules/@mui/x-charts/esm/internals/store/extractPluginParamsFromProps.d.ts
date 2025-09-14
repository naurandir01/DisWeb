import { ChartCorePluginSignatures } from "../plugins/corePlugins/index.js";
import { ChartPluginSignature, ConvertSignaturesIntoPlugins, MergeSignaturesProperty } from "../plugins/models/index.js";
import { UseChartBaseProps } from "./useCharts.types.js";
export declare const extractPluginParamsFromProps: <TSignatures extends readonly ChartPluginSignature<any>[], TProps extends Partial<UseChartBaseProps<TSignatures>>>({
  props: {
    apiRef,
    ...props
  },
  plugins
}: {
  props: TProps;
  plugins: ConvertSignaturesIntoPlugins<readonly [...ChartCorePluginSignatures, ...TSignatures]>;
}) => MergeSignaturesProperty<TSignatures, "defaultizedParams">;