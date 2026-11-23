import * as React from 'react';
export type ChartsClipPathProps = {
  /**
   * The id of the clip path.
   */
  id: string;
  /**
   * Offset, in pixels, of the clip path rectangle from the drawing area.
   *
   * A positive value will move the rectangle outside the drawing area.
   */
  offset?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
};
/**
 * API:
 *
 * - [ChartsClipPath API](https://mui.com/x/api/charts/charts-clip-path/)
 */
declare function ChartsClipPath(props: ChartsClipPathProps): React.JSX.Element;
declare namespace ChartsClipPath {
  var propTypes: any;
}
export { ChartsClipPath };