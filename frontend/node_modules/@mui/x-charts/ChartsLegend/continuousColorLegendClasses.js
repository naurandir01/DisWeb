"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useUtilityClasses = exports.continuousColorLegendClasses = void 0;
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
function getLegendUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiContinuousColorLegend', slot);
}
const useUtilityClasses = props => {
  const {
    classes,
    direction,
    labelPosition
  } = props;
  const slots = {
    root: ['root', direction, labelPosition],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    gradient: ['gradient'],
    mark: ['mark'],
    label: ['label']
  };
  return (0, _composeClasses.default)(slots, getLegendUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;
const continuousColorLegendClasses = exports.continuousColorLegendClasses = (0, _generateUtilityClasses.default)('MuiContinuousColorLegend', ['root', 'minLabel', 'maxLabel', 'gradient', 'vertical', 'horizontal', 'start', 'end', 'extremes', 'label']);