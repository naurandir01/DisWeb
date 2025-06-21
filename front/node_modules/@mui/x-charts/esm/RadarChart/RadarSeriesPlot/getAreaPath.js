export function getAreaPath(points) {
  return `M ${points.map(p => `${p.x} ${p.y}`).join('L')} Z`;
}