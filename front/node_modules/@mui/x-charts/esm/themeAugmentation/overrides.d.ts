import { BarLabelClassKey } from "../BarChart/index.js";
import { BarElementClassKey } from "../BarChart/barElementClasses.js";
import { ChartsAxisHighlightClassKey } from "../ChartsAxisHighlight/index.js";
import { ChartsGridClassKey } from "../ChartsGrid/index.js";
import { ChartsTooltipClassKey } from "../ChartsTooltip/index.js";
import { AreaElementClassKey, LineElementClassKey, MarkElementClassKey } from "../LineChart/index.js";
export interface ChartsComponentNameToClassKey {
  MuiChartsAxis: 'root';
  MuiChartsXAxis: 'root';
  MuiChartsYAxis: 'root';
  MuiChartsAxisHighlight: ChartsAxisHighlightClassKey;
  MuiChartsLegend: 'root';
  MuiChartsGrid: ChartsGridClassKey;
  MuiChartsTooltip: ChartsTooltipClassKey;
  MuiChartsSurface: 'root';
  MuiBarElement: BarElementClassKey;
  MuiBarLabel: BarLabelClassKey;
  MuiAreaElement: AreaElementClassKey;
  MuiLineElement: LineElementClassKey;
  MuiMarkElement: MarkElementClassKey;
}
declare module '@mui/material/styles' {
  interface ComponentNameToClassKey extends ChartsComponentNameToClassKey {}
}
export {};