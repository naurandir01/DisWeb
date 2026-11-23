"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimate = useAnimate;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _useForkRef = _interopRequireDefault(require("@mui/utils/useForkRef"));
var _useAnimateInternal = require("../../internals/animation/useAnimateInternal");
/**
 * Hook to customize the animation of an element.
 * Animates a ref from `initialProps` to `props`.
 *
 * @param {object} props The props to animate to.
 *
 * @returns an object containing a ref that should be passed to the element to animate and the transformed props.
 * If `skip` is true, the transformed props are the `props` to animate to; if it is false, the transformed props are the
 * `initialProps`.
 *
 * The animated props are only accessible in `applyProps`. The props returned from this hook are not animated.
 *
 * When an animation starts, an interpolator is created using `createInterpolator`.
 * On every animation frame:
 * 1. The interpolator is called to get the interpolated props;
 * 2. `transformProps` is called to transform the interpolated props;
 * 3. `applyProps` is called to apply the transformed props to the element.
 *
 * If `props` change while an animation is progress, the animation will continue towards the new `props`.
 *
 * The animation can be skipped by setting `skip` to true. If a transition is in progress, it will immediately end
 * and `applyProps` be called with the final value. If there isn't a transition in progress, a new one won't be
 * started and `applyProps` will not be called.
 * */
function useAnimate(props, {
  createInterpolator,
  transformProps,
  applyProps,
  skip,
  initialProps = props,
  ref
}) {
  const transform = transformProps ?? (p => p);
  const animateRef = (0, _useAnimateInternal.useAnimateInternal)(props, {
    initialProps,
    createInterpolator,
    applyProps: (element, animatedProps) => applyProps(element, transform(animatedProps)),
    skip
  });
  const usedProps = skip ? props : initialProps;
  return (0, _extends2.default)({}, transformProps(usedProps), {
    ref: (0, _useForkRef.default)(animateRef, ref)
  });
}