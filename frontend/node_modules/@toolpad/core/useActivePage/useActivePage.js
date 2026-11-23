"use strict";
'use client';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useActivePage = useActivePage;
var React = _interopRequireWildcard(require("react"));
var _context = require("../shared/context");
var _navigation = require("../shared/navigation");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function useActivePage() {
  const navigationContext = React.useContext(_context.NavigationContext);
  const routerContext = React.useContext(_context.RouterContext);
  const pathname = routerContext?.pathname ?? '/';
  const activeItem = (0, _navigation.matchPath)(navigationContext, pathname);
  const rootItem = (0, _navigation.matchPath)(navigationContext, '/');
  return React.useMemo(() => {
    if (!activeItem) {
      return null;
    }
    const breadcrumbs = [];
    if (rootItem) {
      breadcrumbs.push({
        title: (0, _navigation.getItemTitle)(rootItem),
        path: '/'
      });
    }
    const segments = pathname.split('/').filter(Boolean);
    let prefix = '';
    for (const segment of segments) {
      const path = `${prefix}/${segment}`;
      prefix = path;
      const item = (0, _navigation.matchPath)(navigationContext, path);
      if (!item) {
        continue;
      }
      const itemPath = (0, _navigation.getItemPath)(navigationContext, item);
      const lastCrumb = breadcrumbs[breadcrumbs.length - 1];
      if (lastCrumb?.path !== itemPath) {
        breadcrumbs.push({
          title: (0, _navigation.getItemTitle)(item),
          path: itemPath
        });
      }
    }
    return {
      title: (0, _navigation.getItemTitle)(activeItem),
      path: (0, _navigation.getItemPath)(navigationContext, activeItem),
      breadcrumbs
    };
  }, [activeItem, rootItem, pathname, navigationContext]);
}