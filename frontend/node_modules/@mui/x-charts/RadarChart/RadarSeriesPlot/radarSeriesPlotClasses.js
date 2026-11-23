"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getRadarSeriesPlotUtilityClass = getRadarSeriesPlotUtilityClass;
exports.useUtilityClasses = exports.radarSeriesPlotClasses = void 0;
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getRadarSeriesPlotUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiRadarSeriesPlot', slot);
}
const radarSeriesPlotClasses = exports.radarSeriesPlotClasses = (0, _generateUtilityClasses.default)('MuiRadarSeriesPlot', ['root', 'area', 'mark', 'highlighted', 'faded']);
const useUtilityClasses = classes => {
  const slots = {
    root: ['root'],
    area: ['area'],
    mark: ['mark'],
    highlighted: ['highlighted'],
    faded: ['faded']
  };
  return (0, _composeClasses.default)(slots, getRadarSeriesPlotUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;