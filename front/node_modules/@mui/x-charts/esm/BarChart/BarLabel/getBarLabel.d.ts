import { SeriesId } from "../../models/seriesType/common.js";
import { BarLabelFunction } from "./BarLabel.types.js";
export declare const getBarLabel: (options: {
  barLabel: "value" | BarLabelFunction;
  value: number | null;
  dataIndex: number;
  seriesId: SeriesId;
  height: number;
  width: number;
}) => string | null | undefined;