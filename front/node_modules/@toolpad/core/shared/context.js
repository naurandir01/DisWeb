"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.WindowContext = exports.RouterContext = exports.PaletteModeContext = exports.NavigationContext = exports.DashboardSidebarPageItemContext = exports.CrudContext = exports.BrandingContext = void 0;
var React = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const BrandingContext = exports.BrandingContext = /*#__PURE__*/React.createContext(null);
const NavigationContext = exports.NavigationContext = /*#__PURE__*/React.createContext([]);
const PaletteModeContext = exports.PaletteModeContext = /*#__PURE__*/React.createContext({
  paletteMode: 'light',
  setPaletteMode: () => {},
  isDualTheme: false
});
const RouterContext = exports.RouterContext = /*#__PURE__*/React.createContext(null);
const DashboardSidebarPageItemContext = exports.DashboardSidebarPageItemContext = /*#__PURE__*/React.createContext(null);
const CrudContext = exports.CrudContext = /*#__PURE__*/React.createContext({
  dataSource: null,
  dataSourceCache: null
});
const WindowContext = exports.WindowContext = /*#__PURE__*/React.createContext(undefined);