import * as React from 'react';
export interface DialogProviderProps {
  children?: React.ReactNode;
  unmountAfter?: number;
}
/**
 * Provider for Dialog stacks. The subtree of this component can use the `useDialogs` hook to
 * access the dialogs API. The dialogs are rendered in the order they are requested.
 *
 * Demos:
 *
 * - [useDialogs](https://mui.com/toolpad/core/react-use-dialogs/)
 *
 * API:
 *
 * - [DialogsProvider API](https://mui.com/toolpad/core/api/dialogs-provider)
 */
declare function DialogsProvider(props: DialogProviderProps): React.JSX.Element;
export { DialogsProvider };