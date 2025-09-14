import * as React from 'react';
export interface NoSsrProps {
  children?: React.ReactNode;
  fallback?: React.ReactNode;
}
/**
 * @ignore - internal component.
 * Alternative version of MUI NoSsr that avoids state updates during layout effects.
 */
export declare function NoSsr({
  children,
  fallback
}: NoSsrProps): React.JSX.Element;