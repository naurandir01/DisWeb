"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useAnimateInternal = useAnimateInternal;
var React = _interopRequireWildcard(require("react"));
var _useEnhancedEffect = _interopRequireDefault(require("@mui/utils/useEnhancedEffect"));
var _animation = require("./animation");
var _Transition = require("./Transition");
var _shallowEqual = require("../shallowEqual");
/** Animates a ref. The animation can be skipped by setting {@link skip} to true.
 *
 * If possible, prefer {@link useAnimate}.
 *
 * - If {@link skip} is false, a transition will be started.
 * - If {@link skip} is true and no transition is in progress, no transition will be started and {@link applyProps} will
 *   never be called.
 * - If {@link skip} becomes true and a transition is in progress, the transition will immediately end and
 *   {@link applyProps} be called with the final value.
 * */
function useAnimateInternal(props, {
  createInterpolator,
  applyProps,
  skip,
  initialProps = props
}) {
  const lastInterpolatedPropsRef = React.useRef(initialProps);
  const transitionRef = React.useRef(null);
  const elementRef = React.useRef(null);
  const lastPropsRef = React.useRef(props);
  (0, _useEnhancedEffect.default)(() => {
    lastPropsRef.current = props;
  }, [props]);
  (0, _useEnhancedEffect.default)(() => {
    if (skip) {
      transitionRef.current?.finish();
      transitionRef.current = null;
      elementRef.current = null;
      lastInterpolatedPropsRef.current = props;
    }
  }, [props, skip]);
  const animate = React.useCallback(element => {
    const lastInterpolatedProps = lastInterpolatedPropsRef.current;
    const interpolate = createInterpolator(lastInterpolatedProps, props);
    transitionRef.current = new _Transition.Transition(_animation.ANIMATION_DURATION_MS, _animation.ANIMATION_TIMING_FUNCTION_JS, t => {
      const interpolatedProps = interpolate(t);
      lastInterpolatedPropsRef.current = interpolatedProps;
      applyProps(element, interpolatedProps);
    });
  }, [applyProps, createInterpolator, props]);
  const setRef = React.useCallback(element => {
    if (element === null) {
      transitionRef.current?.stop();
      return;
    }
    const lastElement = elementRef.current;
    if (lastElement === element) {
      // If it's the same element and same props, resume the transition.
      if ((0, _shallowEqual.shallowEqual)(lastPropsRef.current, props)) {
        transitionRef.current?.resume();
        return;
      }

      // If props aren't the same, stop the transition and start a new animation.
      transitionRef.current?.stop();
    }

    // If it's a different element, stop the transition of the last element and start a new animation.
    if (lastElement) {
      transitionRef.current?.stop();
    }
    elementRef.current = element;
    if (transitionRef.current || !skip) {
      animate(element);
    }
  }, [animate, props, skip]);
  return setRef;
}