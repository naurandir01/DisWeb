import { ChartSeriesDefaultized, ChartsSeriesConfig } from "../models/seriesType/config.js";
import { SeriesId } from "../models/seriesType/common.js";
export declare function createSeriesSelectorsOfType<T extends keyof ChartsSeriesConfig>(seriesType: T): (ids?: SeriesId | SeriesId[]) => ChartSeriesDefaultized<T> | (ChartSeriesDefaultized<T> | undefined)[] | undefined;
export declare function createAllSeriesSelectorOfType<T extends keyof ChartsSeriesConfig>(seriesType: T): () => import("./index.js").ProcessedSeries<keyof ChartsSeriesConfig>[T];