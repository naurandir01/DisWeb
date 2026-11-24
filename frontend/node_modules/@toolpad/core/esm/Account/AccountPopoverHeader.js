import * as React from 'react';
import PropTypes from 'prop-types';
import Stack from '@mui/material/Stack';
import { jsx as _jsx } from "react/jsx-runtime";
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
function AccountPopoverHeader(props) {
  const {
    children,
    ...rest
  } = props;
  return /*#__PURE__*/_jsx(Stack, {
    ...rest,
    children: children
  });
}
process.env.NODE_ENV !== "production" ? AccountPopoverHeader.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: PropTypes.node
} : void 0;
export { AccountPopoverHeader };