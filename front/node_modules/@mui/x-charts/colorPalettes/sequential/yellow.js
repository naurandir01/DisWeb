"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.yellowPaletteLight = exports.yellowPaletteDark = exports.yellowPalette = void 0;
// Yellow sequential gradient palette based on the color scheme

const yellowPaletteLight = exports.yellowPaletteLight = ['#FBEFD6', '#F5DEB0', '#F3CD80', '#FAC14F', '#FFB219', '#EF9801', '#DA7D0B', '#AB6208'];
const yellowPaletteDark = exports.yellowPaletteDark = yellowPaletteLight;
const yellowPalette = mode => mode === 'dark' ? yellowPaletteDark : yellowPaletteLight;
exports.yellowPalette = yellowPalette;