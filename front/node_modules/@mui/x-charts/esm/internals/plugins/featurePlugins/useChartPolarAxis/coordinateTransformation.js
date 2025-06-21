export const generateSvg2rotation = center => (x, y) => Math.atan2(x - center.cx, center.cy - y);
export const generateSvg2polar = center => (x, y) => {
  const angle = Math.atan2(x - center.cx, center.cy - y);
  return [Math.sqrt((x - center.cx) ** 2 + (center.cy - y) ** 2), angle];
};
export const generatePolar2svg = center => (radius, rotation) => {
  return [center.cx + radius * Math.sin(rotation), center.cy - radius * Math.cos(rotation)];
};