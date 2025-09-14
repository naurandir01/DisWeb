import * as React from 'react';
export interface OpenDialogOptions<R> {
  /**
   * A function that is called before closing the dialog closes. The dialog
   * stays open as long as the returned promise is not resolved. Use this if
   * you want to perform an async action on close and show a loading state.
   *
   * @param result The result that the dialog will return after closing.
   * @returns A promise that resolves when the dialog can be closed.
   */
  onClose?: (result: R) => Promise<void>;
}
export interface AlertOptions extends OpenDialogOptions<void> {
  /**
   * A title for the dialog. Defaults to `'Alert'`.
   */
  title?: React.ReactNode;
  /**
   * The text to show in the "Ok" button. Defaults to `'Ok'`.
   */
  okText?: React.ReactNode;
}
export interface ConfirmOptions extends OpenDialogOptions<boolean> {
  /**
   * A title for the dialog. Defaults to `'Confirm'`.
   */
  title?: React.ReactNode;
  /**
   * The text to show in the "Ok" button. Defaults to `'Ok'`.
   */
  okText?: React.ReactNode;
  /**
   * Denotes the purpose of the dialog. This will affect the color of the
   * "Ok" button. Defaults to `undefined`.
   */
  severity?: 'error' | 'info' | 'success' | 'warning';
  /**
   * The text to show in the "Cancel" button. Defaults to `'Cancel'`.
   */
  cancelText?: React.ReactNode;
}
export interface PromptOptions extends OpenDialogOptions<string | null> {
  /**
   * A title for the dialog. Defaults to `'Prompt'`.
   */
  title?: React.ReactNode;
  /**
   * The text to show in the "Ok" button. Defaults to `'Ok'`.
   */
  okText?: React.ReactNode;
  /**
   * The text to show in the "Cancel" button. Defaults to `'Cancel'`.
   */
  cancelText?: React.ReactNode;
}
/**
 * The props that are passed to a dialog component.
 */
export interface DialogProps<P = undefined, R = void> {
  /**
   * The payload that was passed when the dialog was opened.
   */
  payload: P;
  /**
   * Whether the dialog is open.
   */
  open: boolean;
  /**
   * A function to call when the dialog should be closed. If the dialog has a return
   * value, it should be passed as an argument to this function. You should use the promise
   * that is returned to show a loading state while the dialog is performing async actions
   * on close.
   * @param result The result to return from the dialog.
   * @returns A promise that resolves when the dialog can be fully closed.
   */
  onClose: (result: R) => Promise<void>;
}
export interface OpenAlertDialog {
  /**
   * Open an alert dialog. Returns a promise that resolves when the user
   * closes the dialog.
   *
   * @param msg The message to show in the dialog.
   * @param options Additional options for the dialog.
   * @returns A promise that resolves when the dialog is closed.
   */
  (msg: React.ReactNode, options?: AlertOptions): Promise<void>;
}
export interface OpenConfirmDialog {
  /**
   * Open a confirmation dialog. Returns a promise that resolves to true if
   * the user confirms, false if the user cancels.
   *
   * @param msg The message to show in the dialog.
   * @param options Additional options for the dialog.
   * @returns A promise that resolves to true if the user confirms, false if the user cancels.
   */
  (msg: React.ReactNode, options?: ConfirmOptions): Promise<boolean>;
}
export interface OpenPromptDialog {
  /**
   * Open a prompt dialog to request user input. Returns a promise that resolves to the input
   * if the user confirms, null if the user cancels.
   *
   * @param msg The message to show in the dialog.
   * @param options Additional options for the dialog.
   * @returns A promise that resolves to the user input if the user confirms, null if the user cancels.
   */
  (msg: React.ReactNode, options?: PromptOptions): Promise<string | null>;
}
export type DialogComponent<P, R> = React.ComponentType<DialogProps<P, R>>;
export interface OpenDialog {
  /**
   * Open a dialog without payload.
   * @param Component The dialog component to open.
   * @param options Additional options for the dialog.
   */
  <P extends undefined, R>(Component: DialogComponent<P, R>, payload?: P, options?: OpenDialogOptions<R>): Promise<R>;
  /**
   * Open a dialog and pass a payload.
   * @param Component The dialog component to open.
   * @param payload The payload to pass to the dialog.
   * @param options Additional options for the dialog.
   */
  <P, R>(Component: DialogComponent<P, R>, payload: P, options?: OpenDialogOptions<R>): Promise<R>;
}
export interface CloseDialog {
  /**
   * Close a dialog and return a result.
   * @param dialog The dialog to close. The promise returned by `open`.
   * @param result The result to return from the dialog.
   * @returns A promise that resolves when the dialog is fully closed.
   */
  <R>(dialog: Promise<R>, result: R): Promise<R>;
}
export interface DialogHook {
  alert: OpenAlertDialog;
  confirm: OpenConfirmDialog;
  prompt: OpenPromptDialog;
  open: OpenDialog;
  close: CloseDialog;
}
export interface AlertDialogPayload extends AlertOptions {
  msg: React.ReactNode;
}
export interface AlertDialogProps extends DialogProps<AlertDialogPayload, void> {}
export declare function AlertDialog({
  open,
  payload,
  onClose
}: AlertDialogProps): React.JSX.Element;
export interface ConfirmDialogPayload extends ConfirmOptions {
  msg: React.ReactNode;
}
export interface ConfirmDialogProps extends DialogProps<ConfirmDialogPayload, boolean> {}
export declare function ConfirmDialog({
  open,
  payload,
  onClose
}: ConfirmDialogProps): React.JSX.Element;
export interface PromptDialogPayload extends PromptOptions {
  msg: React.ReactNode;
}
export interface PromptDialogProps extends DialogProps<PromptDialogPayload, string | null> {}
export declare function PromptDialog({
  open,
  payload,
  onClose
}: PromptDialogProps): React.JSX.Element;
export declare function useDialogs(): DialogHook;