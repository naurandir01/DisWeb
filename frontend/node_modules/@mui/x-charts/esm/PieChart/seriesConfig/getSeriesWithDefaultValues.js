import _extends from "@babel/runtime/helpers/esm/extends";
const getSeriesWithDefaultValues = (seriesData, seriesIndex, colors) => {
  return _extends({
    id: seriesData.id ?? `auto-generated-id-${seriesIndex}`
  }, seriesData, {
    data: seriesData.data.map((d, index) => _extends({
      color: colors[index % colors.length]
    }, d))
  });
};
export default getSeriesWithDefaultValues;