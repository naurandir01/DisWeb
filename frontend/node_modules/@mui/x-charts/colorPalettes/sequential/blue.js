"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.bluePaletteLight = exports.bluePaletteDark = exports.bluePalette = void 0;
// Blue sequential gradient palette based on the color scheme

const bluePaletteLight = exports.bluePaletteLight = ['#BDDEFF', '#99CCFF', '#66B2FF', '#2E96FF', '#0064D6', '#0D47A1', '#0A367B', '#072555'];
const bluePaletteDark = exports.bluePaletteDark = bluePaletteLight;
const bluePalette = mode => mode === 'dark' ? bluePaletteDark : bluePaletteLight;
exports.bluePalette = bluePalette;