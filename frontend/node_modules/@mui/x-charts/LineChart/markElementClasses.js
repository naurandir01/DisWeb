"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMarkElementUtilityClass = getMarkElementUtilityClass;
exports.useUtilityClasses = exports.markElementClasses = void 0;
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getMarkElementUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiMarkElement', slot);
}
const markElementClasses = exports.markElementClasses = (0, _generateUtilityClasses.default)('MuiMarkElement', ['root', 'highlighted', 'faded', 'animate', 'series']);
const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isFaded,
    isHighlighted,
    skipAnimation
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded', skipAnimation ? undefined : 'animate']
  };
  return (0, _composeClasses.default)(slots, getMarkElementUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;