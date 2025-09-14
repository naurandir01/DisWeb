import * as React from 'react';
import { RadarSeriesMarksProps } from "./RadarSeriesPlot.types.js";
import { RadarSeriesPlotClasses } from "./radarSeriesPlotClasses.js";
import { SeriesId } from "../../models/seriesType/common.js";
import { HighlightItemData } from "../../internals/plugins/featurePlugins/useChartHighlight/index.js";
interface GetCirclePropsParams {
  seriesId: SeriesId;
  classes: RadarSeriesPlotClasses;
  isFaded: (item: HighlightItemData | null) => boolean;
  isHighlighted: (item: HighlightItemData | null) => boolean;
  point: {
    x: number;
    y: number;
  };
  fillArea?: boolean;
  color: string;
}
export declare function getCircleProps(params: GetCirclePropsParams): React.SVGProps<SVGCircleElement>;
declare function RadarSeriesMarks(props: RadarSeriesMarksProps): React.JSX.Element;
declare namespace RadarSeriesMarks {
  var propTypes: any;
}
export { RadarSeriesMarks };