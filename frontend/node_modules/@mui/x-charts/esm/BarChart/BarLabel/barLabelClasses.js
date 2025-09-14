import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
export function getBarLabelUtilityClass(slot) {
  return generateUtilityClass('MuiBarLabel', slot);
}
export const barLabelClasses = generateUtilityClasses('MuiBarLabel', ['root', 'highlighted', 'faded', 'animate']);
export const useUtilityClasses = ownerState => {
  const {
    classes,
    seriesId,
    isFaded,
    isHighlighted,
    skipAnimation
  } = ownerState;
  const slots = {
    root: ['root', `series-${seriesId}`, isHighlighted && 'highlighted', isFaded && 'faded', !skipAnimation && 'animate']
  };
  return composeClasses(slots, getBarLabelUtilityClass, classes);
};