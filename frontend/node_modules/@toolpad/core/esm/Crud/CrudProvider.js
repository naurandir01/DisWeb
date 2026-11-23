'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { CrudContext } from "../shared/context.js";
import { DataSourceCache } from "./cache.js";
import { jsx as _jsx } from "react/jsx-runtime";
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
  const cache = React.useMemo(() => typeof dataSourceCache !== 'undefined' ? dataSourceCache : new DataSourceCache(), [dataSourceCache]);
  return /*#__PURE__*/_jsx(CrudContext, {
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
  children: PropTypes.node,
  /**
   * Server-side [data source](https://mui.com/toolpad/core/react-crud/#data-sources).
   */
  dataSource: PropTypes.object.isRequired,
  /**
   * [Cache](https://mui.com/toolpad/core/react-crud/#data-caching) for the data source.
   */
  dataSourceCache: PropTypes.shape({
    cache: PropTypes.object.isRequired,
    clear: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    ttl: PropTypes.number.isRequired
  })
} : void 0;
export { CrudProvider };