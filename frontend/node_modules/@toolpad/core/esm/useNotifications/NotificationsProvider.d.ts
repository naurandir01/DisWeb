import * as React from 'react';
import { SnackbarProps } from '@mui/material';
export interface NotificationsProviderSlotProps {
  snackbar: SnackbarProps;
}
export interface NotificationsProviderSlots {
  /**
   * The component that renders the snackbar.
   * @default Snackbar
   */
  snackbar: React.ElementType;
}
export interface NotificationsProviderProps {
  children?: React.ReactNode;
  slots?: Partial<NotificationsProviderSlots>;
  slotProps?: Partial<NotificationsProviderSlotProps>;
}
/**
 * Provider for Notifications. The subtree of this component can use the `useNotifications` hook to
 * access the notifications API. The notifications are shown in the same order they are requested.
 *
 * Demos:
 *
 * - [Sign-in Page](https://mui.com/toolpad/core/react-sign-in-page/)
 * - [useNotifications](https://mui.com/toolpad/core/react-use-notifications/)
 *
 * API:
 *
 * - [NotificationsProvider API](https://mui.com/toolpad/core/api/notifications-provider)
 */
declare function NotificationsProvider(props: NotificationsProviderProps): React.JSX.Element;
export { NotificationsProvider };