import { ChartsTextStyle } from "../internals/getWordsByLines.js";
/**
 * Provide the text-anchor based on the angle between the text and the associated element.
 * - 0 means the element is on top of the text, 180 bellow, and 90 on the right of the text.
 * @param {number} angle The angle between the text and the element.
 * @returns
 */
export declare function getDefaultTextAnchor(angle: number): ChartsTextStyle['textAnchor'];
export declare function getDefaultBaseline(angle: number): ChartsTextStyle['dominantBaseline'];