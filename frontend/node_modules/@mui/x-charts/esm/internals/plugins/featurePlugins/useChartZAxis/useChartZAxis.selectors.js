import { createSelector } from "../../utils/selectors.js";
const selectRootState = state => state;
export const selectorChartZAxis = createSelector([selectRootState], state => state.zAxis);