"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.DemoProvider = DemoProvider;
exports.useDemoRouter = useDemoRouter;
var React = _interopRequireWildcard(require("react"));
var _cache = _interopRequireDefault(require("@emotion/cache"));
var _react2 = require("@emotion/react");
var _warnOnce = _interopRequireDefault(require("@toolpad/utils/warnOnce"));
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Internal utility for demos
 * @ignore - internal component.
 */

function useExternalProductionWarning({
  featureName
}) {
  const isExternalProduction = typeof window !== 'undefined' && window.location.hostname !== 'mui.com' && process.env.NODE_ENV === 'production';
  if (isExternalProduction) {
    (0, _warnOnce.default)(`${featureName} is an internal feature of Toolpad Core. This feature is not meant for general usage in production.`);
  }
}
// Wrapper for demo applications in the documentation
function DemoProvider({
  window,
  children
}) {
  useExternalProductionWarning({
    featureName: 'DemoProvider'
  });
  const demoEmotionCache = React.useMemo(() => (0, _cache.default)({
    key: 'toolpad-demo-app',
    container: window?.document.head
  }), [window?.document.head]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_react2.CacheProvider, {
    value: demoEmotionCache,
    children: children
  });
}
const DUMMY_BASE = 'https://example.com';

/**
 * Hook to create a router for demos.
 * @returns An in-memory router To be used in demos demos.
 */
function useDemoRouter(initialUrl = '/') {
  useExternalProductionWarning({
    featureName: 'useDemoRouter'
  });
  const [url, setUrl] = React.useState(() => new URL(initialUrl, DUMMY_BASE));
  const router = React.useMemo(() => {
    return {
      pathname: url.pathname,
      searchParams: url.searchParams,
      navigate: newUrl => {
        const nextUrl = new URL(newUrl, DUMMY_BASE);
        if (nextUrl.pathname !== url.pathname || nextUrl.search !== url.search) {
          setUrl(nextUrl);
        }
      }
    };
  }, [url.pathname, url.search, url.searchParams]);
  return router;
}