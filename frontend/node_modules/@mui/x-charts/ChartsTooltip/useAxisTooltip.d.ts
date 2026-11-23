import { SeriesId } from "../models/seriesType/common.js";
import { CartesianChartSeriesType, ChartsSeriesConfig, PolarChartSeriesType } from "../models/seriesType/config.js";
import { ComputedAxis, PolarAxisDefaultized, AxisId } from "../models/axis.js";
import { ChartsLabelMarkProps } from "../ChartsLabel/index.js";
export interface UseAxisTooltipReturnValue<SeriesT extends CartesianChartSeriesType | PolarChartSeriesType = CartesianChartSeriesType | PolarChartSeriesType, AxisValueT extends string | number | Date = string | number | Date> {
  axisDirection: SeriesT extends CartesianChartSeriesType ? 'x' | 'y' : 'rotation' | 'radius';
  mainAxis: SeriesT extends CartesianChartSeriesType ? ComputedAxis : PolarAxisDefaultized;
  axisId: AxisId;
  axisValue: AxisValueT;
  axisFormattedValue: string;
  dataIndex: number;
  seriesItems: SeriesItem<SeriesT>[];
}
export interface UseAxisTooltipParams {
  /**
   * If `true`, the hook returns an array with an object per active axis.
   */
  multipleAxes?: boolean;
  /**
   * The axis directions to consider.
   * If not defined, all directions are considered
   */
  directions?: ('x' | 'y' | 'rotation')[];
}
interface SeriesItem<T extends CartesianChartSeriesType | PolarChartSeriesType> {
  seriesId: SeriesId;
  color: string;
  value: ChartsSeriesConfig[T]['valueType'];
  formattedValue: string;
  formattedLabel: string | null;
  markType: ChartsLabelMarkProps['type'];
}
/**
 * @deprecated Use `useAxesTooltip` instead.
 */
export declare function useAxisTooltip(params: UseAxisTooltipParams & {
  multipleAxes: true;
}): UseAxisTooltipReturnValue[] | null;
export declare function useAxisTooltip(params?: UseAxisTooltipParams & {
  multipleAxes?: false;
}): UseAxisTooltipReturnValue | null;
export {};