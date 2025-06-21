import * as React from 'react';
import { PickersInputBaseProps } from "./PickersInputBase.types.js";
import { PickerTextFieldOwnerState } from "../../models/fields.js";
export declare const PickersInputBaseRoot: import("@emotion/styled").StyledComponent<import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & {
  ownerState: PickerTextFieldOwnerState;
}, Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof React.HTMLAttributes<HTMLDivElement> | keyof React.ClassAttributes<HTMLDivElement>>, {}>;
export declare const PickersInputBaseSectionsContainer: import("@emotion/styled").StyledComponent<Pick<import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & Pick<React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>, keyof React.HTMLAttributes<HTMLDivElement> | keyof React.ClassAttributes<HTMLDivElement>>, keyof React.HTMLAttributes<HTMLDivElement> | keyof React.ClassAttributes<HTMLDivElement> | keyof import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme>> & import("@mui/system").MUIStyledCommonProps<import("@mui/material").Theme> & {
  ownerState: PickerTextFieldOwnerState;
}, {}, {}>;
/**
 * @ignore - internal component.
 */
declare const PickersInputBase: React.ForwardRefExoticComponent<Omit<PickersInputBaseProps, "ref"> & React.RefAttributes<HTMLDivElement>>;
export { PickersInputBase };