"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.rainbowSurgePaletteLight = exports.rainbowSurgePaletteDark = exports.rainbowSurgePalette = void 0;
const rainbowSurgePaletteLight = exports.rainbowSurgePaletteLight = ['#4254FB', '#FFB422', '#FA4F58', '#0DBEFF', '#22BF75', '#FA83B4', '#FF7511'];
const rainbowSurgePaletteDark = exports.rainbowSurgePaletteDark = ['#495AFB', '#FFC758', '#F35865', '#30C8FF', '#44CE8D', '#F286B3', '#FF8C39'];
const rainbowSurgePalette = mode => mode === 'dark' ? rainbowSurgePaletteDark : rainbowSurgePaletteLight;
exports.rainbowSurgePalette = rainbowSurgePalette;