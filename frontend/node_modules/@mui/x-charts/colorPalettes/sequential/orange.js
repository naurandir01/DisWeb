"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.orangePaletteLight = exports.orangePaletteDark = exports.orangePalette = void 0;
// Orange sequential gradient palette based on the color scheme

const orangePaletteLight = exports.orangePaletteLight = ['#FBDBC3', '#F9BD92', '#F99F5D', '#FF7A19', '#FD620B', '#E15100', '#AC3E00', '#822F00'];
const orangePaletteDark = exports.orangePaletteDark = orangePaletteLight;
const orangePalette = mode => mode === 'dark' ? orangePaletteDark : orangePaletteLight;
exports.orangePalette = orangePalette;