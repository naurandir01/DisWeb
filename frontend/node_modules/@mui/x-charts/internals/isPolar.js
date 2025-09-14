"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.isPolarSeriesType = isPolarSeriesType;
var _configInit = require("./configInit");
function isPolarSeriesType(seriesType) {
  return _configInit.polarSeriesTypes.getTypes().has(seriesType);
}