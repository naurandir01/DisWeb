"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.blueberryTwilightPaletteLight = exports.blueberryTwilightPaletteDark = exports.blueberryTwilightPalette = void 0;
const blueberryTwilightPaletteLight = exports.blueberryTwilightPaletteLight = ['#02B2AF', '#2E96FF', '#B800D8', '#60009B', '#2731C8', '#03008D'];
const blueberryTwilightPaletteDark = exports.blueberryTwilightPaletteDark = ['#02B2AF', '#72CCFF', '#DA00FF', '#9001CB', '#2E96FF', '#3B48E0'];
const blueberryTwilightPalette = mode => mode === 'dark' ? blueberryTwilightPaletteDark : blueberryTwilightPaletteLight;
exports.blueberryTwilightPalette = blueberryTwilightPalette;