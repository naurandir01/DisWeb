"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useNotifications = useNotifications;
var React = _interopRequireWildcard(require("react"));
var _NotificationsContext = require("./NotificationsContext");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const serverNotifications = {
  show: () => {
    throw new Error('Not supported on server side');
  },
  close: () => {
    throw new Error('Not supported on server side');
  }
};
function useNotifications() {
  const context = React.useContext(_NotificationsContext.NotificationsContext);
  if (context) {
    return context;
  }
  return serverNotifications;
}