"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var React = _interopRequireWildcard(require("react"));
var _jsxRuntime = require("react/jsx-runtime");
var _svg;
/**
 * @ignore - internal component.
 */
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function TwitchIcon() {
  return _svg || (_svg = /*#__PURE__*/(0, _jsxRuntime.jsxs)("svg", {
    xmlns: "http://www.w3.org/2000/svg",
    width: "24",
    height: "24",
    viewBox: "0 0 300 300",
    children: [/*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      fill: "#65459B",
      fillRule: "evenodd",
      d: "M215.2 260.8h-58.7L117.4 300H78.3v-39.2H6.6V52.2L26.1 0h267.3v182.6l-78.2 78.2zm52.2-91.2V26.1H52.2v189.1h58.7v39.1l39.1-39.1h71.7l45.7-45.6z",
      clipRule: "evenodd"
    }), /*#__PURE__*/(0, _jsxRuntime.jsx)("path", {
      fill: "#65459B",
      d: "M195.6 78.3v78.3h26.1V78.3h-26.1zm-71.7 78.2H150V78.3h-26.1v78.2z"
    })]
  }));
}
var _default = exports.default = TwitchIcon;