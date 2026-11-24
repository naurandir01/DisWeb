var _ErrorIcon, _OverlayRoot;
import * as React from 'react';
import { CircularProgress, Typography, styled } from '@mui/material';
import ErrorIcon from '@mui/icons-material/Error';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const OverlayRoot = styled('div')(({
  theme
}) => ({
  position: 'absolute',
  inset: '0 0 0 0',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(2)
}));
export function ErrorOverlay({
  error
}) {
  return /*#__PURE__*/_jsxs(OverlayRoot, {
    children: [/*#__PURE__*/_jsxs(Typography, {
      variant: "h6",
      sx: {
        display: 'flex',
        flexDirection: 'row',
        gap: 1,
        alignItems: 'center'
      },
      children: [_ErrorIcon || (_ErrorIcon = /*#__PURE__*/_jsx(ErrorIcon, {
        color: "error"
      })), " Error"]
    }), /*#__PURE__*/_jsx(Typography, {
      textAlign: "center",
      children: error?.message ?? 'Unknown error'
    })]
  });
}
export function LoadingOverlay() {
  return _OverlayRoot || (_OverlayRoot = /*#__PURE__*/_jsx(OverlayRoot, {
    children: /*#__PURE__*/_jsx(CircularProgress, {})
  }));
}