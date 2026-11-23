import { MakeOptional } from '@mui/x-internals/types';
import { ChartPluginSignature } from "../../models/index.js";
import { DatasetType } from "../../../../models/seriesType/config.js";
import { AxisId } from "../../../../models/axis.js";
import { ZAxisConfig, ZAxisDefaultized } from "../../../../models/z-axis.js";
type DefaultizedZAxisConfig = {
  [axisId: string]: ZAxisDefaultized;
};
export interface UseChartZAxisParameters {
  /**
   * The configuration of the z-axes.
   */
  zAxis?: readonly MakeOptional<ZAxisConfig, 'id'>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: Readonly<DatasetType>;
}
export type UseChartZAxisDefaultizedParameters = UseChartZAxisParameters;
export interface UseChartZAxisState {
  zAxis: {
    /**
     * Mapping from z-axis key to scaling configuration.
     */
    axis: DefaultizedZAxisConfig;
    /**
     * The z-axes IDs sorted by order they got provided.
     */
    axisIds: AxisId[];
  };
}
export type UseChartZAxisSignature = ChartPluginSignature<{
  params: UseChartZAxisParameters;
  defaultizedParams: UseChartZAxisDefaultizedParameters;
  state: UseChartZAxisState;
}>;
export {};