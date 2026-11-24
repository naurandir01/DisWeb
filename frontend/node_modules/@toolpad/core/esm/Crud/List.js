'use client';

var _EditIcon, _DeleteIcon, _RefreshIcon, _AddIcon;
import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid, GridToolbar, GridActionsCellItem, gridClasses } from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import RefreshIcon from '@mui/icons-material/Refresh';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import invariant from 'invariant';
import { useDialogs } from "../useDialogs/index.js";
import { useNotifications } from "../useNotifications/index.js";
import { NoSsr } from "../shared/NoSsr.js";
import { CrudContext, RouterContext } from "../shared/context.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { DataSourceCache } from "./cache.js";
import { useCachedDataSource } from "./useCachedDataSource.js";
import { CRUD_DEFAULT_LOCALE_TEXT } from "./localeText.js";
import { PageContainer } from "../PageContainer/index.js";
import { useActivePage } from "../useActivePage/index.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 *
 * Demos:
 *
 * - [CRUD](https://mui.com/toolpad/core/react-crud/)
 *
 * API:
 *
 * - [List API](https://mui.com/toolpad/core/api/list)
 */
function List(props) {
  const {
    initialPageSize = 100,
    onRowClick,
    onCreateClick,
    onEditClick,
    onDelete,
    dataSourceCache,
    pageTitle,
    slots,
    slotProps,
    localeText: propsLocaleText
  } = props;
  const globalLocaleText = useLocaleText();
  const localeText = {
    ...CRUD_DEFAULT_LOCALE_TEXT,
    ...globalLocaleText,
    ...propsLocaleText
  };
  const crudContext = React.useContext(CrudContext);
  const dataSource = props.dataSource ?? crudContext.dataSource;
  invariant(dataSource, 'No data source found.');
  const cache = React.useMemo(() => {
    const manualCache = dataSourceCache ?? crudContext.dataSourceCache;
    return typeof manualCache !== 'undefined' ? manualCache : new DataSourceCache();
  }, [crudContext.dataSourceCache, dataSourceCache]);
  const cachedDataSource = useCachedDataSource(dataSource, cache);
  const {
    fields,
    validate,
    ...methods
  } = cachedDataSource;
  const {
    getMany,
    deleteOne
  } = methods;
  const routerContext = React.useContext(RouterContext);
  const activePage = useActivePage();
  const dialogs = useDialogs();
  const notifications = useNotifications();
  const [paginationModel, setPaginationModel] = React.useState({
    page: routerContext?.searchParams.get('page') ? Number(routerContext?.searchParams.get('page')) : 0,
    pageSize: routerContext?.searchParams.get('pageSize') ? Number(routerContext?.searchParams.get('pageSize')) : initialPageSize
  });
  const [filterModel, setFilterModel] = React.useState(routerContext?.searchParams.get('filter') ? JSON.parse(routerContext?.searchParams.get('filter') ?? '') : {
    items: []
  });
  const [sortModel, setSortModel] = React.useState(routerContext?.searchParams.get('sort') ? JSON.parse(routerContext?.searchParams.get('sort') ?? '') : []);
  const cachedData = React.useMemo(() => cache && cache.get(JSON.stringify(['getMany', {
    paginationModel,
    sortModel,
    filterModel
  }])), [cache, filterModel, paginationModel, sortModel]);
  const [rowsState, setRowsState] = React.useState({
    rows: cachedData?.items ?? [],
    rowCount: cachedData?.itemCount ?? 0
  });
  const [isLoading, setIsLoading] = React.useState(!cachedData);
  const [error, setError] = React.useState(null);
  const handlePaginationModelChange = React.useCallback(model => {
    setPaginationModel(model);
    if (routerContext) {
      const {
        pathname,
        searchParams,
        navigate
      } = routerContext;

      // Needed because searchParams from Next.js are read-only
      const writeableSearchParams = new URLSearchParams(searchParams);
      writeableSearchParams.set('page', String(paginationModel.page));
      writeableSearchParams.set('pageSize', String(paginationModel.pageSize));
      const newSearchParamsString = writeableSearchParams.toString();
      navigate(`${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`);
    }
  }, [paginationModel.page, paginationModel.pageSize, routerContext]);
  const handleFilterModelChange = React.useCallback(model => {
    setFilterModel(model);
    if (routerContext) {
      const {
        pathname,
        searchParams,
        navigate
      } = routerContext;

      // Needed because searchParams from Next.js are read-only
      const writeableSearchParams = new URLSearchParams(searchParams);
      if (filterModel.items.length > 0 || filterModel.quickFilterValues && filterModel.quickFilterValues.length > 0) {
        writeableSearchParams.set('filter', JSON.stringify(filterModel));
      } else {
        writeableSearchParams.delete('filter');
      }
      const newSearchParamsString = writeableSearchParams.toString();
      navigate(`${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`);
    }
  }, [filterModel, routerContext]);
  const handleSortModelChange = React.useCallback(model => {
    setSortModel(model);
    if (routerContext) {
      const {
        pathname,
        searchParams,
        navigate
      } = routerContext;

      // Needed because searchParams from Next.js are read-only
      const writeableSearchParams = new URLSearchParams(searchParams);
      if (sortModel.length > 0) {
        writeableSearchParams.set('sort', JSON.stringify(sortModel));
      } else {
        writeableSearchParams.delete('sort');
      }
      const newSearchParamsString = writeableSearchParams.toString();
      navigate(`${pathname}${newSearchParamsString ? '?' : ''}${newSearchParamsString}`);
    }
  }, [routerContext, sortModel]);
  const loadData = React.useCallback(async () => {
    setError(null);
    let listData = cachedData;
    if (!listData) {
      setIsLoading(true);
      try {
        listData = await getMany({
          paginationModel,
          sortModel,
          filterModel
        });
      } catch (listDataError) {
        setError(listDataError);
      }
    }
    if (listData) {
      setRowsState({
        rows: listData.items,
        rowCount: listData.itemCount
      });
    }
    setIsLoading(false);
  }, [cachedData, filterModel, getMany, paginationModel, sortModel]);
  React.useEffect(() => {
    loadData();
  }, [loadData]);
  const handleRefresh = React.useCallback(() => {
    if (!isLoading) {
      cache?.clear();
      loadData();
    }
  }, [cache, isLoading, loadData]);
  const handleRowClick = React.useCallback(({
    row
  }) => {
    if (onRowClick) {
      onRowClick(row.id);
    }
  }, [onRowClick]);
  const handleItemEdit = React.useCallback(itemId => () => {
    if (onEditClick) {
      onEditClick(itemId);
    }
  }, [onEditClick]);
  const handleItemDelete = React.useCallback(itemId => async () => {
    const confirmed = await dialogs.confirm(localeText.deleteConfirmMessage, {
      title: localeText.deleteConfirmTitle,
      severity: 'error',
      okText: localeText.deleteConfirmLabel,
      cancelText: localeText.deleteCancelLabel
    });
    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteOne?.(itemId);
        if (onDelete) {
          onDelete(itemId);
        }
        notifications.show(localeText.deleteSuccessMessage, {
          severity: 'success',
          autoHideDuration: 3000
        });
        loadData();
      } catch (deleteError) {
        notifications.show(`${localeText.deleteErrorMessage} ${deleteError.message}`, {
          severity: 'error',
          autoHideDuration: 3000
        });
      }
      setIsLoading(false);
    }
  }, [deleteOne, dialogs, loadData, localeText.deleteCancelLabel, localeText.deleteConfirmLabel, localeText.deleteConfirmMessage, localeText.deleteConfirmTitle, localeText.deleteErrorMessage, localeText.deleteSuccessMessage, notifications, onDelete]);
  const DataGridSlot = slots?.dataGrid ?? DataGrid;
  const PageContainerSlot = slots?.pageContainer ?? PageContainer;
  const initialState = React.useMemo(() => ({
    pagination: {
      paginationModel: {
        pageSize: initialPageSize
      }
    }
  }), [initialPageSize]);
  const columns = React.useMemo(() => {
    const pinnedColumnsOverride = slotProps?.dataGrid?.initialState?.pinnedColumns;
    const isActionsColumnPinned = pinnedColumnsOverride?.left?.includes('actions') || pinnedColumnsOverride?.right?.includes('actions');
    return [...fields.map(field => ({
      ...field,
      editable: false
    })), {
      field: 'actions',
      type: 'actions',
      flex: isActionsColumnPinned ? undefined : 1,
      align: 'right',
      getActions: ({
        id
      }) => [...(onEditClick ? [/*#__PURE__*/_jsx(GridActionsCellItem, {
        icon: _EditIcon || (_EditIcon = /*#__PURE__*/_jsx(EditIcon, {})),
        label: localeText.editLabel,
        onClick: handleItemEdit(id)
      }, "edit-item")] : []), ...(deleteOne ? [/*#__PURE__*/_jsx(GridActionsCellItem, {
        icon: _DeleteIcon || (_DeleteIcon = /*#__PURE__*/_jsx(DeleteIcon, {})),
        label: localeText.deleteLabel,
        onClick: handleItemDelete(id)
      }, "delete-item")] : [])]
    }];
  }, [deleteOne, fields, handleItemDelete, handleItemEdit, localeText.deleteLabel, localeText.editLabel, onEditClick, slotProps?.dataGrid]);
  return /*#__PURE__*/_jsx(PageContainerSlot, {
    title: pageTitle,
    breadcrumbs: activePage && pageTitle ? [...activePage.breadcrumbs, {
      title: pageTitle
    }] : undefined,
    ...slotProps?.pageContainer,
    children: /*#__PURE__*/_jsx(Stack, {
      sx: {
        flex: 1,
        width: '100%'
      },
      children: error ? /*#__PURE__*/_jsx(Box, {
        sx: {
          flexGrow: 1
        },
        children: /*#__PURE__*/_jsx(Alert, {
          severity: "error",
          children: error.message
        })
      }) : /*#__PURE__*/_jsxs(React.Fragment, {
        children: [/*#__PURE__*/_jsxs(Stack, {
          direction: "row",
          alignItems: "center",
          justifyContent: "space-between",
          sx: {
            mb: 1
          },
          children: [/*#__PURE__*/_jsx(Tooltip, {
            title: localeText.reloadButtonLabel,
            placement: "right",
            enterDelay: 1000,
            children: /*#__PURE__*/_jsx("div", {
              children: /*#__PURE__*/_jsx(IconButton, {
                "aria-label": "refresh",
                onClick: handleRefresh,
                children: _RefreshIcon || (_RefreshIcon = /*#__PURE__*/_jsx(RefreshIcon, {}))
              })
            })
          }), onCreateClick ? /*#__PURE__*/_jsx(Button, {
            variant: "contained",
            onClick: onCreateClick,
            startIcon: _AddIcon || (_AddIcon = /*#__PURE__*/_jsx(AddIcon, {})),
            children: localeText.createNewButtonLabel
          }) : null]
        }), /*#__PURE__*/_jsx(NoSsr, {
          children: /*#__PURE__*/_jsx(DataGridSlot, {
            rows: rowsState.rows,
            rowCount: rowsState.rowCount,
            columns: columns,
            pagination: true,
            sortingMode: "server",
            filterMode: "server",
            paginationMode: "server",
            paginationModel: paginationModel,
            onPaginationModelChange: handlePaginationModelChange,
            sortModel: sortModel,
            onSortModelChange: handleSortModelChange,
            filterModel: filterModel,
            onFilterModelChange: handleFilterModelChange,
            disableRowSelectionOnClick: true,
            onRowClick: handleRowClick,
            loading: isLoading,
            initialState: initialState,
            slots: {
              toolbar: GridToolbar
            }
            // Prevent type conflicts if slotProps don't match DataGrid used for dataGrid slot
            ,
            ...slotProps?.dataGrid,
            sx: {
              [`& .${gridClasses.columnHeader}, & .${gridClasses.cell}`]: {
                outline: 'transparent'
              },
              [`& .${gridClasses.columnHeader}:focus-within, & .${gridClasses.cell}:focus-within`]: {
                outline: 'none'
              },
              ...(onRowClick ? {
                [`& .${gridClasses.row}:hover`]: {
                  cursor: 'pointer'
                }
              } : {}),
              ...slotProps?.dataGrid?.sx
            }
          })
        })]
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? List.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Server-side [data source](https://mui.com/toolpad/core/react-crud/#data-sources).
   */
  dataSource: PropTypes.object,
  /**
   * [Cache](https://mui.com/toolpad/core/react-crud/#data-caching) for the data source.
   */
  dataSourceCache: PropTypes.shape({
    cache: PropTypes.object.isRequired,
    clear: PropTypes.func.isRequired,
    get: PropTypes.func.isRequired,
    set: PropTypes.func.isRequired,
    ttl: PropTypes.number.isRequired
  }),
  /**
   * Initial number of rows to show per page.
   * @default 100
   */
  initialPageSize: PropTypes.number,
  /**
   * Locale text for the component.
   */
  localeText: PropTypes.object,
  /**
   * Callback fired when the "Create" button is clicked.
   */
  onCreateClick: PropTypes.func,
  /**
   * Callback fired when the item is successfully deleted.
   */
  onDelete: PropTypes.func,
  /**
   * Callback fired when the "Edit" button is clicked.
   */
  onEditClick: PropTypes.func,
  /**
   * Callback fired when a row is clicked. Not called if the target clicked is an interactive element added by the built-in columns.
   */
  onRowClick: PropTypes.func,
  /**
   * The title of the page.
   */
  pageTitle: PropTypes.string,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.shape({
    dataGrid: PropTypes.object,
    pageContainer: PropTypes.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: PropTypes.shape({
    dataGrid: PropTypes.func,
    pageContainer: PropTypes.elementType
  })
} : void 0;
export { List };