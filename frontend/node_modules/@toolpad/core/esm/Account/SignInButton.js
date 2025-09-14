import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { AuthenticationContext } from "../AppProvider/index.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { AccountLocaleContext } from "./AccountLocaleContext.js";

/**
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 *
 * API:
 *
 * - [SignInButton API](https://mui.com/toolpad/core/api/sign-in-button)
 */
import { jsx as _jsx } from "react/jsx-runtime";
function SignInButton(props) {
  const authentication = React.useContext(AuthenticationContext);
  const globalLocaleText = useLocaleText();
  const accountLocaleText = React.useContext(AccountLocaleContext);
  const localeText = {
    ...globalLocaleText,
    ...accountLocaleText
  };
  return /*#__PURE__*/_jsx(Button, {
    disableElevation: true,
    variant: "contained",
    size: "small",
    onClick: authentication?.signIn,
    sx: {
      textTransform: 'capitalize',
      filter: 'opacity(0.9)',
      width: '50%',
      margin: theme => `${theme.spacing(1)} auto`,
      transition: 'filter 0.2s ease-in',
      '&:hover': {
        filter: 'opacity(1)'
      }
    },
    ...props,
    children: localeText?.accountSignInLabel
  });
}
process.env.NODE_ENV !== "production" ? SignInButton.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: PropTypes.node
} : void 0;
export { SignInButton };