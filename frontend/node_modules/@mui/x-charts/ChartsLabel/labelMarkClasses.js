"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getLabelMarkUtilityClass = getLabelMarkUtilityClass;
exports.useUtilityClasses = exports.labelMarkClasses = void 0;
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getLabelMarkUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiChartsLabelMark', slot);
}
const labelMarkClasses = exports.labelMarkClasses = (0, _generateUtilityClasses.default)('MuiChartsLabelMark', ['root', 'line', 'square', 'circle', 'mask', 'fill']);
const useUtilityClasses = props => {
  const {
    type
  } = props;
  const slots = {
    root: typeof type === 'function' ? ['root'] : ['root', type],
    mask: ['mask'],
    fill: ['fill']
  };
  return (0, _composeClasses.default)(slots, getLabelMarkUtilityClass, props.classes);
};
exports.useUtilityClasses = useUtilityClasses;