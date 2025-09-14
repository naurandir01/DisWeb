"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pinkPaletteLight = exports.pinkPaletteDark = exports.pinkPalette = void 0;
// Pink sequential gradient palette based on the color scheme

const pinkPaletteLight = exports.pinkPaletteLight = ['#F7D2E1', '#F6BED5', '#F4A0C3', '#F6619F', '#EE448B', '#E32977', '#B6215F', '#8B1F4C'];
const pinkPaletteDark = exports.pinkPaletteDark = pinkPaletteLight;
const pinkPalette = mode => mode === 'dark' ? pinkPaletteDark : pinkPaletteLight;
exports.pinkPalette = pinkPalette;