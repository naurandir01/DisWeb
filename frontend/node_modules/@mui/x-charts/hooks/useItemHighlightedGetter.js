"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useItemHighlightedGetter = useItemHighlightedGetter;
var _useSelector = require("../internals/store/useSelector");
var _useStore = require("../internals/store/useStore");
var _useChartHighlight = require("../internals/plugins/featurePlugins/useChartHighlight/useChartHighlight.selectors");
/**
 * A hook to check the highlighted state of multiple items.
 * If you're interested by a single one, consider using `useItemHighlighted`.
 *
 * Warning: highlighted and faded can both be true at the same time.
 * We recommend to first test if item is highlighted: `const faded = !highlighted && isFaded(item)`
 * @returns {{ isHighlighted, isFaded }} callbacks to get the state of the item.
 */
function useItemHighlightedGetter() {
  const store = (0, _useStore.useStore)();
  const isHighlighted = (0, _useSelector.useSelector)(store, _useChartHighlight.selectorChartsIsHighlightedCallback);
  const isFaded = (0, _useSelector.useSelector)(store, _useChartHighlight.selectorChartsIsFadedCallback);
  return {
    isHighlighted,
    isFaded
  };
}