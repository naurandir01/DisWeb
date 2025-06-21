import * as React from 'react';
import { AvatarProps } from '@mui/material/Avatar';
import { SxProps } from '@mui/material/styles';
import { IconButtonProps } from '@mui/material/IconButton';
export type AccountPreviewVariant = 'condensed' | 'expanded';
export interface AccountPreviewSlots {
  /**
   * The component used for the Avatar
   * @default Avatar
   */
  avatar?: React.ElementType;
  /**
   * The component used for the overflow icon button in the expanded variant
   * @default IconButton
   */
  moreIconButton?: React.ElementType;
  /**
   * The component used for the avatar icon button in the condensed variant
   * @default IconButton
   */
  avatarIconButton?: React.ElementType;
}
export interface AccountPreviewProps {
  /**
   * The components used for each slot inside.
   */
  slots?: AccountPreviewSlots;
  /**
   * The props used for each slot inside.
   */
  slotProps?: {
    avatar?: AvatarProps;
    moreIconButton?: IconButtonProps;
    avatarIconButton?: IconButtonProps;
  };
  /**
   * The type of account details to display.
   * @property {'condensed'} condensed - Shows only the user's avatar.
   * @property {'expanded'} expanded - Displays the user's avatar, name, and email if available.
   * @default 'condensed'
   */
  variant?: AccountPreviewVariant;
  /**
   * The handler used when the preview is expanded
   */
  handleClick?: React.MouseEventHandler<HTMLElement>;
  /**
   * The state of the Account popover
   * @default false
   */
  open?: boolean;
  /**
   * The prop used to customize the styling of the preview
   */
  sx?: SxProps;
}
/**
 * The AccountPreview component displays user account information.
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 *
 * API:
 *
 * - [AccountPreview API](https://mui.com/toolpad/core/api/account-preview)
 */
declare function AccountPreview(props: AccountPreviewProps): React.JSX.Element | null;
declare namespace AccountPreview {
  var propTypes: any;
}
export { AccountPreview };