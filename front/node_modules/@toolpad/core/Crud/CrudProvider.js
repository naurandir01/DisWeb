"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.CrudProvider = CrudProvider;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _context = require("../shared/context");
var _cache = require("./cache");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 *
 * Demos:
 *
 * - [CRUD](https://mui.com/toolpad/core/react-crud/)
 *
 * API:
 *
 * - [CrudProvider API](https://mui.com/toolpad/core/api/crud-provider)
 */
function CrudProvider(props) {
  const {
    dataSource,
    dataSourceCache,
    children
  } = props;
  const cache = React.useMemo(() => typeof dataSourceCache !== 'undefined' ? dataSourceCache : new _cache.DataSourceCache(), [dataSourceCache]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.CrudContext, {
    value: {
      dataSource: dataSource,
      dataSourceCache: cache
    },
    children: children
  });
}
process.env.NODE_ENV !== "production" ? CrudProvider.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: _propTypes.default.node,
  /**
   * Server-side [data source](https://mui.com/toolpad/core/react-crud/#data-sources).
   */
  dataSource: _propTypes.default.object.isRequired,
  /**
   * [Cache](https://mui.com/toolpad/core/react-crud/#data-caching) for the data source.
   */
  dataSourceCache: _propTypes.default.shape({
    cache: _propTypes.default.object.isRequired,
    clear: _propTypes.default.func.isRequired,
    get: _propTypes.default.func.isRequired,
    set: _propTypes.default.func.isRequired,
    ttl: _propTypes.default.number.isRequired
  })
} : void 0;