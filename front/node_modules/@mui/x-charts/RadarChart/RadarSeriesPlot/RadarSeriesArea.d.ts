import * as React from 'react';
import { RadarSeriesAreaProps } from "./RadarSeriesPlot.types.js";
import { RadarSeriesPlotClasses } from "./radarSeriesPlotClasses.js";
import { SeriesId } from "../../models/seriesType/common.js";
import { HighlightItemData } from "../../internals/plugins/featurePlugins/useChartHighlight/index.js";
interface GetPathPropsParams {
  seriesId: SeriesId;
  classes: RadarSeriesPlotClasses;
  isFaded: (item: HighlightItemData | null) => boolean;
  isHighlighted: (item: HighlightItemData | null) => boolean;
  points: {
    x: number;
    y: number;
  }[];
  fillArea?: boolean;
  color: string;
}
export declare function getPathProps(params: GetPathPropsParams): React.SVGProps<SVGPathElement>;
declare function RadarSeriesArea(props: RadarSeriesAreaProps): React.JSX.Element;
declare namespace RadarSeriesArea {
  var propTypes: any;
}
export { RadarSeriesArea };