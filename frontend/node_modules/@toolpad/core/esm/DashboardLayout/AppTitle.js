var _ToolpadLogo;
import * as React from 'react';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { styled, useTheme } from '@mui/material';
import { Link } from "../shared/Link.js";
import { ToolpadLogo } from "./ToolpadLogo.js";
import { useApplicationTitle } from "../shared/branding.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const LogoContainer = styled('div')({
  position: 'relative',
  height: 40,
  display: 'flex',
  alignItems: 'center',
  '& img': {
    maxHeight: 40
  }
});
/**
 * @ignore - internal component.
 */
export function AppTitle(props) {
  const theme = useTheme();
  const defaultTitle = useApplicationTitle();
  const title = props?.branding?.title ?? defaultTitle;
  return /*#__PURE__*/_jsx(Link, {
    href: props?.branding?.homeUrl ?? '/',
    style: {
      textDecoration: 'none'
    },
    children: /*#__PURE__*/_jsxs(Stack, {
      direction: "row",
      alignItems: "center",
      children: [/*#__PURE__*/_jsx(LogoContainer, {
        children: props?.branding?.logo ?? (_ToolpadLogo || (_ToolpadLogo = /*#__PURE__*/_jsx(ToolpadLogo, {
          size: 40
        })))
      }), /*#__PURE__*/_jsx(Typography, {
        variant: "h6",
        sx: {
          color: (theme.vars ?? theme).palette.primary.main,
          fontWeight: '700',
          ml: 1,
          whiteSpace: 'nowrap',
          lineHeight: 1
        },
        children: title
      })]
    })
  });
}