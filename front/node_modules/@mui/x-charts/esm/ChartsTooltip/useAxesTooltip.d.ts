import { UseAxisTooltipParams, UseAxisTooltipReturnValue } from "./useAxisTooltip.js";
type UseAxesTooltipParams = Omit<UseAxisTooltipParams, 'multipleAxes'>;
/**
 * Returns the axes to display in the tooltip and the series item related to them.
 */
export declare function useAxesTooltip(params?: UseAxesTooltipParams): UseAxisTooltipReturnValue[] | null;
export {};