'use client';

var _AccountPopoverHeader, _Divider;
import * as React from 'react';
import PropTypes from 'prop-types';
import Popover from '@mui/material/Popover';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import { SignInButton } from "./SignInButton.js";
import { SignOutButton } from "./SignOutButton.js";
import { AccountPreview } from "./AccountPreview.js";
import { AccountPopoverHeader } from "./AccountPopoverHeader.js";
import { AccountPopoverFooter } from "./AccountPopoverFooter.js";
import { SessionContext, AuthenticationContext } from "../AppProvider/AppProvider.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { AccountLocaleContext } from "./AccountLocaleContext.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const defaultAccountLocaleText = {
  accountPreviewIconButtonLabel: 'Current User',
  accountPreviewTitle: 'Account',
  accountSignInLabel: 'Sign in',
  accountSignOutLabel: 'Sign out'
};

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
function Account(props) {
  const {
    localeText: propsLocaleText
  } = props;
  const globalLocaleText = useLocaleText();
  const localeText = React.useMemo(() => ({
    ...defaultAccountLocaleText,
    ...globalLocaleText,
    ...propsLocaleText
  }), [globalLocaleText, propsLocaleText]);
  const {
    slots,
    slotProps
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const session = React.useContext(SessionContext);
  const authentication = React.useContext(AuthenticationContext);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (!authentication) {
    return null;
  }
  let accountContent = null;
  if (!session?.user) {
    accountContent = slots?.signInButton ? /*#__PURE__*/_jsx(slots.signInButton, {
      onClick: authentication.signIn
    }) : /*#__PURE__*/_jsx(SignInButton, {
      ...slotProps?.signInButton
    });
  } else {
    accountContent = /*#__PURE__*/_jsxs(React.Fragment, {
      children: [slots?.preview ? /*#__PURE__*/_jsx(slots.preview, {
        handleClick: handleClick,
        open: open
      }) : /*#__PURE__*/_jsx(AccountPreview, {
        variant: "condensed",
        handleClick: handleClick,
        open: open,
        ...slotProps?.preview
      }), slots?.popover ? /*#__PURE__*/_jsx(slots.popover, {
        open: open,
        onClick: handleClick,
        onClose: handleClose,
        ...slotProps?.popover
      }) : /*#__PURE__*/_jsx(Popover, {
        anchorEl: anchorEl,
        id: "account-menu",
        open: open,
        onClose: handleClose,
        onClick: handleClose,
        transformOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        ...slotProps?.popover,
        slotProps: {
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: theme => `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
              mt: 1,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          },
          ...slotProps?.popover?.slotProps
        },
        children: slots?.popoverContent ? /*#__PURE__*/_jsx(slots.popoverContent, {
          ...slotProps?.popoverContent
        }) : /*#__PURE__*/_jsxs(Stack, {
          direction: "column",
          ...slotProps?.popoverContent,
          children: [_AccountPopoverHeader || (_AccountPopoverHeader = /*#__PURE__*/_jsx(AccountPopoverHeader, {
            children: /*#__PURE__*/_jsx(AccountPreview, {
              variant: "expanded"
            })
          })), _Divider || (_Divider = /*#__PURE__*/_jsx(Divider, {})), /*#__PURE__*/_jsx(AccountPopoverFooter, {
            children: /*#__PURE__*/_jsx(SignOutButton, {
              ...slotProps?.signOutButton
            })
          })]
        })
      })]
    });
  }
  return /*#__PURE__*/_jsx(AccountLocaleContext.Provider, {
    value: localeText,
    children: accountContent
  });
}
process.env.NODE_ENV !== "production" ? Account.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The labels for the account component.
   */
  localeText: PropTypes.object,
  /**
   * The props used for each slot inside.
   */
  slotProps: PropTypes.shape({
    popover: PropTypes.object,
    popoverContent: PropTypes.object,
    preview: PropTypes.shape({
      handleClick: PropTypes.func,
      open: PropTypes.bool,
      slotProps: PropTypes.shape({
        avatar: PropTypes.object,
        avatarIconButton: PropTypes.object,
        moreIconButton: PropTypes.object
      }),
      slots: PropTypes.shape({
        avatar: PropTypes.elementType,
        avatarIconButton: PropTypes.elementType,
        moreIconButton: PropTypes.elementType
      }),
      sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object]),
      variant: PropTypes.oneOf(['condensed', 'expanded'])
    }),
    signInButton: PropTypes.object,
    signOutButton: PropTypes.object
  }),
  /**
   * The components used for each slot inside.
   */
  slots: PropTypes.shape({
    popover: PropTypes.elementType,
    popoverContent: PropTypes.elementType,
    preview: PropTypes.elementType,
    signInButton: PropTypes.elementType,
    signOutButton: PropTypes.elementType
  })
} : void 0;
export { Account };