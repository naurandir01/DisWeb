import type { ChartState } from "../models/chart.js";
import type { ChartAnyPluginSignature } from "../models/plugin.js";
type Listener<T> = (value: T) => void;
export type StoreUpdater<TSignatures extends readonly ChartAnyPluginSignature[], TOptionalSignatures extends readonly ChartAnyPluginSignature[] = []> = (prevState: ChartState<TSignatures, TOptionalSignatures>) => ChartState<TSignatures, TOptionalSignatures>;
export declare class ChartStore<TSignatures extends readonly ChartAnyPluginSignature[], TOptionalSignatures extends readonly ChartAnyPluginSignature[] = []> {
  value: ChartState<TSignatures, TOptionalSignatures>;
  private listeners;
  constructor(value: ChartState<TSignatures, TOptionalSignatures>);
  subscribe: (fn: Listener<ChartState<TSignatures, TOptionalSignatures>>) => () => void;
  getSnapshot: () => ChartState<TSignatures, TOptionalSignatures>;
  update: (updater: StoreUpdater<TSignatures, TOptionalSignatures>) => void;
}
export {};