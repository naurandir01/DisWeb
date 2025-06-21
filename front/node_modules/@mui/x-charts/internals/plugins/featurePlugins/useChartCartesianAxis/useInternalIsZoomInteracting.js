"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useInternalIsZoomInteracting = useInternalIsZoomInteracting;
var _useSelector = require("../../../store/useSelector");
var _useStore = require("../../../store/useStore");
var _useChartCartesianAxisRendering = require("./useChartCartesianAxisRendering.selectors");
/**
 * Check if the zoom is interacting.
 *
 * This should probably be moved/merged to the AnimationContext when we move it to the new API.
 *
 * @ignore Internal hook, similar to the PRO one.
 *
 * @returns {boolean} Inform the zoom is interacting.
 */
function useInternalIsZoomInteracting() {
  const store = (0, _useStore.useStore)();
  const isInteracting = (0, _useSelector.useSelector)(store, _useChartCartesianAxisRendering.selectorChartZoomIsInteracting);
  return isInteracting;
}