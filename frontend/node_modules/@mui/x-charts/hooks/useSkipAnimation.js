"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useSkipAnimation = useSkipAnimation;
var _useChartAnimation = require("../internals/plugins/corePlugins/useChartAnimation");
var _useStore = require("../internals/store/useStore");
var _useSelector = require("../internals/store/useSelector");
/**
 * A hook to get if chart animations should be skipped.
 *
 * @returns {boolean} whether to skip animations
 */
function useSkipAnimation(skipAnimation) {
  const store = (0, _useStore.useStore)();
  const storeSkipAnimation = (0, _useSelector.useSelector)(store, _useChartAnimation.selectorChartSkipAnimation);
  return skipAnimation || storeSkipAnimation;
}