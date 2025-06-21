import * as React from 'react';
export interface LocaleText {
  accountSignInLabel: string;
  accountSignOutLabel: string;
  accountPreviewIconButtonLabel: string;
  accountPreviewTitle: string;
  signInTitle: string | ((brandingTitle?: string) => string);
  signInSubtitle: string;
  providerSignInTitle: (provider: string) => string;
  signInRememberMe: string;
  email: string;
  passkey: string;
  username: string;
  password: string;
  or: string;
  to: string;
  with: string;
  save: string;
  cancel: string;
  ok: string;
  close: string;
  delete: string;
  alert: string;
  confirm: string;
  loading: string;
  createNewButtonLabel: string;
  reloadButtonLabel: string;
  createLabel: string;
  createSuccessMessage: string;
  createErrorMessage: string;
  editLabel: string;
  editSuccessMessage: string;
  editErrorMessage: string;
  deleteLabel: string;
  deleteConfirmTitle: string;
  deleteConfirmMessage: string;
  deleteConfirmLabel: string;
  deleteCancelLabel: string;
  deleteSuccessMessage: string;
  deleteErrorMessage: string;
  deletedItemMessage: string;
}
export interface LocalizationProviderProps {
  children?: React.ReactNode;
  /**
   * Locale for components texts
   */
  localeText?: Partial<LocaleText>;
}
export declare const LocalizationContext: React.Context<Partial<LocaleText>>;
declare const LocalizationProvider: {
  (props: LocalizationProviderProps): React.JSX.Element;
  propTypes: any;
};
export { LocalizationProvider };
/**
 *
 * Demos:
 *
 * - [Sign-in Page](https://mui.com/toolpad/core/react-sign-in-page/)
 *
 * API:
 *
 * - [LocalizationProvider API](https://mui.com/toolpad/core/api/localization-provider)
 */
export declare function useLocaleText(): Partial<LocaleText>;