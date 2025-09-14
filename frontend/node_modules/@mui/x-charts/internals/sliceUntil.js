"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sliceUntil = void 0;
const segmenter = typeof window !== 'undefined' && 'Intl' in window && 'Segmenter' in Intl ? new Intl.Segmenter(undefined, {
  granularity: 'grapheme'
}) : null;
function sliceUntilFallback(text, endIndex) {
  return text.slice(0, endIndex);
}
function sliceUntilModern(text, endIndex) {
  const segments = segmenter.segment(text);
  let newText = '';
  let i = 0;
  for (const segment of segments) {
    newText += segment.segment;
    i += 1;
    if (i >= endIndex) {
      break;
    }
  }
  return newText;
}

/** Creates a slice of {@link text} from the start until the {@link endIndex}th grapheme (basically character). */
const sliceUntil = exports.sliceUntil = segmenter ? sliceUntilModern : sliceUntilFallback;