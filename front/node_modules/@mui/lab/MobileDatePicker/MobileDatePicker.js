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
    console.warn(['MUI: The MobileDatePicker component was moved from `@mui/lab` to `@mui/x-date-pickers`.', '', "You should use `import { MobileDatePicker } from '@mui/x-date-pickers'`", "or `import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker'`", '', 'More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.'].join('\n'));
    warnedOnce = true;
  }
};
/**
 * @deprecated The MobileDatePicker component was moved from `@mui/lab` to `@mui/x-date-pickers`. More information about this migration on our blog: https://mui.com/blog/lab-date-pickers-to-mui-x/.
 * @ignore - do not document.
 */
const MobileDatePicker = /*#__PURE__*/React.forwardRef(function DeprecatedMobileDatePicker(props, ref) {
  warn();
  return null;
});
var _default = exports.default = MobileDatePicker;