"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.strawberrySkyPaletteLight = exports.strawberrySkyPaletteDark = exports.strawberrySkyPalette = void 0;
const strawberrySkyPaletteLight = exports.strawberrySkyPaletteLight = ['#6877FF', '#694FFD', '#A94FFD', '#DA4FFD', '#F050A5', '#FF5E6C'];
const strawberrySkyPaletteDark = exports.strawberrySkyPaletteDark = strawberrySkyPaletteLight;
const strawberrySkyPalette = mode => mode === 'dark' ? strawberrySkyPaletteDark : strawberrySkyPaletteLight;
exports.strawberrySkyPalette = strawberrySkyPalette;