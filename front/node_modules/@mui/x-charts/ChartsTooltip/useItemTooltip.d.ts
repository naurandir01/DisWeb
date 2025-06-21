import { ChartSeriesType } from "../models/seriesType/config.js";
import { ItemTooltip, ItemTooltipWithMultipleValues } from "../internals/plugins/models/seriesConfig/tooltipGetter.types.js";
export type UseItemTooltipReturnValue<T extends ChartSeriesType> = ItemTooltip<T>;
export type UseRadarItemTooltipReturnValue = ItemTooltipWithMultipleValues<'radar'>;
export declare function useInternalItemTooltip<T extends ChartSeriesType>(): (T extends 'radar' ? ItemTooltipWithMultipleValues<T> : ItemTooltip<T>) | null;
/**
 * Returns a config object when the tooltip contains a single item to display.
 * Some specific charts like radar need more complex structure. Use specific hook like `useRadarItemTooltip` for them.
 * @returns The tooltip item config
 */
export declare const useItemTooltip: <T extends Exclude<ChartSeriesType, "radar">>() => UseItemTooltipReturnValue<T> | null;
/**
 * Contains an object per value with their content and the label of the associated metric.
 * @returns The tooltip item configs
 */
export declare const useRadarItemTooltip: () => UseRadarItemTooltipReturnValue | null;