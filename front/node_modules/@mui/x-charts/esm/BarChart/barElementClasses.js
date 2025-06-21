import generateUtilityClass from '@mui/utils/generateUtilityClass';
import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getBarElementUtilityClass(slot) {
  return generateUtilityClass('MuiBarElement', slot);
}
export const barElementClasses = generateUtilityClasses('MuiBarElement', ['root', 'highlighted', 'faded', 'series']);
export const useUtilityClasses = ownerState => {
  const {
    classes,
    id,
    isHighlighted,
    isFaded
  } = ownerState;
  const slots = {
    root: ['root', `series-${id}`, isHighlighted && 'highlighted', isFaded && 'faded']
  };
  return composeClasses(slots, getBarElementUtilityClass, classes);
};