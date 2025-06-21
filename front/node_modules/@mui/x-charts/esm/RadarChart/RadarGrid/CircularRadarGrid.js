import * as React from 'react';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 * @ignore - internal component.
 */
export function CircularRadarGrid(props) {
  const {
    center,
    corners,
    divisions,
    radius,
    strokeColor,
    classes
  } = props;
  const divisionRadius = Array.from({
    length: divisions
  }, (_, index) => radius * (index + 1) / divisions);
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [corners.map(({
      x,
      y
    }, i) => /*#__PURE__*/_jsx("path", {
      d: `M ${center.x} ${center.y} L ${x} ${y}`,
      stroke: strokeColor,
      strokeWidth: 1,
      strokeOpacity: 0.3,
      fill: "none",
      className: classes?.radial
    }, i)), divisionRadius.map(r => /*#__PURE__*/_jsx("circle", {
      cx: center.x,
      cy: center.y,
      r: r,
      stroke: strokeColor,
      strokeWidth: 1,
      strokeOpacity: 0.3,
      fill: "none",
      className: classes?.divider
    }, r))]
  });
}