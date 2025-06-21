import _extends from "@babel/runtime/helpers/esm/extends";
const getSeriesWithDefaultValues = (seriesData, seriesIndex, colors) => {
  return _extends({
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`,
    color: colors[seriesIndex % colors.length]
  }, seriesData);
};
export default getSeriesWithDefaultValues;