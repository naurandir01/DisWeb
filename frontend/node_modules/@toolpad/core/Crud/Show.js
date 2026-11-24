"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Show = Show;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Alert = _interopRequireDefault(require("@mui/material/Alert"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _CircularProgress2 = _interopRequireDefault(require("@mui/material/CircularProgress"));
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _Grid = _interopRequireDefault(require("@mui/material/Grid"));
var _Paper = _interopRequireDefault(require("@mui/material/Paper"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Edit = _interopRequireDefault(require("@mui/icons-material/Edit"));
var _Delete = _interopRequireDefault(require("@mui/icons-material/Delete"));
var _invariant = _interopRequireDefault(require("invariant"));
var _dayjs = _interopRequireDefault(require("dayjs"));
var _useDialogs = require("../useDialogs");
var _useNotifications = require("../useNotifications");
var _LocalizationProvider = require("../AppProvider/LocalizationProvider");
var _context = require("../shared/context");
var _cache = require("./cache");
var _useCachedDataSource = require("./useCachedDataSource");
var _localeText = require("./localeText");
var _PageContainer = require("../PageContainer");
var _useActivePage = require("../useActivePage");
var _jsxRuntime = require("react/jsx-runtime");
var _CircularProgress, _EditIcon, _DeleteIcon;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 *
 * Demos:
 *
 * - [CRUD](https://mui.com/toolpad/core/react-crud/)
 *
 * API:
 *
 * - [Show API](https://mui.com/toolpad/core/api/show)
 */
function Show(props) {
  const {
    id,
    onEditClick,
    onDelete,
    dataSourceCache,
    pageTitle,
    localeText: propsLocaleText,
    slots,
    slotProps
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
    getOne,
    deleteOne
  } = methods;
  const activePage = (0, _useActivePage.useActivePage)();
  const dialogs = (0, _useDialogs.useDialogs)();
  const notifications = (0, _useNotifications.useNotifications)();
  const cachedData = React.useMemo(() => cache && cache.get(JSON.stringify(['getOne', id])), [cache, id]);
  const [data, setData] = React.useState(cachedData);
  const [isLoading, setIsLoading] = React.useState(!cachedData);
  const [error, setError] = React.useState(null);
  const [hasDeleted, setHasDeleted] = React.useState(false);
  const loadData = React.useCallback(async () => {
    setError(null);
    let showData = cachedData;
    if (!showData) {
      setIsLoading(true);
      try {
        showData = await getOne(id);
      } catch (showDataError) {
        setError(showDataError);
      }
    }
    if (showData) {
      setData(showData);
    }
    setIsLoading(false);
  }, [cachedData, getOne, id]);
  React.useEffect(() => {
    loadData();
  }, [loadData]);
  const handleItemEdit = React.useCallback(() => {
    if (onEditClick) {
      onEditClick(id);
    }
  }, [id, onEditClick]);
  const handleItemDelete = React.useCallback(async () => {
    const confirmed = await dialogs.confirm(localeText.deleteConfirmMessage, {
      title: localeText.deleteConfirmTitle,
      severity: 'error',
      okText: localeText.deleteConfirmLabel,
      cancelText: localeText.deleteCancelLabel
    });
    if (confirmed) {
      setIsLoading(true);
      try {
        await deleteOne?.(id);
        if (onDelete) {
          onDelete(id);
        }
        notifications.show(localeText.deleteSuccessMessage, {
          severity: 'success',
          autoHideDuration: 3000
        });
        setHasDeleted(true);
      } catch (deleteError) {
        notifications.show(`${localeText.deleteErrorMessage} ${deleteError.message}`, {
          severity: 'error',
          autoHideDuration: 3000
        });
      }
      setIsLoading(false);
    }
  }, [deleteOne, dialogs, id, localeText.deleteCancelLabel, localeText.deleteConfirmLabel, localeText.deleteConfirmMessage, localeText.deleteConfirmTitle, localeText.deleteErrorMessage, localeText.deleteSuccessMessage, notifications, onDelete]);
  const renderField = React.useCallback(showField => {
    if (!data) {
      return '…';
    }
    const {
      field,
      type,
      valueFormatter
    } = showField;
    const fieldValue = data[field];
    if (valueFormatter) {
      return valueFormatter(fieldValue, data, showField);
    }
    if (type === 'boolean') {
      return fieldValue ? 'Yes' : 'No';
    }
    if (type === 'date') {
      return fieldValue ? (0, _dayjs.default)(fieldValue).format('MMMM D, YYYY') : '-';
    }
    if (type === 'dateTime') {
      return fieldValue ? (0, _dayjs.default)(fieldValue).format('MMMM D, YYYY h:mm A') : '-';
    }
    if (type === 'singleSelect') {
      const {
        getOptionValue,
        getOptionLabel,
        valueOptions
      } = showField;
      if (valueOptions && Array.isArray(valueOptions)) {
        const selectedOption = valueOptions.find(option => {
          let optionValue = option;
          if (typeof option !== 'string' && typeof option !== 'number') {
            optionValue = getOptionValue ? getOptionValue(option) : option.value;
          }
          return optionValue === fieldValue;
        });
        if (selectedOption) {
          let selectedOptionLabel = selectedOption;
          if (typeof selectedOption !== 'string' && typeof selectedOption !== 'number') {
            selectedOptionLabel = getOptionLabel ? getOptionLabel(selectedOption) : selectedOption.label;
          }
          return selectedOptionLabel ? String(selectedOptionLabel) : '-';
        }
      }
    }
    return fieldValue ? String(fieldValue) : '-';
  }, [data]);
  const renderShow = React.useMemo(() => {
    if (isLoading) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
        sx: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          m: 1
        },
        children: _CircularProgress || (_CircularProgress = /*#__PURE__*/(0, _jsxRuntime.jsx)(_CircularProgress2.default, {}))
      });
    }
    if (error) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
        sx: {
          flexGrow: 1
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
          severity: "error",
          children: error.message
        })
      });
    }
    if (hasDeleted) {
      return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
        sx: {
          flexGrow: 1
        },
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
          severity: "error",
          children: localeText.deletedItemMessage
        })
      });
    }
    return data ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
      sx: {
        flexGrow: 1,
        width: '100%'
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
        container: true,
        spacing: 2,
        sx: {
          width: '100%'
        },
        children: fields.filter(({
          type
        }) => type !== 'actions' && type !== 'custom').map(showField => {
          const {
            field,
            headerName
          } = showField;
          const renderedField = renderField(showField);
          return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Grid.default, {
            size: {
              xs: 12,
              sm: 6
            },
            children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Paper.default, {
              sx: {
                px: 2,
                py: 1
              },
              children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                variant: "overline",
                children: headerName
              }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
                variant: "body1",
                sx: {
                  mb: 1
                },
                children: renderedField && (!Array.isArray(renderedField) || renderedField.length > 0) ? renderedField : '-'
              })]
            })
          }, field);
        })
      }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
        sx: {
          my: 3
        }
      }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
        direction: "row",
        spacing: 2,
        justifyContent: "flex-end",
        children: [onEditClick ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          variant: "contained",
          startIcon: _EditIcon || (_EditIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Edit.default, {})),
          onClick: handleItemEdit,
          children: localeText.editLabel
        }) : null, deleteOne ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
          variant: "contained",
          color: "error",
          startIcon: _DeleteIcon || (_DeleteIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Delete.default, {})),
          onClick: handleItemDelete,
          children: localeText.deleteLabel
        }) : null]
      })]
    }) : null;
  }, [data, deleteOne, error, fields, handleItemDelete, handleItemEdit, hasDeleted, isLoading, localeText.deleteLabel, localeText.deletedItemMessage, localeText.editLabel, onEditClick, renderField]);
  const PageContainerSlot = slots?.pageContainer ?? _PageContainer.PageContainer;
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(PageContainerSlot, {
    title: pageTitle,
    breadcrumbs: activePage && pageTitle ? [...activePage.breadcrumbs, {
      title: pageTitle
    }] : undefined,
    ...slotProps?.pageContainer,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
      sx: {
        display: 'flex',
        flex: 1,
        width: '100%'
      },
      children: renderShow
    })
  });
}
process.env.NODE_ENV !== "production" ? Show.propTypes /* remove-proptypes */ = {
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
   * @ignore
   */
  id: _propTypes.default.oneOfType([_propTypes.default.number, _propTypes.default.string]).isRequired,
  /**
   * Locale text for the component.
   */
  localeText: _propTypes.default.object,
  /**
   * Callback fired when the item is successfully deleted.
   */
  onDelete: _propTypes.default.func,
  /**
   * Callback fired when the "Edit" button is clicked.
   */
  onEditClick: _propTypes.default.func,
  /**
   * The title of the page.
   */
  pageTitle: _propTypes.default.string,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: _propTypes.default.shape({
    pageContainer: _propTypes.default.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: _propTypes.default.shape({
    pageContainer: _propTypes.default.elementType
  })
} : void 0;