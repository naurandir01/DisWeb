'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import useSlotProps from '@mui/utils/useSlotProps';
import { styled } from '@mui/material';
import { Link as ToolpadLink } from "../shared/Link.js";
import { getItemTitle } from "../shared/navigation.js";
import { useActivePage } from "../useActivePage/index.js";
import { PageHeaderToolbar } from "./PageHeaderToolbar.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const PageContentHeader = styled('div')(({
  theme
}) => ({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'space-between',
  gap: theme.spacing(2)
}));
/**
 * A header component to provide a title and breadcrumbs for your pages.
 *
 * Demos:
 *
 * - [Page Container](https://mui.com/toolpad/core/react-page-container/)
 *
 * API:
 *
 * - [PageHeader API](https://mui.com/toolpad/core/api/page-header)
 */
function PageHeader(props) {
  const {
    breadcrumbs,
    title
  } = props;
  const activePage = useActivePage();
  const resolvedBreadcrumbs = breadcrumbs ?? activePage?.breadcrumbs ?? [];
  const resolvedTitle = title ?? activePage?.title ?? '';
  const ToolbarComponent = props?.slots?.toolbar ?? PageHeaderToolbar;
  const toolbarSlotProps = useSlotProps({
    elementType: ToolbarComponent,
    ownerState: props,
    externalSlotProps: props?.slotProps?.toolbar,
    additionalProps: {}
  });
  return /*#__PURE__*/_jsxs(Stack, {
    children: [/*#__PURE__*/_jsx(Breadcrumbs, {
      "aria-label": "breadcrumb",
      children: resolvedBreadcrumbs ? resolvedBreadcrumbs.map((item, index) => {
        return item.path ? /*#__PURE__*/_jsx(Link, {
          component: ToolpadLink,
          underline: "hover",
          color: "inherit",
          href: item.path,
          children: getItemTitle(item)
        }, index) : /*#__PURE__*/_jsx(Typography, {
          color: "text.primary",
          children: getItemTitle(item)
        }, index);
      }) : null
    }), /*#__PURE__*/_jsxs(PageContentHeader, {
      children: [resolvedTitle ? /*#__PURE__*/_jsx(Typography, {
        variant: "h4",
        children: resolvedTitle
      }) : null, /*#__PURE__*/_jsx(ToolbarComponent, {
        ...toolbarSlotProps
      })]
    })]
  });
}
process.env.NODE_ENV !== "production" ? PageHeader.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The breadcrumbs of the page. Leave blank to use the active page breadcrumbs.
   */
  breadcrumbs: PropTypes.arrayOf(PropTypes.shape({
    path: PropTypes.string,
    title: PropTypes.string.isRequired
  })),
  /**
   * The props used for each slot inside.
   */
  slotProps: PropTypes.shape({
    toolbar: PropTypes.shape({
      children: PropTypes.node
    }).isRequired
  }),
  /**
   * The components used for each slot inside.
   */
  slots: PropTypes.shape({
    toolbar: PropTypes.elementType
  }),
  /**
   * The title of the page. Leave blank to use the active page title.
   */
  title: PropTypes.string
} : void 0;
export { PageHeader };