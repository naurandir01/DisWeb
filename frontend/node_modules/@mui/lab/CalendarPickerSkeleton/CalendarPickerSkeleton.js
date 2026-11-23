"use strict";
'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCalendarPickerSkeletonUtilityClass = exports.default = exports.calendarPickerSkeletonClasses = void 0;
var React = _interopRequireWildcard(require("react"));
let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The CalendarPickerSkeleton component was moved from `@mui/lab` to `@mui/x-date-pickers`.', '', "You should use `import { CalendarPickerSkeleton } from '@mui/x-date-pickers'`", "or `import { CalendarPickerSkeleton } from '@mui/x-date-pickers/CalendarPickerSkeleton'`", '', 'More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.'].join('\n'));
    warnedOnce = true;
  }
};
/**
 * @deprecated The CalendarPickerSkeleton component was moved from `@mui/lab` to `@mui/x-date-pickers`. More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.
 * @ignore - do not document.
 */
const CalendarPickerSkeleton = /*#__PURE__*/React.forwardRef(function DeprecatedCalendarPickerSkeleton() {
  warn();
  return null;
});
var _default = exports.default = CalendarPickerSkeleton;
const calendarPickerSkeletonClasses = exports.calendarPickerSkeletonClasses = {};
const getCalendarPickerSkeletonUtilityClass = slot => {
  warn();
  return '';
};
exports.getCalendarPickerSkeletonUtilityClass = getCalendarPickerSkeletonUtilityClass;