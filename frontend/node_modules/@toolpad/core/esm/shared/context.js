'use client';

import * as React from 'react';
export const BrandingContext = /*#__PURE__*/React.createContext(null);
export const NavigationContext = /*#__PURE__*/React.createContext([]);
export const PaletteModeContext = /*#__PURE__*/React.createContext({
  paletteMode: 'light',
  setPaletteMode: () => {},
  isDualTheme: false
});
export const RouterContext = /*#__PURE__*/React.createContext(null);
export const DashboardSidebarPageItemContext = /*#__PURE__*/React.createContext(null);
export const CrudContext = /*#__PURE__*/React.createContext({
  dataSource: null,
  dataSourceCache: null
});
export const WindowContext = /*#__PURE__*/React.createContext(undefined);