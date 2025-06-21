'use client';

import * as React from 'react';
import { styled } from '@mui/material/styles';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import { ANIMATION_DURATION_MS, ANIMATION_TIMING_FUNCTION } from "../internals/animation/animation.js";
import { cleanId } from "../internals/cleanId.js";
import { useChartId, useDrawingArea } from "../hooks/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export const appearingMaskClasses = generateUtilityClasses('MuiAppearingMask', ['animate']);
const AnimatedRect = styled('rect')({
  animationName: 'animate-width',
  animationTimingFunction: ANIMATION_TIMING_FUNCTION,
  animationDuration: '0s',
  [`&.${appearingMaskClasses.animate}`]: {
    animationDuration: `${ANIMATION_DURATION_MS}ms`
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
export function AppearingMask(props) {
  const drawingArea = useDrawingArea();
  const chartId = useChartId();
  const clipId = cleanId(`${chartId}-${props.id}`);
  return /*#__PURE__*/_jsxs(React.Fragment, {
    children: [/*#__PURE__*/_jsx("clipPath", {
      id: clipId,
      children: /*#__PURE__*/_jsx(AnimatedRect, {
        className: props.skipAnimation ? '' : appearingMaskClasses.animate,
        x: 0,
        y: 0,
        width: drawingArea.left + drawingArea.width + drawingArea.right,
        height: drawingArea.top + drawingArea.height + drawingArea.bottom
      })
    }), /*#__PURE__*/_jsx("g", {
      clipPath: `url(#${clipId})`,
      children: props.children
    })]
  });
}