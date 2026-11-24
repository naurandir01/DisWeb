import * as React from 'react';
import { CrudFormSlotProps, CrudFormSlots } from "./CrudForm.js";
import { DataSourceCache } from "./cache.js";
import { type CRUDLocaleText } from "./localeText.js";
import type { DataModel, DataModelId, DataSource, OmitId } from "./types.js";
import { type PageContainerProps } from "../PageContainer/index.js";
export interface EditProps<D extends DataModel> {
  id: DataModelId;
  /**
   * Server-side [data source](https://mui.com/toolpad/core/react-crud/#data-sources).
   */
  dataSource?: DataSource<D> & Required<Pick<DataSource<D>, 'getOne' | 'updateOne'>>;
  /**
   * Callback fired when the form is successfully submitted.
   */
  onSubmitSuccess?: (formValues: Partial<OmitId<D>>) => void | Promise<void>;
  /**
   * [Cache](https://mui.com/toolpad/core/react-crud/#data-caching) for the data source.
   */
  dataSourceCache?: DataSourceCache | null;
  /**
   * The title of the page.
   */
  pageTitle?: string;
  /**
   * Locale text for the component.
   */
  localeText?: CRUDLocaleText;
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots?: {
    form?: CrudFormSlots;
    pageContainer?: React.JSXElementConstructor<PageContainerProps>;
  };
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: {
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
 * - [Edit API](https://mui.com/toolpad/core/api/edit)
 */
declare function Edit<D extends DataModel>(props: EditProps<D>): React.JSX.Element;
declare namespace Edit {
  var propTypes: any;
}
export { Edit };