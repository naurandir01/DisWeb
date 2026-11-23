import * as React from 'react';
import { RadarAxisHighlightClasses } from "./radarAxisHighlightClasses.js";
export interface RadarAxisHighlightProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<RadarAxisHighlightClasses>;
}
declare function RadarAxisHighlight(props: RadarAxisHighlightProps): React.JSX.Element | null;
declare namespace RadarAxisHighlight {
  var propTypes: any;
}
export { RadarAxisHighlight };