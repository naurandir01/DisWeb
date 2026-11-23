"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAreaPath = getAreaPath;
function getAreaPath(points) {
  return `M ${points.map(p => `${p.x} ${p.y}`).join('L')} Z`;
}