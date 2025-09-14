import * as React from 'react';
import { BoxProps } from '@mui/material/Box';
export interface AccountPopoverFooterProps extends BoxProps {
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
 * - [AccountPopoverFooter API](https://mui.com/toolpad/core/api/account-popover-footer)
 */
declare function AccountPopoverFooter(props: AccountPopoverFooterProps): React.JSX.Element;
declare namespace AccountPopoverFooter {
  var propTypes: any;
}
export { AccountPopoverFooter };