import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getLabelUtilityClass(slot) {
  return generateUtilityClass('MuiChartsLabel', slot);
}
export const labelClasses = generateUtilityClasses('MuiChartsLabel', ['root']);
export const useUtilityClasses = props => {
  const slots = {
    root: ['root']
  };
  return composeClasses(slots, getLabelUtilityClass, props.classes);
};