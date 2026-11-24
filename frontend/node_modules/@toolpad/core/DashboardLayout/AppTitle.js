"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppTitle = AppTitle;
var React = _interopRequireWildcard(require("react"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _material = require("@mui/material");
var _Link = require("../shared/Link");
var _ToolpadLogo2 = require("./ToolpadLogo");
var _branding = require("../shared/branding");
var _jsxRuntime = require("react/jsx-runtime");
var _ToolpadLogo;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const LogoContainer = (0, _material.styled)('div')({
  position: 'relative',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  '& img': {
    maxHeight: 40
  }
});
/**
 * @ignore - internal component.
 */
function AppTitle(props) {
  const theme = (0, _material.useTheme)();
  const defaultTitle = (0, _branding.useApplicationTitle)();
  const title = props?.branding?.title ?? defaultTitle;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Link.Link, {
    href: props?.branding?.homeUrl ?? '/',
    style: {
      textDecoration: 'none'
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
      direction: "row",
      alignItems: "center",
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(LogoContainer, {
        children: props?.branding?.logo ?? (_ToolpadLogo || (_ToolpadLogo = /*#__PURE__*/(0, _jsxRuntime.jsx)(_ToolpadLogo2.ToolpadLogo, {
          size: 40
        })))
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
        variant: "h6",
        sx: {
          color: (theme.vars ?? theme).palette.primary.main,
          fontWeight: '700',
          ml: 1,
          whiteSpace: 'nowrap',
          lineHeight: 1
        },
        children: title
      })]
    })
  });
}