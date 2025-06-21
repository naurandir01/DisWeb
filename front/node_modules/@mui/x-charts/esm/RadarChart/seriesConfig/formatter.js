import { defaultizeValueFormatter } from "../../internals/defaultizeValueFormatter.js";
const formatter = params => {
  const {
    seriesOrder,
    series
  } = params;
  return {
    seriesOrder,
    series: defaultizeValueFormatter(series, v => v == null ? '' : v.toLocaleString())
  };
};
export default formatter;