import _extends from "@babel/runtime/helpers/esm/extends";
import { DEFAULT_RADIUS_AXIS_KEY, DEFAULT_ROTATION_AXIS_KEY } from "../../../../constants/index.js";
export function defaultizeAxis(inAxis, dataset, axisName) {
  const DEFAULT_AXIS_KEY = axisName === 'rotation' ? DEFAULT_ROTATION_AXIS_KEY : DEFAULT_RADIUS_AXIS_KEY;
  const inputAxes = inAxis && inAxis.length > 0 ? inAxis : [{
    id: DEFAULT_AXIS_KEY
  }];
  return inputAxes.map((axisConfig, index) => {
    const id = `defaultized-${axisName}-axis-${index}`;
    const dataKey = axisConfig.dataKey;
    if (dataKey === undefined || axisConfig.data !== undefined) {
      return _extends({
        id
      }, axisConfig);
    }
    if (dataset === undefined) {
      throw new Error(`MUI X Charts: ${axisName}-axis uses \`dataKey\` but no \`dataset\` is provided.`);
    }
    return _extends({
      id,
      data: dataset.map(d => d[dataKey])
    }, axisConfig);
  });
}