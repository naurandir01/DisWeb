import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';
function getLegendUtilityClass(slot) {
  return generateUtilityClass('MuiContinuousColorLegend', slot);
}
export const useUtilityClasses = props => {
  const {
    classes,
    direction,
    labelPosition
  } = props;
  const slots = {
    root: ['root', direction, labelPosition],
    minLabel: ['minLabel'],
    maxLabel: ['maxLabel'],
    gradient: ['gradient'],
    mark: ['mark'],
    label: ['label']
  };
  return composeClasses(slots, getLegendUtilityClass, classes);
};
export const continuousColorLegendClasses = generateUtilityClasses('MuiContinuousColorLegend', ['root', 'minLabel', 'maxLabel', 'gradient', 'vertical', 'horizontal', 'start', 'end', 'extremes', 'label']);