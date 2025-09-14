"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.greenPaletteLight = exports.greenPaletteDark = exports.greenPalette = void 0;
// Green sequential gradient palette based on the color scheme

const greenPaletteLight = exports.greenPaletteLight = ['#CDEBDD', '#B2E2CB', '#8FD8B5', '#54C690', '#31B375', '#359F6D', '#0F7746', '#065731'];
const greenPaletteDark = exports.greenPaletteDark = greenPaletteLight;
const greenPalette = mode => mode === 'dark' ? greenPaletteDark : greenPaletteLight;
exports.greenPalette = greenPalette;