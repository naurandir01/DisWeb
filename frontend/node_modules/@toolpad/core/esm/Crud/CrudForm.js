'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import invariant from 'invariant';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControl from '@mui/material/FormControl';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import dayjs from 'dayjs';
import { CrudContext } from "../shared/context.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/**
 *
 * Demos:
 *
 * - [CRUD](https://mui.com/toolpad/core/react-crud/)
 *
 * API:
 *
 * - [CrudForm API](https://mui.com/toolpad/core/api/crud-form)
 */
function CrudForm(props) {
  const {
    formState,
    onFieldChange,
    onSubmit,
    onReset,
    submitButtonLabel,
    slots,
    slotProps
  } = props;
  const formValues = formState.values;
  const formErrors = formState.errors;
  const crudContext = React.useContext(CrudContext);
  const dataSource = props.dataSource ?? crudContext.dataSource;
  invariant(dataSource, 'No data source found.');
  const {
    fields
  } = dataSource;
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleSubmit = React.useCallback(async event => {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formValues);
    } finally {
      setIsSubmitting(false);
    }
  }, [formValues, onSubmit]);
  const handleTextFieldChange = React.useCallback(event => {
    onFieldChange(event.target.name, event.target.value);
  }, [onFieldChange]);
  const handleNumberFieldChange = React.useCallback(event => {
    onFieldChange(event.target.name, Number(event.target.value));
  }, [onFieldChange]);
  const handleCheckboxFieldChange = React.useCallback((event, checked) => {
    onFieldChange(event.target.name, checked);
  }, [onFieldChange]);
  const handleDateFieldChange = React.useCallback(name => value => {
    if (value?.isValid()) {
      onFieldChange(name, value.toISOString() ?? null);
    } else if (formValues[name]) {
      onFieldChange(name, null);
    }
  }, [formValues, onFieldChange]);
  const handleSelectFieldChange = React.useCallback(event => {
    onFieldChange(event.target.name, event.target.value);
  }, [onFieldChange]);
  const renderField = React.useCallback(formField => {
    const {
      field,
      type,
      headerName,
      renderFormField
    } = formField;
    const fieldValue = formValues[field];
    const fieldError = formErrors[field];
    let fieldElement = null;
    if (renderFormField) {
      fieldElement = renderFormField({
        value: fieldValue ?? null,
        onChange: value => onFieldChange(field, value),
        error: fieldError ?? null
      });
    } else if (!type || type === 'string') {
      const TextFieldComponent = slots?.textField ?? TextField;
      fieldElement = /*#__PURE__*/_jsx(TextFieldComponent, {
        value: fieldValue ?? '',
        onChange: handleTextFieldChange,
        name: field,
        label: headerName,
        error: !!fieldError,
        helperText: fieldError ?? ' ',
        fullWidth: true,
        ...slotProps?.textField
      });
    } else if (type === 'number') {
      const TextFieldComponent = slots?.textField ?? TextField;
      fieldElement = /*#__PURE__*/_jsx(TextFieldComponent, {
        value: fieldValue ?? '',
        onChange: handleNumberFieldChange,
        name: field,
        type: "number",
        label: headerName,
        error: !!fieldError,
        helperText: fieldError ?? ' ',
        fullWidth: true,
        ...slotProps?.textField
      });
    } else if (type === 'boolean') {
      const CheckBoxComponent = slots?.checkbox ?? Checkbox;
      fieldElement = /*#__PURE__*/_jsxs(FormControl, {
        children: [/*#__PURE__*/_jsx(FormControlLabel, {
          name: field,
          control: /*#__PURE__*/_jsx(CheckBoxComponent, {
            size: "large",
            checked: fieldValue,
            onChange: handleCheckboxFieldChange,
            ...slotProps?.checkbox
          }),
          label: headerName
        }), /*#__PURE__*/_jsx(FormHelperText, {
          error: !!fieldError,
          children: fieldError ?? ' '
        })]
      });
    } else if (type === 'date') {
      const DatePickerComponent = slots?.datePicker ?? DatePicker;
      fieldElement = /*#__PURE__*/_jsx(LocalizationProvider, {
        dateAdapter: AdapterDayjs,
        children: /*#__PURE__*/_jsx(DatePickerComponent, {
          value: fieldValue ? dayjs(fieldValue) : null,
          onChange: handleDateFieldChange(field),
          name: field,
          label: headerName,
          slotProps: {
            textField: {
              error: !!fieldError,
              helperText: fieldError ?? ' ',
              fullWidth: true
            }
          },
          ...slotProps?.datePicker
        })
      });
    } else if (type === 'dateTime') {
      const DateTimePickerComponent = slots?.dateTimePicker ?? DateTimePicker;
      fieldElement = /*#__PURE__*/_jsx(LocalizationProvider, {
        dateAdapter: AdapterDayjs,
        children: /*#__PURE__*/_jsx(DateTimePickerComponent, {
          value: fieldValue ? dayjs(fieldValue) : null,
          onChange: handleDateFieldChange(field),
          name: field,
          label: headerName,
          slotProps: {
            textField: {
              error: !!fieldError,
              helperText: fieldError ?? ' ',
              fullWidth: true
            }
          },
          ...slotProps?.dateTimePicker
        })
      });
    } else if (type === 'singleSelect') {
      const SelectComponent = slots?.select ?? Select;
      const {
        getOptionValue,
        getOptionLabel,
        valueOptions
      } = formField;
      if (valueOptions && Array.isArray(valueOptions)) {
        const labelId = `${field}-label`;
        fieldElement = /*#__PURE__*/_jsxs(FormControl, {
          error: !!fieldError,
          fullWidth: true,
          children: [/*#__PURE__*/_jsx(InputLabel, {
            id: labelId,
            children: headerName
          }), /*#__PURE__*/_jsx(SelectComponent, {
            value: fieldValue ?? '',
            onChange: handleSelectFieldChange,
            labelId: labelId,
            name: field,
            label: headerName,
            defaultValue: "",
            fullWidth: true,
            ...slotProps?.select,
            children: valueOptions.map(option => {
              let optionValue = option;
              let optionLabel = option;
              if (typeof option !== 'string' && typeof option !== 'number') {
                optionValue = getOptionValue ? getOptionValue(option) : option.value;
                optionLabel = getOptionLabel ? getOptionLabel(option) : option.label;
              }
              return /*#__PURE__*/_jsx(MenuItem, {
                value: optionValue,
                children: optionLabel
              }, optionValue);
            })
          }), /*#__PURE__*/_jsx(FormHelperText, {
            children: fieldError ?? ' '
          })]
        });
      }
    }
    return /*#__PURE__*/_jsx(Grid, {
      size: {
        xs: 12,
        sm: 6
      },
      sx: {
        display: 'flex'
      },
      children: fieldElement
    }, field);
  }, [formErrors, formValues, handleCheckboxFieldChange, handleDateFieldChange, handleNumberFieldChange, handleSelectFieldChange, handleTextFieldChange, onFieldChange, slotProps, slots]);
  const handleReset = React.useCallback(async () => {
    if (onReset) {
      await onReset(formValues);
    }
  }, [formValues, onReset]);
  return /*#__PURE__*/_jsxs(Box, {
    component: "form",
    onSubmit: handleSubmit,
    noValidate: true,
    autoComplete: "off",
    onReset: handleReset,
    sx: {
      width: '100%'
    },
    children: [/*#__PURE__*/_jsx(FormGroup, {
      children: /*#__PURE__*/_jsx(Grid, {
        container: true,
        spacing: 2,
        sx: {
          mb: 2,
          width: '100%'
        },
        children: fields.filter(({
          field,
          editable
        }) => field !== 'id' && editable !== false).map(renderField)
      })
    }), /*#__PURE__*/_jsx(Box, {
      sx: {
        display: 'flex',
        justifyContent: 'flex-end'
      },
      children: /*#__PURE__*/_jsx(Button, {
        type: "submit",
        variant: "contained",
        size: "large",
        loading: isSubmitting,
        children: submitButtonLabel
      })
    })]
  });
}
process.env.NODE_ENV !== "production" ? CrudForm.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Server-side [data source](https://mui.com/toolpad/core/react-crud/#data-sources).
   */
  dataSource: PropTypes.object,
  /**
   * Form state object, including field values and errors.
   */
  formState: PropTypes.shape({
    errors: PropTypes.object.isRequired,
    values: PropTypes.object.isRequired
  }).isRequired,
  /**
   * Callback fired when a form field is changed.
   */
  onFieldChange: PropTypes.func.isRequired,
  /**
   * Callback fired when the form is reset.
   */
  onReset: PropTypes.func,
  /**
   * Callback fired when the form is submitted.
   */
  onSubmit: PropTypes.func.isRequired,
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps: PropTypes.shape({
    checkbox: PropTypes.object,
    datePicker: PropTypes.object,
    dateTimePicker: PropTypes.object,
    select: PropTypes.object,
    textField: PropTypes.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots: PropTypes.shape({
    checkbox: PropTypes.elementType,
    datePicker: PropTypes.elementType,
    dateTimePicker: PropTypes.elementType,
    select: PropTypes.elementType,
    textField: PropTypes.elementType
  }),
  /**
   * Text for form submit button.
   */
  submitButtonLabel: PropTypes.string.isRequired
} : void 0;
export { CrudForm };