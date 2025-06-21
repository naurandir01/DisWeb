"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rad2deg = exports.deg2rad = void 0;
const deg2rad = (value, defaultRad) => {
  if (value === undefined) {
    return defaultRad;
  }
  return Math.PI * value / 180;
};
exports.deg2rad = deg2rad;
const rad2deg = (value, defaultDeg) => {
  if (value === undefined) {
    return defaultDeg;
  }
  return 180 * value / Math.PI;
};
exports.rad2deg = rad2deg;