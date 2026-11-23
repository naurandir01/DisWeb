"use strict";
'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.clockPickerClasses = void 0;
var React = _interopRequireWildcard(require("react"));
let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The ClockPicker component was moved from `@mui/lab` to `@mui/x-date-pickers`.', '', "You should use `import { ClockPicker } from '@mui/x-date-pickers'`", "or `import { ClockPicker } from '@mui/x-date-pickers/ClockPicker'`", '', 'More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.'].join('\n'));
    warnedOnce = true;
  }
};
/**
 * @deprecated The ClockPicker component was moved from `@mui/lab` to `@mui/x-date-pickers`. More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.
 * @ignore - do not document.
 */
const ClockPicker = /*#__PURE__*/React.forwardRef(function DeprecatedClockPicker() {
  warn();
  return null;
});
var _default = exports.default = ClockPicker;
const clockPickerClasses = exports.clockPickerClasses = {};