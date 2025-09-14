"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NextAppProvider = NextAppProvider;
var React = _interopRequireWildcard(require("react"));
var _router = require("next/compat/router.js");
var _NextAppProviderApp = require("./NextAppProviderApp");
var _NextAppProviderPages = require("./NextAppProviderPages");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function NextAppProvider(props) {
  const router = (0, _router.useRouter)();
  const AppProvider = router ? _NextAppProviderPages.NextAppProviderPages : _NextAppProviderApp.NextAppProviderApp;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(AppProvider, {
    ...props
  });
}