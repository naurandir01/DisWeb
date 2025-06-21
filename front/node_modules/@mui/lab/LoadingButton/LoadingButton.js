"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _jsxRuntime = require("react/jsx-runtime");
let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The LoadingButton component functionality is now part of the Button component from Material UI.', '', "You should use `import Button from '@mui/material/Button'`", "or `import { Button } from '@mui/material'`"].join('\n'));
    warnedOnce = true;
  }
};

/**
 * @ignore - do not document.
 */
var _default = exports.default = /*#__PURE__*/React.forwardRef(function DeprecatedLoadingButton(props, ref) {
  warn();
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
    ref: ref,
    ...props
  });
});