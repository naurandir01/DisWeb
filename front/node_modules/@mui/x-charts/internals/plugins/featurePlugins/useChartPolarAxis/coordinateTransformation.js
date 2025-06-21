"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.generateSvg2rotation = exports.generateSvg2polar = exports.generatePolar2svg = void 0;
const generateSvg2rotation = center => (x, y) => Math.atan2(x - center.cx, center.cy - y);
exports.generateSvg2rotation = generateSvg2rotation;
const generateSvg2polar = center => (x, y) => {
  const angle = Math.atan2(x - center.cx, center.cy - y);
  return [Math.sqrt((x - center.cx) ** 2 + (center.cy - y) ** 2), angle];
};
exports.generateSvg2polar = generateSvg2polar;
const generatePolar2svg = center => (radius, rotation) => {
  return [center.cx + radius * Math.sin(rotation), center.cy - radius * Math.cos(rotation)];
};
exports.generatePolar2svg = generatePolar2svg;