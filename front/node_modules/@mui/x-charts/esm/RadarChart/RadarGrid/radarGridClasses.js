import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getRadarGridUtilityClass(slot) {
  return generateUtilityClass('MuiRadarGrid', slot);
}
export const chartsGridClasses = generateUtilityClasses('MuiRadarGrid', ['radial', 'divider', 'stripe']);
export const useUtilityClasses = classes => {
  const slots = {
    radial: ['radial'],
    divider: ['divider'],
    stripe: ['stripe']
  };
  return composeClasses(slots, getRadarGridUtilityClass, classes);
};