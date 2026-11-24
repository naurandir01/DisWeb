var _CssBaseline, _CssBaseline2;
import * as React from 'react';
import { useMediaQuery } from '@mui/material';
import { ThemeProvider, useColorScheme } from '@mui/material/styles';
import InitColorSchemeScript from '@mui/material/InitColorSchemeScript';
import CssBaseline from '@mui/material/CssBaseline';
import invariant from 'invariant';
import { useLocalStorageState } from "../useLocalStorageState/index.js";
import { PaletteModeContext } from "../shared/context.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const COLOR_SCHEME_STORAGE_KEY = 'toolpad-color-scheme';
const MODE_STORAGE_KEY = 'toolpad-mode';
function usePreferredMode(window) {
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)', window && {
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
  invariant(!isCssVarsTheme(theme), 'This provider only accepts legacy themes.');
  const isDualTheme = 'light' in theme || 'dark' in theme;
  const preferredMode = usePreferredMode(appWindow);
  const [userMode, setUserMode] = useLocalStorageState(MODE_STORAGE_KEY, 'system');
  const paletteMode = !userMode || userMode === 'system' ? preferredMode : userMode;
  const dualAwareTheme = React.useMemo(() => isDualTheme ? theme[paletteMode === 'dark' ? 'dark' : 'light'] ?? theme[paletteMode === 'dark' ? 'light' : 'dark'] : theme, [isDualTheme, paletteMode, theme]);

  // The v5 shim, based on local state
  const paletteModeContextValue = React.useMemo(() => ({
    paletteMode,
    setPaletteMode: setUserMode,
    isDualTheme
  }), [isDualTheme, paletteMode, setUserMode]);
  return /*#__PURE__*/_jsx(ThemeProvider, {
    theme: dualAwareTheme,
    children: /*#__PURE__*/_jsxs(PaletteModeContext.Provider, {
      value: paletteModeContextValue,
      children: [_CssBaseline || (_CssBaseline = /*#__PURE__*/_jsx(CssBaseline, {
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
  } = useColorScheme();

  // The v6 API, based on `useColorScheme`
  const paletteModeContextValue = React.useMemo(() => {
    return {
      paletteMode: !mode || mode === 'system' ? preferredMode : mode,
      setPaletteMode: setMode,
      isDualTheme: allColorSchemes.length > 1
    };
  }, [allColorSchemes, mode, preferredMode, setMode]);
  return /*#__PURE__*/_jsx(PaletteModeContext.Provider, {
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
  invariant(isCssVarsTheme(theme), 'This provider only accepts CSS vars themes.');
  return /*#__PURE__*/_jsxs(ThemeProvider, {
    theme: theme,
    documentNode: appWindow?.document,
    colorSchemeNode: appWindow?.document.documentElement,
    disableNestedContext: true,
    colorSchemeStorageKey: COLOR_SCHEME_STORAGE_KEY,
    modeStorageKey: MODE_STORAGE_KEY,
    children: [/*#__PURE__*/_jsx(InitColorSchemeScript, {
      attribute: theme.colorSchemeSelector,
      colorSchemeStorageKey: COLOR_SCHEME_STORAGE_KEY,
      modeStorageKey: MODE_STORAGE_KEY,
      nonce: nonce
    }), /*#__PURE__*/_jsxs(CssVarsPaletteModeProvider, {
      window: appWindow,
      children: [_CssBaseline2 || (_CssBaseline2 = /*#__PURE__*/_jsx(CssBaseline, {
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
  return useCssVarsProvider ? /*#__PURE__*/_jsx(CssVarsThemeProvider, {
    theme: theme,
    ...rest,
    children: children
  }) : /*#__PURE__*/_jsx(LegacyThemeProvider, {
    theme: theme,
    ...rest,
    children: children
  });
}
export { AppThemeProvider };