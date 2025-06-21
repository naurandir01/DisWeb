"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabelGradientUtilityClass = getLabelGradientUtilityClass;
exports.useUtilityClasses = exports.labelGradientClasses = void 0;
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getLabelGradientUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiChartsLabelGradient', slot);
}
const labelGradientClasses = exports.labelGradientClasses = (0, _generateUtilityClasses.default)('MuiChartsLabelGradient', ['root', 'vertical', 'horizontal', 'mask', 'fill']);
const useUtilityClasses = props => {
  const {
    direction
  } = props;
  const slots = {
    root: ['root', direction],
    mask: ['mask'],
    fill: ['fill']
  };
  return (0, _composeClasses.default)(slots, getLabelGradientUtilityClass, props.classes);
};
exports.useUtilityClasses = useUtilityClasses;