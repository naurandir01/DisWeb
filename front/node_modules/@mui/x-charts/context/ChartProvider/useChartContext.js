"use strict";
'use client';

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useChartContext = void 0;
var React = _interopRequireWildcard(require("react"));
var _ChartContext = require("./ChartContext");
const useChartContext = () => {
  const context = React.useContext(_ChartContext.ChartContext);
  if (context == null) {
    throw new Error(['MUI X Charts: Could not find the Chart context.', 'It looks like you rendered your component outside of a ChartDataProvider.', 'This can also happen if you are bundling multiple versions of the library.'].join('\n'));
  }
  return context;
};
exports.useChartContext = useChartContext;