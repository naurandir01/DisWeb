"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabelUtilityClass = getLabelUtilityClass;
exports.useUtilityClasses = exports.labelClasses = void 0;
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getLabelUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiChartsLabel', slot);
}
const labelClasses = exports.labelClasses = (0, _generateUtilityClasses.default)('MuiChartsLabel', ['root']);
const useUtilityClasses = props => {
  const slots = {
    root: ['root']
  };
  return (0, _composeClasses.default)(slots, getLabelUtilityClass, props.classes);
};
exports.useUtilityClasses = useUtilityClasses;