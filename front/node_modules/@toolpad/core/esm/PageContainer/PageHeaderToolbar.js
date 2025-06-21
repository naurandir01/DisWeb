'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material';
import { jsx as _jsx } from "react/jsx-runtime";
const PageHeaderToolbarRoot = styled('div')(({
  theme
}) => ({
  display: 'flex',
  flexDirection: 'row',
  gap: theme.spacing(1),
  // Ensure the toolbar is always on the right side, even after wrapping
  marginLeft: 'auto'
}));
/**
 *
 * Demos:
 *
 * - [Page Container](https://mui.com/toolpad/core/react-page-container/)
 *
 * API:
 *
 * - [PageHeaderToolbar API](https://mui.com/toolpad/core/api/page-header-toolbar)
 */
function PageHeaderToolbar(props) {
  return /*#__PURE__*/_jsx(PageHeaderToolbarRoot, {
    ...props
  });
}
process.env.NODE_ENV !== "production" ? PageHeaderToolbar.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * @ignore
   */
  children: PropTypes.node
} : void 0;
export { PageHeaderToolbar };