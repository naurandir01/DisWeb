"use strict";
'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.pickersDayClasses = exports.getPickersDayUtilityClass = exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The PickersDay component was moved from `@mui/lab` to `@mui/x-date-pickers`.', '', "You should use `import { PickersDay } from '@mui/x-date-pickers'`", "or `import { PickersDay } from '@mui/x-date-pickers/PickersDay'`", '', 'More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.'].join('\n'));
    warnedOnce = true;
  }
};
/**
 * @deprecated The PickersDay component was moved from `@mui/lab` to `@mui/x-date-pickers`. More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.
 * @ignore - do not document.
 */
const PickersDay = /*#__PURE__*/React.forwardRef(function DeprecatedPickersDay() {
  warn();
  return null;
});
var _default = exports.default = PickersDay;
const pickersDayClasses = exports.pickersDayClasses = {};
const getPickersDayUtilityClass = slot => {
  warn();
  return '';
};
exports.getPickersDayUtilityClass = getPickersDayUtilityClass;