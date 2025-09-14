"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.axisClasses = void 0;
exports.getAxisUtilityClass = getAxisUtilityClass;
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getAxisUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiChartsAxis', slot);
}
const axisClasses = exports.axisClasses = (0, _generateUtilityClasses.default)('MuiChartsAxis', ['root', 'line', 'tickContainer', 'tick', 'tickLabel', 'label', 'directionX', 'directionY', 'top', 'bottom', 'left', 'right', 'id']);