"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chartsTooltipClasses = void 0;
exports.getChartsTooltipUtilityClass = getChartsTooltipUtilityClass;
exports.useUtilityClasses = void 0;
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
function getChartsTooltipUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiChartsTooltip', slot);
}
const chartsTooltipClasses = exports.chartsTooltipClasses = (0, _generateUtilityClasses.default)('MuiChartsTooltip', ['root', 'paper', 'table', 'row', 'cell', 'mark', 'markContainer', 'labelCell', 'valueCell', 'axisValueCell']);
const useUtilityClasses = classes => {
  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markContainer: ['markContainer'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
    axisValueCell: ['axisValueCell']
  };
  return (0, _composeClasses.default)(slots, getChartsTooltipUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;