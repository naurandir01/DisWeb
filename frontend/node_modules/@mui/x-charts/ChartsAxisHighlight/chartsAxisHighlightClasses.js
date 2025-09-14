"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chartsAxisHighlightClasses = void 0;
exports.getAxisHighlightUtilityClass = getAxisHighlightUtilityClass;
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getAxisHighlightUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiChartsAxisHighlight', slot);
}
const chartsAxisHighlightClasses = exports.chartsAxisHighlightClasses = (0, _generateUtilityClasses.default)('MuiChartsAxisHighlight', ['root']);