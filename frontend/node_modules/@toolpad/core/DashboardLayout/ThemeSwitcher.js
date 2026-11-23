"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ThemeSwitcher = ThemeSwitcher;
var React = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _DarkMode = _interopRequireDefault(require("@mui/icons-material/DarkMode"));
var _LightMode = _interopRequireDefault(require("@mui/icons-material/LightMode"));
var _useSsr = _interopRequireDefault(require("@toolpad/utils/hooks/useSsr"));
var _context = require("../shared/context");
var _jsxRuntime = require("react/jsx-runtime");
var _DarkModeIcon, _LightModeIcon;
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
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function ThemeSwitcher() {
  const isSsr = (0, _useSsr.default)();
  const theme = (0, _material.useTheme)();
  const {
    paletteMode,
    setPaletteMode,
    isDualTheme
  } = React.useContext(_context.PaletteModeContext);
  const toggleMode = React.useCallback(() => {
    setPaletteMode(paletteMode === 'dark' ? 'light' : 'dark');
  }, [paletteMode, setPaletteMode]);
  return isDualTheme ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
    title: isSsr ? 'Switch mode' : `${paletteMode === 'dark' ? 'Light' : 'Dark'} mode`,
    enterDelay: 1000,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        "aria-label": isSsr ? 'Switch theme mode' : `Switch to ${paletteMode === 'dark' ? 'light' : 'dark'} mode`,
        onClick: toggleMode,
        sx: {
          color: (theme.vars ?? theme).palette.primary.dark
        },
        children: theme.getColorSchemeSelector ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_DarkMode.default, {
            sx: {
              display: 'inline',
              [theme.getColorSchemeSelector('dark')]: {
                display: 'none'
              }
            }
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_LightMode.default, {
            sx: {
              display: 'none',
              [theme.getColorSchemeSelector('dark')]: {
                display: 'inline'
              }
            }
          })]
        }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(React.Fragment, {
          children: isSsr || paletteMode !== 'dark' ? _DarkModeIcon || (_DarkModeIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_DarkMode.default, {})) : _LightModeIcon || (_LightModeIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_LightMode.default, {}))
        })
      })
    })
  }) : null;
}