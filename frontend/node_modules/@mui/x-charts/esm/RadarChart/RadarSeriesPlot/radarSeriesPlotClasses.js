import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
export function getRadarSeriesPlotUtilityClass(slot) {
  return generateUtilityClass('MuiRadarSeriesPlot', slot);
}
export const radarSeriesPlotClasses = generateUtilityClasses('MuiRadarSeriesPlot', ['root', 'area', 'mark', 'highlighted', 'faded']);
export const useUtilityClasses = classes => {
  const slots = {
    root: ['root'],
    area: ['area'],
    mark: ['mark'],
    highlighted: ['highlighted'],
    faded: ['faded']
  };
  return composeClasses(slots, getRadarSeriesPlotUtilityClass, classes);
};