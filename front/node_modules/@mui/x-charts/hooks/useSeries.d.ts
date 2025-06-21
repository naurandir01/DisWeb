/**
 * Get access to the internal state of series.
 * Structured by type of series:
 * { seriesType?: { series: { id1: precessedValue, ... }, seriesOrder: [id1, ...] } }
 * @returns FormattedSeries series
 */
export declare function useSeries(): import("../internals/index.js").ProcessedSeries<keyof import("../internals/index.js").ChartsSeriesConfig>;