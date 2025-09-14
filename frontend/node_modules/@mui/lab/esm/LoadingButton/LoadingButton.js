'use client';

import * as React from 'react';
import Button from '@mui/material/Button';
import { jsx as _jsx } from "react/jsx-runtime";
let warnedOnce = false;
const warn = () => {
  if (!warnedOnce) {
    console.warn(['MUI: The LoadingButton component functionality is now part of the Button component from Material UI.', '', "You should use `import Button from '@mui/material/Button'`", "or `import { Button } from '@mui/material'`"].join('\n'));
    warnedOnce = true;
  }
};

/**
 * @ignore - do not document.
 */
export default /*#__PURE__*/React.forwardRef(function DeprecatedLoadingButton(props, ref) {
  warn();
  return /*#__PURE__*/_jsx(Button, {
    ref: ref,
    ...props
  });
});