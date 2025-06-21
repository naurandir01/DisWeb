"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useColorProcessor = useColorProcessor;
var React = _interopRequireWildcard(require("react"));
var _useSelector = require("../../../store/useSelector");
var _useStore = require("../../../store/useStore");
var _useChartSeries = require("./useChartSeries.selectors");
function useColorProcessor(seriesType) {
  const store = (0, _useStore.useStore)();
  const seriesConfig = (0, _useSelector.useSelector)(store, _useChartSeries.selectorChartSeriesConfig);
  const colorProcessors = React.useMemo(() => {
    const rep = {};
    Object.keys(seriesConfig).forEach(seriesT => {
      // @ts-expect-error https://github.com/microsoft/TypeScript/issues/61555
      rep[seriesT] = seriesConfig[seriesT].colorProcessor;
    });
    return rep;
  }, [seriesConfig]);
  if (!seriesType) {
    return colorProcessors;
  }
  return colorProcessors[seriesType];
}