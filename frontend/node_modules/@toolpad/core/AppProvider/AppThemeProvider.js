"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppThemeProvider = AppThemeProvider;
var React = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _styles = require("@mui/material/styles");
var _InitColorSchemeScript = _interopRequireDefault(require("@mui/material/InitColorSchemeScript"));
var _CssBaseline3 = _interopRequireDefault(require("@mui/material/CssBaseline"));
var _invariant = _interopRequireDefault(require("invariant"));
var _useLocalStorageState = require("../useLocalStorageState");
var _context = require("../shared/context");
var _jsxRuntime = require("react/jsx-runtime");
var _CssBaseline, _CssBaseline2;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const COLOR_SCHEME_STORAGE_KEY = 'toolpad-color-scheme';
const MODE_STORAGE_KEY = 'toolpad-mode';
function usePreferredMode(window) {
  const prefersDarkMode = (0, _material.useMediaQuery)('(prefers-color-scheme: dark)', window && {
    matchMedia: window.matchMedia
  });
  return prefersDarkMode ? 'dark' : 'light';
}
function isCssVarsTheme(theme) {
  return 'vars' in theme;
}
/**
 * Compatibility layer for classic v5 themes. It will handle state management for the theme switcher.
 * In the v6 theme, this state management is handled by `useColorScheme`. But this hook will crash if
 * not run under context with a css vars theme.
 */
function LegacyThemeProvider(props) {
  const {
    children,
    theme,
    window: appWindow
  } = props;
  (0, _invariant.default)(!isCssVarsTheme(theme), 'This provider only accepts legacy themes.');
  const isDualTheme = 'light' in theme || 'dark' in theme;
  const preferredMode = usePreferredMode(appWindow);
  const [userMode, setUserMode] = (0, _useLocalStorageState.useLocalStorageState)(MODE_STORAGE_KEY, 'system');
  const paletteMode = !userMode || userMode === 'system' ? preferredMode : userMode;
  const dualAwareTheme = React.useMemo(() => isDualTheme ? theme[paletteMode === 'dark' ? 'dark' : 'light'] ?? theme[paletteMode === 'dark' ? 'light' : 'dark'] : theme, [isDualTheme, paletteMode, theme]);

  // The v5 shim, based on local state
  const paletteModeContextValue = React.useMemo(() => ({
    paletteMode,
    setPaletteMode: setUserMode,
    isDualTheme
  }), [isDualTheme, paletteMode, setUserMode]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_styles.ThemeProvider, {
    theme: dualAwareTheme,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_context.PaletteModeContext.Provider, {
      value: paletteModeContextValue,
      children: [_CssBaseline || (_CssBaseline = /*#__PURE__*/(0, _jsxRuntime.jsx)(_CssBaseline3.default, {
        enableColorScheme: true
      })), children]
    })
  });
}
function CssVarsPaletteModeProvider(props) {
  const {
    children,
    window: appWindow
  } = props;
  const preferredMode = usePreferredMode(appWindow);
  const {
    mode,
    setMode,
    allColorSchemes
  } = (0, _styles.useColorScheme)();

  // The v6 API, based on `useColorScheme`
  const paletteModeContextValue = React.useMemo(() => {
    return {
      paletteMode: !mode || mode === 'system' ? preferredMode : mode,
      setPaletteMode: setMode,
      isDualTheme: allColorSchemes.length > 1
    };
  }, [allColorSchemes, mode, preferredMode, setMode]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.PaletteModeContext.Provider, {
    value: paletteModeContextValue,
    children: children
  });
}
function CssVarsThemeProvider(props) {
  const {
    children,
    theme,
    window: appWindow,
    nonce
  } = props;
  (0, _invariant.default)(isCssVarsTheme(theme), 'This provider only accepts CSS vars themes.');
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_styles.ThemeProvider, {
    theme: theme,
    documentNode: appWindow?.document,
    colorSchemeNode: appWindow?.document.documentElement,
    disableNestedContext: true,
    colorSchemeStorageKey: COLOR_SCHEME_STORAGE_KEY,
    modeStorageKey: MODE_STORAGE_KEY,
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_InitColorSchemeScript.default, {
      attribute: theme.colorSchemeSelector,
      colorSchemeStorageKey: COLOR_SCHEME_STORAGE_KEY,
      modeStorageKey: MODE_STORAGE_KEY,
      nonce: nonce
    }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(CssVarsPaletteModeProvider, {
      window: appWindow,
      children: [_CssBaseline2 || (_CssBaseline2 = /*#__PURE__*/(0, _jsxRuntime.jsx)(_CssBaseline3.default, {
        enableColorScheme: true
      })), children]
    })]
  });
}
/**
 * @ignore - internal component.
 */
function AppThemeProvider(props) {
  const {
    children,
    theme,
    ...rest
  } = props;
  const useCssVarsProvider = isCssVarsTheme(theme);
  return useCssVarsProvider ? /*#__PURE__*/(0, _jsxRuntime.jsx)(CssVarsThemeProvider, {
    theme: theme,
    ...rest,
    children: children
  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(LegacyThemeProvider, {
    theme: theme,
    ...rest,
    children: children
  });
}