"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimateLine = useAnimateLine;
var _d3Interpolate = require("@mui/x-charts-vendor/d3-interpolate");
var _useAnimate = require("./useAnimate");
/** Animates a line of a line chart using a `path` element.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
function useAnimateLine(props) {
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
    skip: props.skipAnimation,
    transformProps: p => p,
    ref: props.ref
  });
}