import * as React from 'react';
import { type ListSlots, ListSlotProps } from "./List.js";
import { DataSourceCache } from "./cache.js";
import type { DataModel, DataSource, OmitId } from "./types.js";
import type { CrudFormSlotProps, CrudFormSlots } from "./CrudForm.js";
import { type PageContainerProps } from "../PageContainer/index.js";
export interface CrudProps<D extends DataModel> {
  /**
   * Server-side [data source](https://mui.com/toolpad/core/react-crud/#data-sources).
   */
  dataSource: DataSource<D>;
  /**
   * Root path to CRUD pages.
   */
  rootPath: string;
  /**
   * Initial number of rows to show per page.
   * @default 100
   */
  initialPageSize?: number;
  /**
   * Default form values for a new item.
   * @default {}
   */
  defaultValues?: Partial<OmitId<D>>;
  /**
   * [Cache](https://mui.com/toolpad/core/react-crud/#data-caching) for the data source.
   */
  dataSourceCache?: DataSourceCache | null;
  /**
   * The title of each CRUD page.
   */
  pageTitles?: {
    list?: string;
    show?: string;
    create?: string;
    edit?: string;
  };
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots?: {
    list?: ListSlots;
    form?: CrudFormSlots;
    pageContainer?: React.JSXElementConstructor<PageContainerProps>;
  };
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: {
    list?: ListSlotProps;
    form?: CrudFormSlotProps;
    pageContainer?: PageContainerProps;
  };
}
/**
 *
 * Demos:
 *
 * - [CRUD](https://mui.com/toolpad/core/react-crud/)
 *
 * API:
 *
 * - [Crud API](https://mui.com/toolpad/core/api/crud)
 */
declare function Crud<D extends DataModel>(props: CrudProps<D>): React.JSX.Element;
declare namespace Crud {
  var propTypes: any;
}
export { Crud };