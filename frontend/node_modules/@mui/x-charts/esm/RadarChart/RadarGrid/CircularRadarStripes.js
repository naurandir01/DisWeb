import * as React from 'react';
import { jsx as _jsx } from "react/jsx-runtime";
const getPath = (center, outerRadius, innerRadius) => [`M ${center.x - outerRadius} ${center.y}`, `A ${outerRadius} ${outerRadius} 0 1 0 ${center.x + outerRadius} ${center.y}`, `A ${outerRadius} ${outerRadius} 0 1 0 ${center.x - outerRadius} ${center.y} Z`, `M ${center.x - innerRadius} ${center.y}`, `A ${innerRadius} ${innerRadius} 0 1 0 ${center.x + innerRadius} ${center.y}`, `A ${innerRadius} ${innerRadius} 0 1 0 ${center.x - innerRadius} ${center.y} Z`].join('');

/**
 * @ignore - internal component.
 */
export function CircularRadarStripes(props) {
  const {
    center,
    divisions,
    radius,
    stripeColor,
    classes
  } = props;
  const divisionRadius = Array.from({
    length: divisions
  }, (_, index) => radius * (index + 1) / divisions);
  return /*#__PURE__*/_jsx(React.Fragment, {
    children: divisionRadius.map((r, index) => {
      const smallerRadius = divisionRadius[index - 1] ?? 0;
      return /*#__PURE__*/_jsx("path", {
        d: getPath(center, r, smallerRadius),
        fillRule: "evenodd",
        fill: stripeColor?.(index) ?? 'none',
        fillOpacity: 0.1,
        className: classes?.stripe
      }, r);
    })
  });
}