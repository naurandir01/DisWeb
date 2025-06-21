import * as React from 'react';
import { SeriesId } from "../models/seriesType/common.js";
export interface ScatterMarkerProps {
  /**
   * The series ID.
   */
  seriesId: SeriesId;
  /**
   * The index of the data point.
   */
  dataIndex: number;
  /**
   * The x coordinate of the data point.
   */
  x: number;
  /**
   * The y coordinate of the data point.
   */
  y: number;
  /**
   * The fill color of the marker.
   */
  color: string;
  /**
   * The size of the marker.
   */
  size: number;
  /**
   * If `true`, the marker is highlighted.
   */
  isHighlighted: boolean;
  /**
   * If `true`, the marker is faded.
   */
  isFaded: boolean;
  /**
   * Callback fired when clicking on a scatter item.
   * @param {MouseEvent} event Mouse event recorded on the `<svg/>` element.
   */
  onClick?: (event: React.MouseEvent<SVGElement, MouseEvent>) => void;
}
declare function ScatterMarker(props: ScatterMarkerProps): React.JSX.Element;
declare namespace ScatterMarker {
  var propTypes: any;
}
export { ScatterMarker };