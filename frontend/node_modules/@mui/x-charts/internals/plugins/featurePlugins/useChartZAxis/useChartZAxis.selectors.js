"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.selectorChartZAxis = void 0;
var _selectors = require("../../utils/selectors");
const selectRootState = state => state;
const selectorChartZAxis = exports.selectorChartZAxis = (0, _selectors.createSelector)([selectRootState], state => state.zAxis);