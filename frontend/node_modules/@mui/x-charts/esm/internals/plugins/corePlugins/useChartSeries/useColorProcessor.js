'use client';

import * as React from 'react';
import { useSelector } from "../../../store/useSelector.js";
import { useStore } from "../../../store/useStore.js";
import { selectorChartSeriesConfig } from "./useChartSeries.selectors.js";
export function useColorProcessor(seriesType) {
  const store = useStore();
  const seriesConfig = useSelector(store, selectorChartSeriesConfig);
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