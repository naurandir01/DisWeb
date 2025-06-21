import { AxisConfig, ScaleName } from "../../../../models/index.js";
import { ChartsAxisProps, ChartsRotationAxisProps, ChartsRadiusAxisProps, PolarAxisDefaultized, AxisId } from "../../../../models/axis.js";
import { ChartSeriesType } from "../../../../models/seriesType/config.js";
import type { ChartDrawingArea } from "../../../../hooks/index.js";
import { ChartSeriesConfig } from "../../models/seriesConfig/index.js";
import { ProcessedSeries } from "../../corePlugins/useChartSeries/useChartSeries.types.js";
export type DefaultizedAxisConfig<AxisProps extends ChartsRotationAxisProps | ChartsRadiusAxisProps> = {
  [axisId: AxisId]: PolarAxisDefaultized<ScaleName, any, AxisProps>;
};
export type ComputeResult<T extends ChartsAxisProps> = {
  axis: DefaultizedAxisConfig<T>;
  axisIds: string[];
};
type ComputeCommonParams<T extends ChartSeriesType = ChartSeriesType> = {
  drawingArea: ChartDrawingArea;
  formattedSeries: ProcessedSeries<T>;
  seriesConfig: ChartSeriesConfig<T>;
};
export declare function computeAxisValue<T extends ChartSeriesType>(options: ComputeCommonParams<T> & {
  axis?: AxisConfig<'linear', any, ChartsRadiusAxisProps>[];
  axisDirection: 'radius';
}): ComputeResult<ChartsRadiusAxisProps>;
export declare function computeAxisValue<T extends ChartSeriesType>(options: ComputeCommonParams<T> & {
  axis?: AxisConfig<ScaleName, any, ChartsRotationAxisProps>[];
  axisDirection: 'rotation';
}): ComputeResult<ChartsRotationAxisProps>;
export {};