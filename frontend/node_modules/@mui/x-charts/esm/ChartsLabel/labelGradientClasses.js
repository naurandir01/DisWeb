import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getLabelGradientUtilityClass(slot) {
  return generateUtilityClass('MuiChartsLabelGradient', slot);
}
export const labelGradientClasses = generateUtilityClasses('MuiChartsLabelGradient', ['root', 'vertical', 'horizontal', 'mask', 'fill']);
export const useUtilityClasses = props => {
  const {
    direction
  } = props;
  const slots = {
    root: ['root', direction],
    mask: ['mask'],
    fill: ['fill']
  };
  return composeClasses(slots, getLabelGradientUtilityClass, props.classes);
};