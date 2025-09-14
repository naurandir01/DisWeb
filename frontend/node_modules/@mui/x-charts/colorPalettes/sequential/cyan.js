"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.cyanPaletteLight = exports.cyanPaletteDark = exports.cyanPalette = void 0;
// Cyan sequential gradient palette based on the color scheme

const cyanPaletteLight = exports.cyanPaletteLight = ['#CFE9E8', '#A3DAD8', '#7ED0CE', '#44BDBA', '#299896', '#137370', '#0E5A58', '#073938'];
const cyanPaletteDark = exports.cyanPaletteDark = cyanPaletteLight;
const cyanPalette = mode => mode === 'dark' ? cyanPaletteDark : cyanPaletteLight;
exports.cyanPalette = cyanPalette;