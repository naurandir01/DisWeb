import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getAxisUtilityClass(slot) {
  return generateUtilityClass('MuiChartsAxis', slot);
}
export const axisClasses = generateUtilityClasses('MuiChartsAxis', ['root', 'line', 'tickContainer', 'tick', 'tickLabel', 'label', 'directionX', 'directionY', 'top', 'bottom', 'left', 'right', 'id']);