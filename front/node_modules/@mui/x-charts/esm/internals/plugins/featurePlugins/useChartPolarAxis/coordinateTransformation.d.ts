export declare const generateSvg2rotation: (center: {
  cx: number;
  cy: number;
}) => (x: number, y: number) => number;
export declare const generateSvg2polar: (center: {
  cx: number;
  cy: number;
}) => (x: number, y: number) => [number, number];
export declare const generatePolar2svg: (center: {
  cx: number;
  cy: number;
}) => (radius: number, rotation: number) => [number, number];