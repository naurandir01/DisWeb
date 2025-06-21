"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimateGaugeValueArc = useAnimateGaugeValueArc;
var _d3Shape = require("@mui/x-charts-vendor/d3-shape");
var _d3Interpolate = require("@mui/x-charts-vendor/d3-interpolate");
var _useAnimate = require("./useAnimate");
function gaugeValueArcPropsInterpolator(from, to) {
  const interpolateStartAngle = (0, _d3Interpolate.interpolateNumber)(from.startAngle, to.startAngle);
  const interpolateEndAngle = (0, _d3Interpolate.interpolateNumber)(from.endAngle, to.endAngle);
  const interpolateInnerRadius = (0, _d3Interpolate.interpolateNumber)(from.innerRadius, to.innerRadius);
  const interpolateOuterRadius = (0, _d3Interpolate.interpolateNumber)(from.outerRadius, to.outerRadius);
  const interpolateCornerRadius = (0, _d3Interpolate.interpolateNumber)(from.cornerRadius, to.cornerRadius);
  return t => {
    return {
      startAngle: interpolateStartAngle(t),
      endAngle: interpolateEndAngle(t),
      innerRadius: interpolateInnerRadius(t),
      outerRadius: interpolateOuterRadius(t),
      cornerRadius: interpolateCornerRadius(t)
    };
  };
}

/** Animates a arc of a gauge chart by increasing the `endAngle` from the start angle to the end angle.
 * The props object also accepts a `ref` which will be merged with the ref returned from this hook. This means you can
 * pass the ref returned by this hook to the `path` element and the `ref` provided as argument will also be called. */
function useAnimateGaugeValueArc(props) {
  return (0, _useAnimate.useAnimate)({
    startAngle: props.startAngle,
    endAngle: props.endAngle,
    innerRadius: props.innerRadius,
    outerRadius: props.outerRadius,
    cornerRadius: props.cornerRadius
  }, {
    createInterpolator: gaugeValueArcPropsInterpolator,
    transformProps: p => ({
      d: (0, _d3Shape.arc)().cornerRadius(p.cornerRadius)({
        innerRadius: p.innerRadius,
        outerRadius: p.outerRadius,
        startAngle: p.startAngle,
        endAngle: p.endAngle
      })
    }),
    applyProps(element, p) {
      element.setAttribute('d', p.d);
    },
    initialProps: {
      startAngle: props.startAngle,
      endAngle: props.startAngle,
      innerRadius: props.innerRadius,
      outerRadius: props.outerRadius,
      cornerRadius: props.cornerRadius
    },
    skip: props.skipAnimation,
    ref: props.ref
  });
}