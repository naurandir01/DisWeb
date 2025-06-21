"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Link = exports.DefaultLink = void 0;
var React = _interopRequireWildcard(require("react"));
var _context = require("./context");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * @ignore - internal component.
 */

const DefaultLink = exports.DefaultLink = /*#__PURE__*/React.forwardRef(function Link(props, ref) {
  const {
    children,
    href,
    onClick,
    history,
    ...rest
  } = props;
  const routerContext = React.useContext(_context.RouterContext);
  const handleLinkClick = React.useMemo(() => {
    if (!routerContext) {
      return onClick;
    }
    return event => {
      event.preventDefault();
      const url = new URL(event.currentTarget.href);
      routerContext.navigate(url.pathname, {
        history
      });
      onClick?.(event);
    };
  }, [routerContext, onClick, history]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)("a", {
    ref: ref,
    href: href,
    ...rest,
    onClick: handleLinkClick,
    children: children
  });
});
const Link = exports.Link = /*#__PURE__*/React.forwardRef(function Link(props, ref) {
  const routerContext = React.useContext(_context.RouterContext);
  const LinkComponent = routerContext?.Link ?? DefaultLink;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(LinkComponent, {
    ref: ref,
    ...props,
    children: props.children
  });
});