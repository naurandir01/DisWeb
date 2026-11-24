import type { Theme } from '@mui/material';
export declare function getDrawerSxTransitionMixin(isExpanded: boolean, property: string): {
  transition: (theme: Theme) => string;
};
export declare function getDrawerWidthTransitionMixin(isExpanded: boolean): {
  overflowX: string;
  transition: (theme: Theme) => string;
};