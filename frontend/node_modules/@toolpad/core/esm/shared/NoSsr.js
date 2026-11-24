import * as React from 'react';
import useSsr from '@toolpad/utils/hooks/useSsr';
import { jsx as _jsx } from "react/jsx-runtime";
/**
 * @ignore - internal component.
 * Alternative version of MUI NoSsr that avoids state updates during layout effects.
 */
export function NoSsr({
  children,
  fallback = null
}) {
  const isSsr = useSsr();
  return /*#__PURE__*/_jsx(React.Fragment, {
    children: isSsr ? fallback : children
  });
}