import { defaultizeZoom } from "./defaultizeZoom.js";
export const createZoomLookup = axisDirection => (axes = []) => axes.reduce((acc, v) => {
  // @ts-ignore
  const {
    zoom,
    id: axisId
  } = v;
  const defaultizedZoom = defaultizeZoom(zoom, axisId, axisDirection);
  if (defaultizedZoom) {
    acc[axisId] = defaultizedZoom;
  }
  return acc;
}, {});