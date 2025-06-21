import type { TickParams } from "../hooks/useTicks.js";
export declare function getTickNumber(params: TickParams & {
  range: number[];
  domain: any[];
}): number;
export declare function scaleTickNumberByRange(tickNumber: number, range: number[]): number;