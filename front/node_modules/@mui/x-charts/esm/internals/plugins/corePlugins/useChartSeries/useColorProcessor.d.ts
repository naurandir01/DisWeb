import { ChartSeriesType } from "../../../../models/seriesType/config.js";
import { ColorProcessor } from "../../models/seriesConfig/index.js";
export type ColorProcessorsConfig<T extends ChartSeriesType> = { [Key in T]?: ColorProcessor<Key> };
export declare function useColorProcessor<T extends ChartSeriesType>(seriesType: T): ColorProcessor<T>;
export declare function useColorProcessor(): ColorProcessorsConfig<ChartSeriesType>;