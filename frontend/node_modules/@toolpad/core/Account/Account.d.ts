import * as React from 'react';
import Button, { ButtonProps } from '@mui/material/Button';
import Popover, { PopoverProps } from '@mui/material/Popover';
import Stack, { StackProps } from '@mui/material/Stack';
import { SignInButton } from "./SignInButton.js";
import { AccountPreviewProps } from "./AccountPreview.js";
interface AccountLocaleText {
  accountSignInLabel: string;
  accountSignOutLabel: string;
  accountPreviewIconButtonLabel: string;
  accountPreviewTitle: string;
}
export interface AccountSlots {
  /**
   * The component used for the account preview
   * @default AccountPreview
   */
  preview?: React.JSXElementConstructor<AccountPreviewProps>;
  /**
   * The component used for the account popover menu
   * @default Popover
   */
  popover?: React.JSXElementConstructor<PopoverProps>;
  /**
   * The component used for the content of account popover
   * @default Stack
   */
  popoverContent?: React.JSXElementConstructor<StackProps>;
  /**
   * The component used for the sign in button.
   * @default Button
   */
  signInButton?: React.JSXElementConstructor<ButtonProps>;
  /**
   * The component used for the sign out button.
   * @default Button
   */
  signOutButton?: React.JSXElementConstructor<ButtonProps>;
}
export interface AccountProps {
  /**
   * The components used for each slot inside.
   */
  slots?: AccountSlots;
  /**
   * The props used for each slot inside.
   */
  slotProps?: {
    preview?: AccountPreviewProps;
    popover?: Omit<React.ComponentProps<typeof Popover>, 'open'>;
    popoverContent?: React.ComponentProps<typeof Stack>;
    signInButton?: React.ComponentProps<typeof SignInButton>;
    signOutButton?: React.ComponentProps<typeof Button>;
  };
  /**
   * The labels for the account component.
   */
  localeText?: Partial<AccountLocaleText>;
}
/**
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 * - [Sign-in Page](https://mui.com/toolpad/core/react-sign-in-page/)
 *
 * API:
 *
 * - [Account API](https://mui.com/toolpad/core/api/account)
 */
declare function Account(props: AccountProps): React.JSX.Element | null;
declare namespace Account {
  var propTypes: any;
}
export { Account };