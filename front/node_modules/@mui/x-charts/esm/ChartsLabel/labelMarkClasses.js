import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getLabelMarkUtilityClass(slot) {
  return generateUtilityClass('MuiChartsLabelMark', slot);
}
export const labelMarkClasses = generateUtilityClasses('MuiChartsLabelMark', ['root', 'line', 'square', 'circle', 'mask', 'fill']);
export const useUtilityClasses = props => {
  const {
    type
  } = props;
  const slots = {
    root: typeof type === 'function' ? ['root'] : ['root', type],
    mask: ['mask'],
    fill: ['fill']
  };
  return composeClasses(slots, getLabelMarkUtilityClass, props.classes);
};