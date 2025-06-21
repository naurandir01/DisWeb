"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _getLabel = require("../../internals/getLabel");
const legendGetter = params => {
  const {
    seriesOrder,
    series
  } = params;
  return seriesOrder.reduce((acc, seriesId) => {
    series[seriesId].data.forEach((item, dataIndex) => {
      const formattedLabel = (0, _getLabel.getLabel)(item.label, 'legend');
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
var _default = exports.default = legendGetter;