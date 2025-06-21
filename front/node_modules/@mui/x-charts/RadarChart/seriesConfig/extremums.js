"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rotationExtremumGetter = exports.radiusExtremumGetter = void 0;
const radiusExtremumGetter = ({
  series,
  axisIndex
}) => {
  return Object.keys(series).filter(seriesId => series[seriesId].type === 'radar').reduce((acc, seriesId) => {
    const {
      data
    } = series[seriesId];
    return [Math.min(data[axisIndex], acc[0]), Math.max(data[axisIndex], acc[1])];
  }, [Infinity, -Infinity]);
};
exports.radiusExtremumGetter = radiusExtremumGetter;
const rotationExtremumGetter = ({
  axis
}) => {
  const min = Math.min(...(axis.data ?? []));
  const max = Math.max(...(axis.data ?? []));
  return [min, max];
};
exports.rotationExtremumGetter = rotationExtremumGetter;