import { useChartContext } from "../../context/ChartProvider/index.js";
// This hook should be removed because user and us should not interact with the store directly, but with public/private APIs
export function useStore() {
  const context = useChartContext();
  if (!context) {
    throw new Error(['MUI X Charts: Could not find the charts context.', 'It looks like you rendered your component outside of a ChartContainer parent component.'].join('\n'));
  }
  return context.store;
}