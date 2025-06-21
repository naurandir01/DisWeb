"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createZoomLookup = void 0;
var _defaultizeZoom = require("./defaultizeZoom");
const createZoomLookup = axisDirection => (axes = []) => axes.reduce((acc, v) => {
  // @ts-ignore
  const {
    zoom,
    id: axisId
  } = v;
  const defaultizedZoom = (0, _defaultizeZoom.defaultizeZoom)(zoom, axisId, axisDirection);
  if (defaultizedZoom) {
    acc[axisId] = defaultizedZoom;
  }
  return acc;
}, {});
exports.createZoomLookup = createZoomLookup;