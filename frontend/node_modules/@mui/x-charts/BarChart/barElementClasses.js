"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.barElementClasses = void 0;
exports.getBarElementUtilityClass = getBarElementUtilityClass;
exports.useUtilityClasses = void 0;
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getBarElementUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiBarElement', slot);
}
const barElementClasses = exports.barElementClasses = (0, _generateUtilityClasses.default)('MuiBarElement', ['root', 'highlighted', 'faded', 'series']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isHighlighted,
    isFaded
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded']
  };
  return (0, _composeClasses.default)(slots, getBarElementUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;