'use client';

import * as React from 'react';
import { ChartContext } from "./ChartContext.js";
export const useChartContext = () => {
  const context = React.useContext(ChartContext);
  if (context == null) {
    throw new Error(['MUI X Charts: Could not find the Chart context.', 'It looks like you rendered your component outside of a ChartDataProvider.', 'This can also happen if you are bundling multiple versions of the library.'].join('\n'));
  }
  return context;
};