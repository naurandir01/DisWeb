'use client';

var _DarkModeIcon, _LightModeIcon;
import * as React from 'react';
import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import useSsr from '@toolpad/utils/hooks/useSsr';
import { PaletteModeContext } from "../shared/context.js";

/**
 *
 * Demos:
 *
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 *
 * API:
 *
 * - [ThemeSwitcher API](https://mui.com/toolpad/core/api/theme-switcher)
 */
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
function ThemeSwitcher() {
  const isSsr = useSsr();
  const theme = useTheme();
  const {
    paletteMode,
    setPaletteMode,
    isDualTheme
  } = React.useContext(PaletteModeContext);
  const toggleMode = React.useCallback(() => {
    setPaletteMode(paletteMode === 'dark' ? 'light' : 'dark');
  }, [paletteMode, setPaletteMode]);
  return isDualTheme ? /*#__PURE__*/_jsx(Tooltip, {
    title: isSsr ? 'Switch mode' : `${paletteMode === 'dark' ? 'Light' : 'Dark'} mode`,
    enterDelay: 1000,
    children: /*#__PURE__*/_jsx("div", {
      children: /*#__PURE__*/_jsx(IconButton, {
        "aria-label": isSsr ? 'Switch theme mode' : `Switch to ${paletteMode === 'dark' ? 'light' : 'dark'} mode`,
        onClick: toggleMode,
        sx: {
          color: (theme.vars ?? theme).palette.primary.dark
        },
        children: theme.getColorSchemeSelector ? /*#__PURE__*/_jsxs(React.Fragment, {
          children: [/*#__PURE__*/_jsx(DarkModeIcon, {
            sx: {
              display: 'inline',
              [theme.getColorSchemeSelector('dark')]: {
                display: 'none'
              }
            }
          }), /*#__PURE__*/_jsx(LightModeIcon, {
            sx: {
              display: 'none',
              [theme.getColorSchemeSelector('dark')]: {
                display: 'inline'
              }
            }
          })]
        }) : /*#__PURE__*/_jsx(React.Fragment, {
          children: isSsr || paletteMode !== 'dark' ? _DarkModeIcon || (_DarkModeIcon = /*#__PURE__*/_jsx(DarkModeIcon, {})) : _LightModeIcon || (_LightModeIcon = /*#__PURE__*/_jsx(LightModeIcon, {}))
        })
      })
    })
  }) : null;
}
export { ThemeSwitcher };