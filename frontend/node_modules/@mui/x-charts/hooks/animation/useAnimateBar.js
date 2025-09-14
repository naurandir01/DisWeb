"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimateBar = useAnimateBar;
var _d3Interpolate = require("@mui/x-charts-vendor/d3-interpolate");
var _useAnimate = require("./useAnimate");
function barPropsInterpolator(from, to) {
  const interpolateX = (0, _d3Interpolate.interpolateNumber)(from.x, to.x);
  const interpolateY = (0, _d3Interpolate.interpolateNumber)(from.y, to.y);
  const interpolateWidth = (0, _d3Interpolate.interpolateNumber)(from.width, to.width);
  const interpolateHeight = (0, _d3Interpolate.interpolateNumber)(from.height, to.height);
  return t => {
    return {
      x: interpolateX(t),
      y: interpolateY(t),
      width: interpolateWidth(t),
      height: interpolateHeight(t)
    };
  };
}

/**
 * Animates a bar from the start of the axis (x-axis for vertical layout, y-axis for horizontal layout) to its
 * final position.
 *
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called.
 */
function useAnimateBar(props) {
  const initialProps = {
    x: props.layout === 'vertical' ? props.x : props.xOrigin,
    y: props.layout === 'vertical' ? props.yOrigin : props.y,
    width: props.layout === 'vertical' ? props.width : 0,
    height: props.layout === 'vertical' ? 0 : props.height
  };
  return (0, _useAnimate.useAnimate)({
    x: props.x,
    y: props.y,
    width: props.width,
    height: props.height
  }, {
    createInterpolator: barPropsInterpolator,
    applyProps(element, animatedProps) {
      element.setAttribute('x', animatedProps.x.toString());
      element.setAttribute('y', animatedProps.y.toString());
      element.setAttribute('width', animatedProps.width.toString());
      element.setAttribute('height', animatedProps.height.toString());
    },
    transformProps: p => p,
    initialProps,
    skip: props.skipAnimation,
    ref: props.ref
  });
}