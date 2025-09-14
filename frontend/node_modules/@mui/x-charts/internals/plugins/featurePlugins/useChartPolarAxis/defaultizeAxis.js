"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultizeAxis = defaultizeAxis;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _constants = require("../../../../constants");
function defaultizeAxis(inAxis, dataset, axisName) {
  const DEFAULT_AXIS_KEY = axisName === 'rotation' ? _constants.DEFAULT_ROTATION_AXIS_KEY : _constants.DEFAULT_RADIUS_AXIS_KEY;
  const inputAxes = inAxis && inAxis.length > 0 ? inAxis : [{
    id: DEFAULT_AXIS_KEY
  }];
  return inputAxes.map((axisConfig, index) => {
    const id = `defaultized-${axisName}-axis-${index}`;
    const dataKey = axisConfig.dataKey;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return (0, _extends2.default)({
        id
      }, axisConfig);
    }
    if (dataset === undefined) {
      throw new Error(`MUI X Charts: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }
    return (0, _extends2.default)({
      id,
      data: dataset.map(d => d[dataKey])
    }, axisConfig);
  });
}