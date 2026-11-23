import _extends from "@babel/runtime/helpers/esm/extends";
import { getLabel } from "../../internals/getLabel.js";
const tooltipGetter = params => {
  const {
    series,
    getColor,
    identifier
  } = params;
  if (!identifier || identifier.dataIndex === undefined) {
    return null;
  }
  const point = series.data[identifier.dataIndex];
  if (point == null) {
    return null;
  }
  const label = getLabel(point.label, 'tooltip');
  const value = _extends({}, point, {
    label
  });
  const formattedValue = series.valueFormatter(value, {
    dataIndex: identifier.dataIndex
  });
  return {
    identifier,
    color: getColor(identifier.dataIndex),
    label,
    value,
    formattedValue,
    markType: point.labelMarkType ?? series.labelMarkType
  };
};
export default tooltipGetter;