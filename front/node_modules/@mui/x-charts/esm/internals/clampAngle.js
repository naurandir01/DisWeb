/**
 * Clamp angle to [0, 360[.
 */
export function clampAngle(angle) {
  return (angle % 360 + 360) % 360;
}
const TWO_PI = 2 * Math.PI;
/** Clamp angle to [0, 2 * Math.PI[. */
export function clampAngleRad(angle) {
  return (angle % TWO_PI + TWO_PI) % TWO_PI;
}