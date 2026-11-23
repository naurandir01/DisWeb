import * as React from 'react';
import { ButtonProps } from '@mui/material/Button';
import { FormControlLabelProps } from '@mui/material/FormControlLabel';
import { TextFieldProps } from '@mui/material/TextField';
import { SxProps } from '@mui/material/styles';
import { LinkProps } from '@mui/material/Link';
type SupportedOAuthProvider = 'github' | 'google' | 'facebook' | 'gitlab' | 'twitter' | 'apple' | 'instagram' | 'tiktok' | 'linkedin' | 'slack' | 'spotify' | 'twitch' | 'discord' | 'line' | 'auth0' | 'cognito' | 'keycloak' | 'okta' | 'fusionauth' | 'microsoft-entra-id';
export type SupportedAuthProvider = SupportedOAuthProvider | 'credentials' | 'passkey' | 'nodemailer' | string;
interface SignInPageLocaleText {
  signInTitle: string | ((brandingTitle?: string) => string);
  signInSubtitle: string;
  signInRememberMe: string;
  providerSignInTitle: (provider: string) => string;
  email: string;
  password: string;
  or: string;
  with: string;
  passkey: string;
  to: string;
}
export interface AuthProvider {
  /**
   * The unique identifier of the authentication provider.
   * @default undefined
   * @example 'google'
   * @example 'github'
   */
  id: SupportedAuthProvider;
  /**
   * The name of the authentication provider.
   * @default ''
   * @example 'Google'
   * @example 'GitHub'
   */
  name: string;
}
export interface AuthResponse {
  /**
   * The error message if the sign-in failed.
   * @default ''
   */
  error?: string;
  /**
   * The type of error if the sign-in failed.
   * @default ''
   */
  type?: string;
  /**
   * The success notification if the sign-in was successful.
   * @default ''
   * Only used for magic link sign-in.
   * @example 'Check your email for a magic link.'
   */
  success?: string;
}
export interface SignInPageSlots {
  /**
   * The custom email field component used in the credentials form.
   * @default TextField
   */
  emailField?: React.JSXElementConstructor<TextFieldProps>;
  /**
   * The custom password field component used in the credentials form.
   * @default TextField
   */
  passwordField?: React.JSXElementConstructor<TextFieldProps>;
  /**
   * The custom submit button component used in the credentials form.
   * @default Button
   */
  submitButton?: React.JSXElementConstructor<ButtonProps>;
  /**
   * The custom forgot password link component used in the credentials form.
   * @default Link
   */
  forgotPasswordLink?: React.JSXElementConstructor<LinkProps>;
  /**
   * The custom sign up link component used in the credentials form.
   * @default Link
   */
  signUpLink?: React.JSXElementConstructor<LinkProps>;
  /**
   * A component to override the default title section
   * @default Typography
   */
  title?: React.ElementType;
  /**
   * A component to override the default subtitle section
   * @default Typography
   */
  subtitle?: React.ElementType;
  /**
   * A custom checkbox placed in the credentials form
   * @default FormControlLabel
   */
  rememberMe?: React.ElementType;
}
export interface SignInPageProps {
  /**
   * The list of authentication providers to display.
   * @default []
   */
  providers?: AuthProvider[];
  /**
   * Callback fired when a user signs in.
   * @param {AuthProvider} provider The authentication provider.
   * @param {FormData} formData The form data if the provider id is 'credentials'.\
   * @param {string} callbackUrl The URL to redirect to after signing in.
   * @returns {void|Promise<AuthResponse>}
   * @default undefined
   */
  signIn?: (provider: AuthProvider, formData?: any, callbackUrl?: string) => void | Promise<AuthResponse> | undefined;
  /**
   * The components used for each slot inside.
   * @default {}
   * @example { forgotPasswordLink: <Link href="/forgot-password">Forgot password?</Link> }
   * @example { signUpLink: <Link href="/sign-up">Sign up</Link> }
   */
  slots?: SignInPageSlots;
  /**
   * The props used for each slot inside.
   * @default {}
   * @example { emailField: { autoFocus: false } }
   * @example { passwordField: { variant: 'outlined' } }
   * @example { emailField: { autoFocus: false }, passwordField: { variant: 'outlined' } }
   */
  slotProps?: {
    emailField?: TextFieldProps;
    passwordField?: TextFieldProps;
    submitButton?: ButtonProps;
    forgotPasswordLink?: LinkProps;
    signUpLink?: LinkProps;
    rememberMe?: Partial<FormControlLabelProps>;
    form?: Partial<React.FormHTMLAttributes<HTMLFormElement>>;
    oAuthButton?: ButtonProps;
  };
  /**
   * The prop used to customize the styles on the `SignInPage` container
   */
  sx?: SxProps;
  /**
   * The labels for the account component.
   */
  localeText?: Partial<SignInPageLocaleText>;
}
/**
 *
 * Demos:
 *
 * - [Sign-in Page](https://mui.com/toolpad/core/react-sign-in-page/)
 *
 * API:
 *
 * - [SignInPage API](https://mui.com/toolpad/core/api/sign-in-page)
 */
declare function SignInPage(props: SignInPageProps): React.JSX.Element;
declare namespace SignInPage {
  var propTypes: any;
}
export { SignInPage };