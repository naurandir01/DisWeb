"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.doesTextFitInRect = doesTextFitInRect;
exports.ellipsize = ellipsize;
var _getGraphemeCount = require("./getGraphemeCount");
var _degToRad = require("./degToRad");
var _sliceUntil = require("./sliceUntil");
const ELLIPSIS = '…';
function doesTextFitInRect(text, config) {
  const {
    width,
    height,
    measureText
  } = config;
  const angle = (0, _degToRad.degToRad)(config.angle);
  const textSize = measureText(text);
  const angledWidth = Math.abs(textSize.width * Math.cos(angle)) + Math.abs(textSize.height * Math.sin(angle));
  const angledHeight = Math.abs(textSize.width * Math.sin(angle)) + Math.abs(textSize.height * Math.cos(angle));
  return angledWidth <= width && angledHeight <= height;
}

/** This function finds the best place to clip the text to add an ellipsis.
 *  This function assumes that the {@link doesTextFit} never returns true for longer text after returning false for
 *  shorter text.
 *
 *  @param text Text to ellipsize if needed
 *  @param doesTextFit a function that returns whether a string fits inside a container.
 */
function ellipsize(text, doesTextFit) {
  if (doesTextFit(text)) {
    return text;
  }
  let shortenedText = text;
  let step = 1;
  let by = 1 / 2;
  const graphemeCount = (0, _getGraphemeCount.getGraphemeCount)(text);
  let newLength = graphemeCount;
  let lastLength = graphemeCount;
  let longestFittingText = null;
  do {
    lastLength = newLength;
    newLength = Math.floor(graphemeCount * by);
    if (newLength === 0) {
      break;
    }
    shortenedText = (0, _sliceUntil.sliceUntil)(text, newLength).trim();
    const fits = doesTextFit(shortenedText + ELLIPSIS);
    step += 1;
    if (fits) {
      longestFittingText = shortenedText;
      by += 1 / 2 ** step;
    } else {
      by -= 1 / 2 ** step;
    }
  } while (Math.abs(newLength - lastLength) !== 1);
  return longestFittingText ? longestFittingText + ELLIPSIS : '';
}