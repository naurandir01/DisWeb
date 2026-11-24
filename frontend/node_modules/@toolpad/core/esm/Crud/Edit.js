'use client';

var _CircularProgress;
import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import invariant from 'invariant';
import { useNotifications } from "../useNotifications/index.js";
import { CrudContext } from "../shared/context.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { CrudForm } from "./CrudForm.js";
import { DataSourceCache } from "./cache.js";
import { useCachedDataSource } from "./useCachedDataSource.js";
import { CRUD_DEFAULT_LOCALE_TEXT } from "./localeText.js";
import { PageContainer } from "../PageContainer/index.js";
import { useActivePage } from "../useActivePage/index.js";
import { jsx as _jsx } from "react/jsx-runtime";
function EditForm(props) {
  const {
    dataSource,
    initialValues,
    onSubmit,
    onSubmitSuccess,
    localeText,
    slots,
    slotProps
  } = props;
  const {
    fields,
    validate
  } = dataSource;
  const notifications = useNotifications();
  const [formState, setFormState] = React.useState({
    values: {
      ...Object.fromEntries(fields.filter(({
        field,
        editable
      }) => field !== 'id' && editable !== false).map(({
        field,
        type
      }) => [field, type === 'boolean' ? initialValues[field] ?? false : initialValues[field]])),
      ...initialValues
    },
    errors: {}
  });
  const formValues = formState.values;
  const formErrors = formState.errors;
  const setFormValues = React.useCallback(newFormValues => {
    setFormState(previousState => ({
      ...previousState,
      values: newFormValues
    }));
  }, []);
  const setFormErrors = React.useCallback(newFormErrors => {
    setFormState(previousState => ({
      ...previousState,
      errors: newFormErrors
    }));
  }, []);
  const handleFormFieldChange = React.useCallback((name, value) => {
    const validateField = async values => {
      if (validate) {
        const {
          issues
        } = await validate(values);
        setFormErrors({
          ...formErrors,
          [name]: issues?.find(issue => issue.path?.[0] === name)?.message
        });
      }
    };
    const newFormValues = {
      ...formValues,
      [name]: value
    };
    setFormValues(newFormValues);
    validateField(newFormValues);
  }, [formErrors, formValues, setFormErrors, setFormValues, validate]);
  const handleFormReset = React.useCallback(() => {
    setFormValues(initialValues);
  }, [initialValues, setFormValues]);
  const handleFormSubmit = React.useCallback(async () => {
    if (validate) {
      const {
        issues
      } = await validate(formValues);
      if (issues && issues.length > 0) {
        setFormErrors(Object.fromEntries(issues.map(issue => [issue.path?.[0], issue.message])));
        throw new Error('Form validation failed');
      }
    }
    setFormErrors({});
    try {
      await onSubmit(formValues);
      notifications.show(localeText.editSuccessMessage, {
        severity: 'success',
        autoHideDuration: 3000
      });
      if (onSubmitSuccess) {
        await onSubmitSuccess(formValues);
      }
    } catch (editError) {
      notifications.show(`${localeText.editErrorMessage} ${editError.message}`, {
        severity: 'error',
        autoHideDuration: 3000
      });
      throw editError;
    }
  }, [formValues, localeText.editErrorMessage, localeText.editSuccessMessage, notifications, onSubmit, onSubmitSuccess, setFormErrors, validate]);
  return /*#__PURE__*/_jsx(CrudForm, {
    dataSource: dataSource,
    formState: formState,
    onFieldChange: handleFormFieldChange,
    onSubmit: handleFormSubmit,
    onReset: handleFormReset,
    submitButtonLabel: localeText.editLabel,
    slots: slots?.form,
    slotProps: slotProps?.form
  });
}
process.env.NODE_ENV !== "production" ? EditForm.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  dataSource: PropTypes.object.isRequired,
  initialValues: PropTypes.object.isRequired,
  localeText: PropTypes.object.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onSubmitSuccess: PropTypes.func,
  slotProps: PropTypes.shape({
    form: PropTypes.shape({
      checkbox: PropTypes.object,
      datePicker: PropTypes.object,
      dateTimePicker: PropTypes.object,
      select: PropTypes.object,
      textField: PropTypes.object
    })
  }),
  slots: PropTypes.shape({
    form: PropTypes.shape({
      checkbox: PropTypes.elementType,
      datePicker: PropTypes.elementType,
      dateTimePicker: PropTypes.elementType,
      select: PropTypes.elementType,
      textField: PropTypes.elementType
    })
  })
} : void 0;
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
function Edit(props) {
  const {
    id,
    onSubmitSuccess,
    dataSourceCache,
    pageTitle,
    localeText: propsLocaleText,
    slots,
    slotProps
  } = props;
  const globalLocaleText = useLocaleText();
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
    getOne,
    updateOne
  } = methods;
  const activePage = useActivePage();
  const cachedData = React.useMemo(() => cache && cache.get(JSON.stringify(['getOne', id])), [cache, id]);
  const [data, setData] = React.useState(cachedData);
  const [isLoading, setIsLoading] = React.useState(!cachedData);
  const [error, setError] = React.useState(null);
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
  const handleSubmit = React.useCallback(async formValues => {
    const updatedData = await updateOne(id, formValues);
    setData(updatedData);
  }, [id, updateOne]);
  const renderEdit = React.useMemo(() => {
    if (isLoading) {
      return /*#__PURE__*/_jsx(Box, {
        sx: {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '100%',
          m: 1
        },
        children: _CircularProgress || (_CircularProgress = /*#__PURE__*/_jsx(CircularProgress, {}))
      });
    }
    if (error) {
      return /*#__PURE__*/_jsx(Box, {
        sx: {
          flexGrow: 1
        },
        children: /*#__PURE__*/_jsx(Alert, {
          severity: "error",
          children: error.message
        })
      });
    }
    const localeText = {
      ...CRUD_DEFAULT_LOCALE_TEXT,
      ...globalLocaleText,
      ...propsLocaleText
    };
    return data ? /*#__PURE__*/_jsx(EditForm, {
      dataSource: dataSource,
      initialValues: data,
      onSubmit: handleSubmit,
      onSubmitSuccess: onSubmitSuccess,
      localeText: localeText,
      slots: slots,
      slotProps: slotProps
    }) : null;
  }, [data, dataSource, error, globalLocaleText, handleSubmit, isLoading, onSubmitSuccess, propsLocaleText, slotProps, slots]);
  const PageContainerSlot = slots?.pageContainer ?? PageContainer;
  return /*#__PURE__*/_jsx(PageContainerSlot, {
    title: pageTitle,
    breadcrumbs: activePage && pageTitle ? [...activePage.breadcrumbs, {
      title: pageTitle
    }] : undefined,
    ...slotProps?.pageContainer,
    children: /*#__PURE__*/_jsx(Box, {
      sx: {
        display: 'flex',
        flex: 1
      },
      children: renderEdit
    })
  });
}
process.env.NODE_ENV !== "production" ? Edit.propTypes /* remove-proptypes */ = {
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
   * @ignore
   */
  id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  /**
   * Locale text for the component.
   */
  localeText: PropTypes.object,
  /**
   * Callback fired when the form is successfully submitted.
   */
  onSubmitSuccess: PropTypes.func,
  /**
   * The title of the page.
   */
  pageTitle: PropTypes.string,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.shape({
    form: PropTypes.shape({
      checkbox: PropTypes.object,
      datePicker: PropTypes.object,
      dateTimePicker: PropTypes.object,
      select: PropTypes.object,
      textField: PropTypes.object
    }),
    pageContainer: PropTypes.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: PropTypes.shape({
    form: PropTypes.shape({
      checkbox: PropTypes.elementType,
      datePicker: PropTypes.elementType,
      dateTimePicker: PropTypes.elementType,
      select: PropTypes.elementType,
      textField: PropTypes.elementType
    }),
    pageContainer: PropTypes.elementType
  })
} : void 0;
export { Edit };