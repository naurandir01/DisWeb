var _LogoutIcon;
import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import LogoutIcon from '@mui/icons-material/Logout';
import { AuthenticationContext } from "../AppProvider/index.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { AccountLocaleContext } from "./AccountLocaleContext.js";
import { jsx as _jsx } from "react/jsx-runtime";
/**
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 *
 * API:
 *
 * - [SignOutButton API](https://mui.com/toolpad/core/api/sign-out-button)
 */
function SignOutButton(props) {
  const authentication = React.useContext(AuthenticationContext);
  const globalLocaleText = useLocaleText();
  const accountLocaleText = React.useContext(AccountLocaleContext);
  const localeText = {
    ...globalLocaleText,
    ...accountLocaleText
  };
  return /*#__PURE__*/_jsx(Button, {
    disabled: !authentication,
    variant: "outlined",
    size: "small",
    disableElevation: true,
    onClick: authentication?.signOut,
    sx: {
      textTransform: 'capitalize',
      fontWeight: 'normal',
      filter: 'opacity(0.9)',
      transition: 'filter 0.2s ease-in',
      '&:hover': {
        filter: 'opacity(1)'
      }
    },
    startIcon: _LogoutIcon || (_LogoutIcon = /*#__PURE__*/_jsx(LogoutIcon, {})),
    ...props,
    children: localeText?.accountSignOutLabel
  });
}
process.env.NODE_ENV !== "production" ? SignOutButton.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: PropTypes.node
} : void 0;
export { SignOutButton };