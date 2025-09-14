"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.purplePaletteLight = exports.purplePaletteDark = exports.purplePalette = void 0;
// Purple sequential gradient palette based on the color scheme

const purplePaletteLight = exports.purplePaletteLight = ['#CAD4EE', '#98ADE5', '#577EE3', '#4254FB', '#2638DF', '#222FA6', '#111C7F', '#091159'];
const purplePaletteDark = exports.purplePaletteDark = purplePaletteLight;
const purplePalette = mode => mode === 'dark' ? purplePaletteDark : purplePaletteLight;
exports.purplePalette = purplePalette;