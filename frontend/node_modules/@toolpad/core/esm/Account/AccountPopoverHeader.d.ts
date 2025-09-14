import * as React from 'react';
import { StackProps } from '@mui/material/Stack';
export interface AccountPopoverHeaderProps extends StackProps {
  children?: React.ReactNode;
}
/**
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 *
 * API:
 *
 * - [AccountPopoverHeader API](https://mui.com/toolpad/core/api/account-popover-header)
 */
declare function AccountPopoverHeader(props: AccountPopoverHeaderProps): React.JSX.Element;
declare namespace AccountPopoverHeader {
  var propTypes: any;
}
export { AccountPopoverHeader };