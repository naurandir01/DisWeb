import * as React from 'react';
import { MarkElementOwnerState } from "./markElementClasses.js";
export type CircleMarkElementProps = Omit<MarkElementOwnerState, 'isFaded' | 'isHighlighted'> & Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> & {
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
  /**
   * The index to the element in the series' data array.
   */
  dataIndex: number;
  /**
   * If `true`, the marker is faded.
   * @default false
   */
  isFaded?: boolean;
  /**
   * If `true`, the marker is highlighted.
   * @default false
   */
  isHighlighted?: boolean;
};
/**
 * The line mark element that only render circle for performance improvement.
 *
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Line demonstration](https://mui.com/x/react-charts/line-demo/)
 *
 * API:
 *
 * - [CircleMarkElement API](https://mui.com/x/api/charts/circle-mark-element/)
 */
declare function CircleMarkElement(props: CircleMarkElementProps): React.JSX.Element;
declare namespace CircleMarkElement {
  var propTypes: any;
}
export { CircleMarkElement };