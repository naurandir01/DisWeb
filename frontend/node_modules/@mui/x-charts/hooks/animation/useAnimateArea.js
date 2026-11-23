"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimateArea = useAnimateArea;
var _d3Interpolate = require("@mui/x-charts-vendor/d3-interpolate");
var _useAnimate = require("./useAnimate");
/** Animates an area of a line chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
function useAnimateArea(props) {
  return (0, _useAnimate.useAnimate)({
    d: props.d
  }, {
    createInterpolator: (lastProps, newProps) => {
      const interpolate = (0, _d3Interpolate.interpolateString)(lastProps.d, newProps.d);
      return t => ({
        d: interpolate(t)
      });
    },
    applyProps: (element, {
      d
    }) => element.setAttribute('d', d),
    transformProps: p => p,
    skip: props.skipAnimation,
    ref: props.ref
  });
}