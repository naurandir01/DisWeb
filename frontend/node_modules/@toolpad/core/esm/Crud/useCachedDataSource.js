import * as React from 'react';
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
export { useCachedDataSource };