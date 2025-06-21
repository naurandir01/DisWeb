"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getDateRangePickerDayUtilityClass = exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
/* eslint-disable @typescript-eslint/no-unused-vars */

let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The DateRangePickerDay component was moved from `@mui/lab` to `@mui/x-date-pickers-pro`', '', "You should use `import { DateRangePickerDay } from '@mui/x-date-pickers-pro'`", "or `import { DateRangePickerDay } from '@mui/x-date-pickers-pro/DateRangePickerDay'`", '', 'More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.'].join('\n'));
    warnedOnce = true;
  }
};
/**
 * @deprecated The DateRangePickerDay component was moved from `@mui/lab` to `@mui/x-date-pickers-pro`. More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.
 * @ignore - do not document.
 */
const DateRangePickerDay = /*#__PURE__*/React.forwardRef(function DeprecatedDateRangePickerDay() {
  warn();
  return null;
});
var _default = exports.default = DateRangePickerDay;
const getDateRangePickerDayUtilityClass = slot => {
  warn();
  return '';
};
exports.getDateRangePickerDayUtilityClass = getDateRangePickerDayUtilityClass;