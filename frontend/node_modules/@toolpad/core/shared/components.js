"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ErrorOverlay = ErrorOverlay;
exports.LoadingOverlay = LoadingOverlay;
var React = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _Error = _interopRequireDefault(require("@mui/icons-material/Error"));
var _jsxRuntime = require("react/jsx-runtime");
var _ErrorIcon, _OverlayRoot;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const OverlayRoot = (0, _material.styled)('div')(({
  theme
}) => ({
  position: 'absolute',
  inset: '0 0 0 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2)
}));
function ErrorOverlay({
  error
}) {
  return /*#__PURE__*/(0, _jsxRuntime.jsxs)(OverlayRoot, {
    children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_material.Typography, {
      variant: "h6",
      sx: {
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center'
      },
      children: [_ErrorIcon || (_ErrorIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Error.default, {
        color: "error"
      })), " Error"]
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Typography, {
      textAlign: "center",
      children: error?.message ?? 'Unknown error'
    })]
  });
}
function LoadingOverlay() {
  return _OverlayRoot || (_OverlayRoot = /*#__PURE__*/(0, _jsxRuntime.jsx)(OverlayRoot, {
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.CircularProgress, {})
  }));
}