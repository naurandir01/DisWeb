"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppearingMask = AppearingMask;
exports.appearingMaskClasses = void 0;
var React = _interopRequireWildcard(require("react"));
var _styles = require("@mui/material/styles");
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _animation = require("../internals/animation/animation");
var _cleanId = require("../internals/cleanId");
var _hooks = require("../hooks");
var _jsxRuntime = require("react/jsx-runtime");
const appearingMaskClasses = exports.appearingMaskClasses = (0, _generateUtilityClasses.default)('MuiAppearingMask', ['animate']);
const AnimatedRect = (0, _styles.styled)('rect')({
  animationName: 'animate-width',
  animationTimingFunction: _animation.ANIMATION_TIMING_FUNCTION,
  animationDuration: '0s',
  [`&.${appearingMaskClasses.animate}`]: {
    animationDuration: `${_animation.ANIMATION_DURATION_MS}ms`
  },
  '@keyframes animate-width': {
    from: {
      width: 0
    }
  }
});

/**
 * @ignore - internal component.
 */
function AppearingMask(props) {
  const drawingArea = (0, _hooks.useDrawingArea)();
  const chartId = (0, _hooks.useChartId)();
  const clipId = (0, _cleanId.cleanId)(`${chartId}-${props.id}`);
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("clipPath", {
      id: clipId,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(AnimatedRect, {
        className: props.skipAnimation ? '' : appearingMaskClasses.animate,
        x: 0,
        y: 0,
        width: drawingArea.left + drawingArea.width + drawingArea.right,
        height: drawingArea.top + drawingArea.height + drawingArea.bottom
      })
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("g", {
      clipPath: `url(#${clipId})`,
      children: props.children
    })]
  });
}