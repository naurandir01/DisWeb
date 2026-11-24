import * as React from 'react';
export interface ErrorOverlayProps {
  error?: unknown;
}
export declare function ErrorOverlay({
  error
}: ErrorOverlayProps): React.JSX.Element;
export declare function LoadingOverlay(): React.JSX.Element;