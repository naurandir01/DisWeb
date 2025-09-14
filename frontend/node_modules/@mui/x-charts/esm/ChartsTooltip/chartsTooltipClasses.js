import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
export function getChartsTooltipUtilityClass(slot) {
  return generateUtilityClass('MuiChartsTooltip', slot);
}
export const chartsTooltipClasses = generateUtilityClasses('MuiChartsTooltip', ['root', 'paper', 'table', 'row', 'cell', 'mark', 'markContainer', 'labelCell', 'valueCell', 'axisValueCell']);
export const useUtilityClasses = classes => {
  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markContainer: ['markContainer'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
    axisValueCell: ['axisValueCell']
  };
  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};