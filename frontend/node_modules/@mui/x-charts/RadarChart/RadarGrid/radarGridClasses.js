"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.chartsGridClasses = void 0;
exports.getRadarGridUtilityClass = getRadarGridUtilityClass;
exports.useUtilityClasses = void 0;
var _composeClasses = _interopRequireDefault(require("@mui/utils/composeClasses"));
var _generateUtilityClass = _interopRequireDefault(require("@mui/utils/generateUtilityClass"));
var _generateUtilityClasses = _interopRequireDefault(require("@mui/utils/generateUtilityClasses"));
function getRadarGridUtilityClass(slot) {
  return (0, _generateUtilityClass.default)('MuiRadarGrid', slot);
}
const chartsGridClasses = exports.chartsGridClasses = (0, _generateUtilityClasses.default)('MuiRadarGrid', ['radial', 'divider', 'stripe']);
const useUtilityClasses = classes => {
  const slots = {
    radial: ['radial'],
    divider: ['divider'],
    stripe: ['stripe']
  };
  return (0, _composeClasses.default)(slots, getRadarGridUtilityClass, classes);
};
exports.useUtilityClasses = useUtilityClasses;