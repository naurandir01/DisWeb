import * as React from 'react';
import type { AreaElementOwnerState } from "./AreaElement.js";
export interface AnimatedAreaProps extends React.ComponentPropsWithoutRef<'path'> {
  ownerState: AreaElementOwnerState;
  d: string;
  /**
   * If `true`, animations are skipped.
   * @default false
   */
  skipAnimation?: boolean;
}
/**
 * Demos:
 *
 * - [Lines](https://mui.com/x/react-charts/lines/)
 * - [Areas demonstration](https://mui.com/x/react-charts/areas-demo/)
 *
 * API:
 *
 * - [AreaElement API](https://mui.com/x/api/charts/animated-area/)
 */
declare function AnimatedArea(props: AnimatedAreaProps): React.JSX.Element;
declare namespace AnimatedArea {
  var propTypes: any;
}
export { AnimatedArea };