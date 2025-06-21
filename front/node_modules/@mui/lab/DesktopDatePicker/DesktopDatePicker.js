"use strict";
'use client';

/* eslint-disable @typescript-eslint/no-unused-vars */
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The DesktopDatePicker component was moved from `@mui/lab` to `@mui/x-date-pickers`.', '', "You should use `import { DesktopDatePicker } from '@mui/x-date-pickers'`", "or `import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker'`", '', 'More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.'].join('\n'));
    warnedOnce = true;
  }
};
/**
 * @deprecated The DesktopDatePicker component was moved from `@mui/lab` to `@mui/x-date-pickers`. More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.
 * @ignore - do not document.
 */
const DesktopDatePicker = /*#__PURE__*/React.forwardRef(function DeprecatedDesktopDatePicker() {
  warn();
  return null;
});
var _default = exports.default = DesktopDatePicker;