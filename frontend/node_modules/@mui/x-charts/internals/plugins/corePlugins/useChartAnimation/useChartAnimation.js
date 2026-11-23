"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartAnimation = void 0;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var React = _interopRequireWildcard(require("react"));
var _useEnhancedEffect = _interopRequireDefault(require("@mui/utils/useEnhancedEffect"));
const useChartAnimation = ({
  params,
  store
}) => {
  React.useEffect(() => {
    store.update(prevState => {
      return (0, _extends2.default)({}, prevState, {
        animation: (0, _extends2.default)({}, prevState.animation, {
          skip: params.skipAnimation
        })
      });
    });
  }, [store, params.skipAnimation]);
  const disableAnimation = React.useCallback(() => {
    let disableCalled = false;
    store.update(prevState => (0, _extends2.default)({}, prevState, {
      animation: (0, _extends2.default)({}, prevState.animation, {
        skipAnimationRequests: prevState.animation.skipAnimationRequests + 1
      })
    }));
    return () => {
      if (disableCalled) {
        return;
      }
      disableCalled = true;
      store.update(prevState => (0, _extends2.default)({}, prevState, {
        animation: (0, _extends2.default)({}, prevState.animation, {
          skipAnimationRequests: prevState.animation.skipAnimationRequests - 1
        })
      }));
    };
  }, [store]);
  (0, _useEnhancedEffect.default)(() => {
    // Skip animation test/jsdom
    const isAnimationDisabledEnvironment = typeof window === 'undefined' || !window?.matchMedia;
    if (isAnimationDisabledEnvironment) {
      return undefined;
    }
    let disableAnimationCleanup;
    const handleMediaChange = event => {
      if (event.matches) {
        disableAnimationCleanup = disableAnimation();
      } else {
        disableAnimationCleanup?.();
      }
    };
    const mql = window.matchMedia('(prefers-reduced-motion)');
    handleMediaChange(mql);
    mql.addEventListener('change', handleMediaChange);
    return () => {
      mql.removeEventListener('change', handleMediaChange);
    };
  }, [disableAnimation, store]);
  return {
    instance: {
      disableAnimation
    }
  };
};
exports.useChartAnimation = useChartAnimation;
useChartAnimation.params = {
  skipAnimation: true
};
useChartAnimation.getDefaultizedParams = ({
  params
}) => (0, _extends2.default)({}, params, {
  skipAnimation: params.skipAnimation ?? false
});
useChartAnimation.getInitialState = ({
  skipAnimation
}) => {
  const isAnimationDisabledEnvironment = typeof window === 'undefined' || !window?.matchMedia;

  // We use the value of `isAnimationDisabledEnvironment` as the initial value of `skipAnimation` to avoid
  // re-rendering the component on environments where matchMedia is not supported, hence skipAnimation will always be true.
  const disableAnimations = process.env.NODE_ENV === 'test' ? isAnimationDisabledEnvironment : false;
  return {
    animation: {
      skip: skipAnimation,
      // By initializing the skipAnimationRequests to 1, we ensure that the animation is always skipped
      skipAnimationRequests: disableAnimations ? 1 : 0
    }
  };
};