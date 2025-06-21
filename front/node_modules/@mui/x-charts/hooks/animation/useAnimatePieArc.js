"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimatePieArc = useAnimatePieArc;
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
var _d3Interpolate = require("@mui/x-charts-vendor/d3-interpolate");
var _useAnimate = require("./useAnimate");
function pieArcPropsInterpolator(from, to) {
  const interpolateStartAngle = (0, _d3Interpolate.interpolateNumber)(from.startAngle, to.startAngle);
  const interpolateEndAngle = (0, _d3Interpolate.interpolateNumber)(from.endAngle, to.endAngle);
  const interpolateInnerRadius = (0, _d3Interpolate.interpolateNumber)(from.innerRadius, to.innerRadius);
  const interpolateOuterRadius = (0, _d3Interpolate.interpolateNumber)(from.outerRadius, to.outerRadius);
  const interpolatePaddingAngle = (0, _d3Interpolate.interpolateNumber)(from.paddingAngle, to.paddingAngle);
  const interpolateCornerRadius = (0, _d3Interpolate.interpolateNumber)(from.cornerRadius, to.cornerRadius);
  return t => {
    return {
      startAngle: interpolateStartAngle(t),
      endAngle: interpolateEndAngle(t),
      innerRadius: interpolateInnerRadius(t),
      outerRadius: interpolateOuterRadius(t),
      paddingAngle: interpolatePaddingAngle(t),
      cornerRadius: interpolateCornerRadius(t)
    };
  };
}

/** Animates a slice of a pie chart by increasing the start and end angles from the middle angle to their final values.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
function useAnimatePieArc(props) {
  const initialProps = {
    startAngle: (props.startAngle + props.endAngle) / 2,
    endAngle: (props.startAngle + props.endAngle) / 2,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    paddingAngle: props.paddingAngle,
    cornerRadius: props.cornerRadius
  };
  return (0, _useAnimate.useAnimate)({
    startAngle: props.startAngle,
    endAngle: props.endAngle,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    paddingAngle: props.paddingAngle,
    cornerRadius: props.cornerRadius
  }, {
    createInterpolator: pieArcPropsInterpolator,
    transformProps: p => ({
      d: (0, _d3Shape.arc)().cornerRadius(p.cornerRadius)({
        padAngle: p.paddingAngle,
        innerRadius: p.innerRadius,
        outerRadius: p.outerRadius,
        startAngle: p.startAngle,
        endAngle: p.endAngle
      }),
      visibility: p.startAngle === p.endAngle ? 'hidden' : 'visible'
    }),
    applyProps(element, p) {
      element.setAttribute('d', p.d);
      element.setAttribute('visibility', p.visibility);
    },
    initialProps,
    skip: props.skipAnimation,
    ref: props.ref
  });
}