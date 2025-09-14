import { ChartDrawingArea } from "../hooks/index.js";
import { DefaultizedPieSeriesType } from "../models/seriesType/pie.js";
export declare function getPieCoordinates(series: Pick<DefaultizedPieSeriesType, 'cx' | 'cy'>, drawing: Pick<ChartDrawingArea, 'width' | 'height'>): {
  cx: number;
  cy: number;
  availableRadius: number;
};