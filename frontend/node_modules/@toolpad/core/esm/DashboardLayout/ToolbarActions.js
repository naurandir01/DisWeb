'use client';

var _Stack;
import * as React from 'react';
import Stack from '@mui/material/Stack';
import { ThemeSwitcher } from "./ThemeSwitcher.js";

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
import { jsx as _jsx } from "react/jsx-runtime";
function ToolbarActions() {
  return _Stack || (_Stack = /*#__PURE__*/_jsx(Stack, {
    direction: "row",
    alignItems: "center",
    children: /*#__PURE__*/_jsx(ThemeSwitcher, {})
  }));
}
export { ToolbarActions };