'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import { useAxisTooltip } from "./useAxisTooltip.js";
/**
 * Returns the axes to display in the tooltip and the series item related to them.
 */
export function useAxesTooltip(params) {
  return useAxisTooltip(_extends({}, params, {
    multipleAxes: true
  }));
}