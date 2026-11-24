import * as React from 'react';
import { CheckboxProps } from '@mui/material/Checkbox';
import { SelectProps } from '@mui/material/Select';
import { TextFieldProps } from '@mui/material/TextField';
import { DatePickerProps } from '@mui/x-date-pickers/DatePicker';
import { DateTimePickerProps } from '@mui/x-date-pickers/DateTimePicker';
import type { DataFieldFormValue, DataModel, DataSource, OmitId } from "./types.js";
interface CrudFormState<D extends DataModel> {
  values: Partial<OmitId<D>>;
  errors: Partial<Record<keyof D, string>>;
}
export interface CrudFormSlotProps {
  textField?: TextFieldProps;
  checkbox?: CheckboxProps;
  datePicker?: DatePickerProps;
  dateTimePicker?: DateTimePickerProps;
  select?: SelectProps;
}
export interface CrudFormSlots {
  /**
   * The text field component used in the form.
   * @default TextField
   */
  textField?: React.JSXElementConstructor<TextFieldProps>;
  /**
   * The checkbox component used in the form.
   * @default TextField
   */
  checkbox?: React.JSXElementConstructor<CheckboxProps>;
  /**
   * The date picker component used in the form.
   * @default DatePicker
   */
  datePicker?: React.JSXElementConstructor<DatePickerProps>;
  /**
   * The date and time picker component used in the form.
   * @default DatePicker
   */
  dateTimePicker?: React.JSXElementConstructor<DateTimePickerProps>;
  /**
   * The select component used in the form.
   * @default Select
   */
  select: React.JSXElementConstructor<SelectProps>;
}
export interface CrudFormProps<D extends DataModel> {
  /**
   * Server-side [data source](https://mui.com/toolpad/core/react-crud/#data-sources).
   */
  dataSource?: DataSource<D>;
  /**
   * Form state object, including field values and errors.
   */
  formState: CrudFormState<D>;
  /**
   * Callback fired when a form field is changed.
   */
  onFieldChange: (name: keyof D, value: DataFieldFormValue) => void | Promise<void>;
  /**
   * Callback fired when the form is submitted.
   */
  onSubmit: (formValues: Partial<OmitId<D>>) => void | Promise<void>;
  /**
   * Callback fired when the form is reset.
   */
  onReset?: (formValues: Partial<OmitId<D>>) => void | Promise<void>;
  /**
   * The components used for each slot inside.
   * @default {}
   */
  slots?: CrudFormSlots;
  /**
   * The props used for each slot inside.
   * @default {}
   */
  slotProps?: CrudFormSlotProps;
  /**
   * Text for form submit button.
   */
  submitButtonLabel: string;
}
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
declare function CrudForm<D extends DataModel>(props: CrudFormProps<D>): React.JSX.Element;
declare namespace CrudForm {
  var propTypes: any;
}
export { CrudForm };