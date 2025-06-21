"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.redPaletteLight = exports.redPaletteDark = exports.redPalette = void 0;
// Red sequential gradient palette based on the color scheme

const redPaletteLight = exports.redPaletteLight = ['#FAE0E0', '#F7C0BF', '#F3A2A0', '#EF5350', '#E53935', '#DC2B27', '#860B08', '#560503 '];
const redPaletteDark = exports.redPaletteDark = redPaletteLight;
const redPalette = mode => mode === 'dark' ? redPaletteDark : redPaletteLight;
exports.redPalette = redPalette;