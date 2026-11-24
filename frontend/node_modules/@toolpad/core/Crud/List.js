"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.List = List;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Alert = _interopRequireDefault(require("@mui/material/Alert"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _xDataGrid = require("@mui/x-data-grid");
var _Add = _interopRequireDefault(require("@mui/icons-material/Add"));
var _Refresh = _interopRequireDefault(require("@mui/icons-material/Refresh"));
var _Edit = _interopRequireDefault(require("@mui/icons-material/Edit"));
var _Delete = _interopRequireDefault(require("@mui/icons-material/Delete"));
var _invariant = _interopRequireDefault(require("invariant"));
var _useDialogs = require("../useDialogs");
var _useNotifications = require("../useNotifications");
var _NoSsr = require("../shared/NoSsr");
var _context = require("../shared/context");
var _LocalizationProvider = require("../AppProvider/LocalizationProvider");
var _cache = require("./cache");
var _useCachedDataSource = require("./useCachedDataSource");
var _localeText = require("./localeText");
var _PageContainer = require("../PageContainer");
var _useActivePage = require("../useActivePage");
var _jsxRuntime = require("react/jsx-runtime");
var _EditIcon, _DeleteIcon, _RefreshIcon, _AddIcon;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
  const globalLocaleText = (0, _LocalizationProvider.useLocaleText)();
  const localeText = {
    ..._localeText.CRUD_DEFAULT_LOCALE_TEXT,
    ...globalLocaleText,
    ...propsLocaleText
  };
  const crudContext = React.useContext(_context.CrudContext);
  const dataSource = props.dataSource ?? crudContext.dataSource;
  (0, _invariant.default)(dataSource, 'No data source found.');
  const cache = React.useMemo(() => {
    const manualCache = dataSourceCache ?? crudContext.dataSourceCache;
    return typeof manualCache !== 'undefined' ? manualCache : new _cache.DataSourceCache();
  }, [crudContext.dataSourceCache, dataSourceCache]);
  const cachedDataSource = (0, _useCachedDataSource.useCachedDataSource)(dataSource, cache);
  const {
    fields,
    validate,
    ...methods
  } = cachedDataSource;
  const {
    getMany,
    deleteOne
  } = methods;
  const routerContext = React.useContext(_context.RouterContext);
  const activePage = (0, _useActivePage.useActivePage)();
  const dialogs = (0, _useDialogs.useDialogs)();
  const notifications = (0, _useNotifications.useNotifications)();
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
  const DataGridSlot = slots?.dataGrid ?? _xDataGrid.DataGrid;
  const PageContainerSlot = slots?.pageContainer ?? _PageContainer.PageContainer;
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
      }) => [...(onEditClick ? [/*#__PURE__*/(0, _jsxRuntime.jsx)(_xDataGrid.GridActionsCellItem, {
        icon: _EditIcon || (_EditIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Edit.default, {})),
        label: localeText.editLabel,
        onClick: handleItemEdit(id)
      }, "edit-item")] : []), ...(deleteOne ? [/*#__PURE__*/(0, _jsxRuntime.jsx)(_xDataGrid.GridActionsCellItem, {
        icon: _DeleteIcon || (_DeleteIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Delete.default, {})),
        label: localeText.deleteLabel,
        onClick: handleItemDelete(id)
      }, "delete-item")] : [])]
    }];
  }, [deleteOne, fields, handleItemDelete, handleItemEdit, localeText.deleteLabel, localeText.editLabel, onEditClick, slotProps?.dataGrid]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(PageContainerSlot, {
    title: pageTitle,
    breadcrumbs: activePage && pageTitle ? [...activePage.breadcrumbs, {
      title: pageTitle
    }] : undefined,
    ...slotProps?.pageContainer,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Stack.default, {
      sx: {
        flex: 1,
        width: '100%'
      },
      children: error ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
        sx: {
          flexGrow: 1
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
          severity: "error",
          children: error.message
        })
      }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
        children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
          direction: "row",
          alignItems: "center",
          justifyContent: "space-between",
          sx: {
            mb: 1
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
            title: localeText.reloadButtonLabel,
            placement: "right",
            enterDelay: 1000,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)("div", {
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
                "aria-label": "refresh",
                onClick: handleRefresh,
                children: _RefreshIcon || (_RefreshIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Refresh.default, {}))
              })
            })
          }), onCreateClick ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
            variant: "contained",
            onClick: onCreateClick,
            startIcon: _AddIcon || (_AddIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Add.default, {})),
            children: localeText.createNewButtonLabel
          }) : null]
        }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_NoSsr.NoSsr, {
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(DataGridSlot, {
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
              toolbar: _xDataGrid.GridToolbar
            }
            // Prevent type conflicts if slotProps don't match DataGrid used for dataGrid slot
            ,
            ...slotProps?.dataGrid,
            sx: {
              [`& .${_xDataGrid.gridClasses.columnHeader}, & .${_xDataGrid.gridClasses.cell}`]: {
                outline: 'transparent'
              },
              [`& .${_xDataGrid.gridClasses.columnHeader}:focus-within, & .${_xDataGrid.gridClasses.cell}:focus-within`]: {
                outline: 'none'
              },
              ...(onRowClick ? {
                [`& .${_xDataGrid.gridClasses.row}:hover`]: {
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
  dataSource: _propTypes.default.object,
  /**
   * [Cache](https://mui.com/toolpad/core/react-crud/#data-caching) for the data source.
   */
  dataSourceCache: _propTypes.default.shape({
    cache: _propTypes.default.object.isRequired,
    clear: _propTypes.default.func.isRequired,
    get: _propTypes.default.func.isRequired,
    set: _propTypes.default.func.isRequired,
    ttl: _propTypes.default.number.isRequired
  }),
  /**
   * Initial number of rows to show per page.
   * @default 100
   */
  initialPageSize: _propTypes.default.number,
  /**
   * Locale text for the component.
   */
  localeText: _propTypes.default.object,
  /**
   * Callback fired when the "Create" button is clicked.
   */
  onCreateClick: _propTypes.default.func,
  /**
   * Callback fired when the item is successfully deleted.
   */
  onDelete: _propTypes.default.func,
  /**
   * Callback fired when the "Edit" button is clicked.
   */
  onEditClick: _propTypes.default.func,
  /**
   * Callback fired when a row is clicked. Not called if the target clicked is an interactive element added by the built-in columns.
   */
  onRowClick: _propTypes.default.func,
  /**
   * The title of the page.
   */
  pageTitle: _propTypes.default.string,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: _propTypes.default.shape({
    dataGrid: _propTypes.default.object,
    pageContainer: _propTypes.default.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: _propTypes.default.shape({
    dataGrid: _propTypes.default.func,
    pageContainer: _propTypes.default.elementType
  })
} : void 0;