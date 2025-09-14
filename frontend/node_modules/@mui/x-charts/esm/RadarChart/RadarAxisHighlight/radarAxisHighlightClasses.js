import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getRadarAxisHighlightUtilityClass(slot) {
  return generateUtilityClass('MuiRadarAxisHighlight', slot);
}
export const chartsAxisHighlightClasses = generateUtilityClasses('MuiRadarAxisHighlight', ['root', 'line', 'dot']);