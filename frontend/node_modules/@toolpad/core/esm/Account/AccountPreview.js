var _MoreVertIcon;
import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Stack from '@mui/material/Stack';
import IconButton from '@mui/material/IconButton';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { SessionContext } from "../AppProvider/index.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { AccountLocaleContext } from "./AccountLocaleContext.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
function AccountPreview(props) {
  const {
    slots,
    variant = 'condensed',
    slotProps,
    open,
    handleClick,
    sx
  } = props;
  const session = React.useContext(SessionContext);
  const globalLocaleText = useLocaleText();
  const accountLocaleText = React.useContext(AccountLocaleContext);
  const localeText = {
    ...globalLocaleText,
    ...accountLocaleText
  };
  if (!session || !session.user) {
    return null;
  }
  const avatarContent = slots?.avatar ? /*#__PURE__*/_jsx(slots.avatar, {}) : /*#__PURE__*/_jsx(Avatar, {
    src: session.user?.image || '',
    alt: session.user?.name || session.user?.email || '',
    sx: {
      height: variant === 'expanded' ? 48 : 32,
      width: variant === 'expanded' ? 48 : 32
    },
    ...slotProps?.avatar
  });
  if (variant === 'expanded') {
    return /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      justifyContent: "space-between",
      sx: {
        py: 1,
        px: 2,
        gap: 2,
        ...sx
      },
      children: [/*#__PURE__*/_jsxs(Stack, {
        direction: "row",
        justifyContent: "flex-start",
        spacing: 2,
        overflow: "hidden",
        children: [avatarContent, /*#__PURE__*/_jsxs(Stack, {
          direction: "column",
          justifyContent: "space-evenly",
          overflow: "hidden",
          children: [/*#__PURE__*/_jsx(Typography, {
            variant: "body2",
            fontWeight: "bolder",
            noWrap: true,
            children: session.user?.name
          }), /*#__PURE__*/_jsx(Typography, {
            variant: "caption",
            noWrap: true,
            children: session.user?.email
          })]
        })]
      }), handleClick && (slots?.moreIconButton ? /*#__PURE__*/_jsx(slots.moreIconButton, {}) : /*#__PURE__*/_jsx(IconButton, {
        size: "small",
        onClick: handleClick,
        ...slotProps?.moreIconButton,
        sx: {
          alignSelf: 'center',
          ...slotProps?.moreIconButton?.sx
        },
        children: _MoreVertIcon || (_MoreVertIcon = /*#__PURE__*/_jsx(MoreVertIcon, {
          fontSize: "small"
        }))
      }))]
    });
  }
  return /*#__PURE__*/_jsx(Tooltip, {
    title: session.user.name ?? accountLocaleText?.accountPreviewTitle,
    children: slots?.avatarIconButton ? /*#__PURE__*/_jsx(slots.avatarIconButton, {
      ...slotProps?.avatarIconButton
    }) : /*#__PURE__*/_jsx(Stack, {
      sx: {
        py: 0.5,
        ...sx
      },
      children: /*#__PURE__*/_jsx(IconButton, {
        onClick: handleClick,
        "aria-label": localeText?.accountPreviewIconButtonLabel,
        size: "small",
        "aria-controls": open ? 'account-menu' : undefined,
        "aria-haspopup": "true",
        "aria-expanded": open ? 'true' : undefined,
        ...slotProps?.avatarIconButton,
        sx: {
          width: 'fit-content',
          margin: '0 auto',
          ...slotProps?.avatarIconButton?.sx
        },
        children: avatarContent
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? AccountPreview.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The handler used when the preview is expanded
   */
  handleClick: PropTypes.func,
  /**
   * The state of the Account popover
   * @default false
   */
  open: PropTypes.bool,
  /**
   * The props used for each slot inside.
   */
  slotProps: PropTypes.shape({
    avatar: PropTypes.object,
    avatarIconButton: PropTypes.object,
    moreIconButton: PropTypes.object
  }),
  /**
   * The components used for each slot inside.
   */
  slots: PropTypes.shape({
    avatar: PropTypes.elementType,
    avatarIconButton: PropTypes.elementType,
    moreIconButton: PropTypes.elementType
  }),
  /**
   * The prop used to customize the styling of the preview
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
  /**
   * The type of account details to display.
   * @property {'condensed'} condensed - Shows only the user's avatar.
   * @property {'expanded'} expanded - Displays the user's avatar, name, and email if available.
   * @default 'condensed'
   */
  variant: PropTypes.oneOf(['condensed', 'expanded'])
} : void 0;
export { AccountPreview };