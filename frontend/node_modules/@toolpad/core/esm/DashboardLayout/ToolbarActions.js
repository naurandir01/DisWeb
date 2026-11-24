'use client';

var _Stack;
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ThemeSwitcher } from "./ThemeSwitcher.js";
import { Account } from "../Account/index.js";

/**
 *
 * Demos:
 *
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 *
 * API:
 *
 * - [ToolbarActions API](https://mui.com/toolpad/core/api/toolbar-actions)
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function ToolbarActions() {
  return _Stack || (_Stack = /*#__PURE__*/_jsxs(Stack, {
    direction: "row",
    alignItems: "center",
    children: [/*#__PURE__*/_jsx(ThemeSwitcher, {}), /*#__PURE__*/_jsx(Account, {})]
  }));
}
export { ToolbarActions };