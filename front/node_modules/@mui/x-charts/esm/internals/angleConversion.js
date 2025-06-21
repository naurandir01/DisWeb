export const deg2rad = (value, defaultRad) => {
  if (value === undefined) {
    return defaultRad;
  }
  return Math.PI * value / 180;
};
export const rad2deg = (value, defaultDeg) => {
  if (value === undefined) {
    return defaultDeg;
  }
  return 180 * value / Math.PI;
};