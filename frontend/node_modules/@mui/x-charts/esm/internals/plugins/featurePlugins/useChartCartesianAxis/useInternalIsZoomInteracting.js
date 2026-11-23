'use client';

import { useSelector } from "../../../store/useSelector.js";
import { useStore } from "../../../store/useStore.js";
import { selectorChartZoomIsInteracting } from "./useChartCartesianAxisRendering.selectors.js";
/**
 * Check if the zoom is interacting.
 *
 * This should probably be moved/merged to the AnimationContext when we move it to the new API.
 *
 * @ignore Internal hook, similar to the PRO one.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
export function useInternalIsZoomInteracting() {
  const store = useStore();
  const isInteracting = useSelector(store, selectorChartZoomIsInteracting);
  return isInteracting;
}