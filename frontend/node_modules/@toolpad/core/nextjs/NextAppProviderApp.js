"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NextAppProviderApp = NextAppProviderApp;
var React = _interopRequireWildcard(require("react"));
var _link = _interopRequireDefault(require("next/link.js"));
var _navigation = require("next/navigation.js");
var _AppProvider = require("../AppProvider");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const Link = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    href,
    history,
    ...rest
  } = props;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_link.default, {
    ref: ref,
    href: href,
    replace: history === 'replace',
    ...rest
  });
});
/**
 * @ignore - internal component.
 */
function NextAppProviderApp(props) {
  const pathname = (0, _navigation.usePathname)();
  const searchParams = (0, _navigation.useSearchParams)();
  const {
    push,
    replace
  } = (0, _navigation.useRouter)();
  const navigate = React.useCallback((url, {
    history = 'auto'
  } = {}) => {
    if (history === 'auto' || history === 'push') {
      return push(String(url));
    }
    if (history === 'replace') {
      return replace(String(url));
    }
    throw new Error(`Invalid history option: ${history}`);
  }, [push, replace]);
  const routerImpl = React.useMemo(() => ({
    pathname,
    searchParams,
    navigate,
    Link
  }), [pathname, navigate, searchParams]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_AppProvider.AppProvider, {
    router: routerImpl,
    ...props
  });
}