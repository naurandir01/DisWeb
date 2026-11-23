import { getLabel } from "../../internals/getLabel.js";
const legendGetter = params => {
  const {
    seriesOrder,
    series
  } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach((item, dataIndex) => {
      const formattedLabel = getLabel(item.label, 'legend');
      if (formattedLabel === undefined) {
        return;
      }
      acc.push({
        markType: item.labelMarkType ?? series[seriesId].labelMarkType,
        id: item.id ?? dataIndex,
        seriesId,
        color: item.color,
        label: formattedLabel,
        itemId: item.id ?? dataIndex
      });
    });
    return acc;
  }, []);
};
export default legendGetter;