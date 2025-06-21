"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.useCachedDataSource = useCachedDataSource;
var React = _interopRequireWildcard(require("react"));
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
function useCachedDataSource(dataSource, cache) {
  return React.useMemo(() => {
    if (!cache) {
      return dataSource;
    }
    const {
      getMany,
      getOne,
      createOne,
      updateOne,
      deleteOne,
      ...rest
    } = dataSource;
    return {
      ...Object.fromEntries(Object.entries({
        getMany,
        getOne
      }).filter(([_key, method]) => !!method).map(([key, method]) => [key, async (...args) => {
        const cacheKey = JSON.stringify([key, ...args]);
        const cacheValue = cache.get(cacheKey);
        if (cacheValue) {
          return cacheValue;
        }
        const result = await method(...args);
        cache.set(cacheKey, result);
        return result;
      }])),
      ...Object.fromEntries(Object.entries({
        createOne,
        updateOne,
        deleteOne
      }).filter(([_key, method]) => !!method).map(([key, method]) => [key, async (...args) => {
        const result = await method(...args);
        cache.clear();
        return result;
      }])),
      ...rest
    };
  }, [cache, dataSource]);
}