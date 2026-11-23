"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createChartDefaultId = void 0;
let globalChartDefaultId = 0;
const createChartDefaultId = () => {
  globalChartDefaultId += 1;
  return `mui-chart-${globalChartDefaultId}`;
};
exports.createChartDefaultId = createChartDefaultId;