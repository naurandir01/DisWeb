export interface ChartsTooltipClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the paper element. */
  paper: string;
  /** Styles applied to the table element. */
  table: string;
  /** Styles applied to the row element. */
  row: string;
  /** Styles applied to the cell element. */
  cell: string;
  /** Styles applied to the mark element. */
  mark: string;
  /** Styles applied to the markContainer element. */
  markContainer: string;
  /** Styles applied to the labelCell element. */
  labelCell: string;
  /** Styles applied to the valueCell element. */
  valueCell: string;
  /** Styles applied to the axisValueCell element. Only available for axis tooltip. */
  axisValueCell: string;
}
export type ChartsTooltipClassKey = keyof Omit<ChartsTooltipClasses, 'markContainer' | 'labelCell' | 'valueCell'>;
export declare function getChartsTooltipUtilityClass(slot: string): string;
export declare const chartsTooltipClasses: ChartsTooltipClasses;
export declare const useUtilityClasses: (classes?: Partial<ChartsTooltipClasses>) => Record<"root" | "mark" | "table" | "cell" | "row" | "markContainer" | "labelCell" | "valueCell" | "paper" | "axisValueCell", string>;