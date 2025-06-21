'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import GitHubIcon from '@mui/icons-material/GitHub';
import PasswordIcon from '@mui/icons-material/Password';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import AppleIcon from '@mui/icons-material/Apple';
import { alpha, useTheme } from '@mui/material/styles';
import GoogleIcon from "./icons/Google.js";
import FacebookIcon from "./icons/Facebook.js";
import TwitterIcon from "./icons/Twitter.js";
import InstagramIcon from "./icons/Instagram.js";
import TikTokIcon from "./icons/TikTok.js";
import LinkedInIcon from "./icons/LinkedIn.js";
import SlackIcon from "./icons/Slack.js";
import SpotifyIcon from "./icons/Spotify.js";
import TwitchIcon from "./icons/Twitch.js";
import DiscordIcon from "./icons/Discord.js";
import LineIcon from "./icons/Line.js";
import Auth0Icon from "./icons/Auth0.js";
import MicrosoftEntraIdIcon from "./icons/MicrosoftEntra.js";
import CognitoIcon from "./icons/Cognito.js";
import GitLabIcon from "./icons/GitLab.js";
import KeycloakIcon from "./icons/Keycloak.js";
import OktaIcon from "./icons/Okta.js";
import FusionAuthIcon from "./icons/FusionAuth.js";
import { BrandingContext, RouterContext } from "../shared/context.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const mergeSlotSx = (defaultSx, slotProps) => {
  if (Array.isArray(slotProps?.sx)) {
    return [defaultSx, ...slotProps.sx];
  }
  if (slotProps?.sx) {
    return [defaultSx, slotProps?.sx];
  }
  return [defaultSx];
};
const getCommonTextFieldProps = (theme, baseProps = {}) => ({
  required: true,
  fullWidth: true,
  ...baseProps,
  slotProps: {
    ...baseProps.slotProps,
    htmlInput: {
      ...baseProps.slotProps?.htmlInput,
      sx: mergeSlotSx({
        paddingTop: theme.spacing(1),
        paddingBottom: theme.spacing(1)
      }, typeof baseProps.slotProps?.htmlInput === 'function' ? {} : baseProps.slotProps?.htmlInput)
    },
    inputLabel: {
      ...baseProps.slotProps?.inputLabel,
      sx: mergeSlotSx({
        lineHeight: theme.typography.pxToRem(12),
        fontSize: theme.typography.pxToRem(14)
      }, typeof baseProps.slotProps?.inputLabel === 'function' ? {} : baseProps.slotProps?.inputLabel)
    }
  }
});
const IconProviderMap = new Map([['github', /*#__PURE__*/_jsx(GitHubIcon, {}, "github")], ['credentials', /*#__PURE__*/_jsx(PasswordIcon, {}, "credentials")], ['google', /*#__PURE__*/_jsx(GoogleIcon, {}, "google")], ['facebook', /*#__PURE__*/_jsx(FacebookIcon, {}, "facebook")], ['passkey', /*#__PURE__*/_jsx(FingerprintIcon, {}, "passkey")], ['twitter', /*#__PURE__*/_jsx(TwitterIcon, {}, "twitter")], ['apple', /*#__PURE__*/_jsx(AppleIcon, {}, "apple")], ['instagram', /*#__PURE__*/_jsx(InstagramIcon, {}, "instagram")], ['tiktok', /*#__PURE__*/_jsx(TikTokIcon, {}, "tiktok")], ['linkedin', /*#__PURE__*/_jsx(LinkedInIcon, {}, "linkedin")], ['slack', /*#__PURE__*/_jsx(SlackIcon, {}, "slack")], ['spotify', /*#__PURE__*/_jsx(SpotifyIcon, {}, "spotify")], ['twitch', /*#__PURE__*/_jsx(TwitchIcon, {}, "twitch")], ['discord', /*#__PURE__*/_jsx(DiscordIcon, {}, "discord")], ['line', /*#__PURE__*/_jsx(LineIcon, {}, "line")], ['auth0', /*#__PURE__*/_jsx(Auth0Icon, {}, "auth0")], ['microsoft-entra-id', /*#__PURE__*/_jsx(MicrosoftEntraIdIcon, {}, "microsoft-entra-id")], ['cognito', /*#__PURE__*/_jsx(CognitoIcon, {}, "cognito")], ['gitlab', /*#__PURE__*/_jsx(GitLabIcon, {}, "gitlab")], ['keycloak', /*#__PURE__*/_jsx(KeycloakIcon, {}, "keycloak")], ['okta', /*#__PURE__*/_jsx(OktaIcon, {}, "okta")], ['fusionauth', /*#__PURE__*/_jsx(FusionAuthIcon, {}, "fusionauth")]]);
const defaultLocaleText = {
  signInTitle: brandingTitle => brandingTitle ? `Sign in to ${brandingTitle}` : 'Sign in',
  signInSubtitle: 'Please sign in to continue',
  providerSignInTitle: provider => `Sign in with ${provider}`,
  signInRememberMe: 'Remember me',
  email: 'Email',
  password: 'Password',
  or: 'or',
  with: 'with',
  passkey: 'Passkey',
  to: 'to'
};

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
function SignInPage(props) {
  const {
    providers,
    signIn,
    slots,
    slotProps,
    sx,
    localeText: propsLocaleText
  } = props;
  const theme = useTheme();
  const branding = React.useContext(BrandingContext);
  const router = React.useContext(RouterContext);
  const globalLocaleText = useLocaleText();
  const localeText = {
    ...defaultLocaleText,
    ...globalLocaleText,
    ...propsLocaleText
  };
  const [{
    loading,
    selectedProviderId,
    error,
    success
  }, setFormStatus] = React.useState({
    selectedProviderId: undefined,
    loading: false,
    error: '',
    success: ''
  });
  const callbackUrl = router?.searchParams.get('callbackUrl') ?? '/';
  const singleProvider = React.useMemo(() => providers?.length === 1, [providers]);
  const isOauthProvider = React.useCallback(provider => provider && provider !== 'credentials' && provider !== 'nodemailer' && provider !== 'passkey', []);
  const hasOauthProvider = React.useMemo(() => providers?.some(provider => isOauthProvider(provider.id)), [isOauthProvider, providers]);
  const isPasskeyProvider = React.useCallback(provider => provider && provider === 'passkey', []);
  const isEmailProvider = React.useCallback(provider => provider && provider === 'nodemailer', []);
  const isCredentialsProvider = React.useCallback(provider => provider && provider === 'credentials', []);
  return /*#__PURE__*/_jsx(Box, {
    sx: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      ...sx
    },
    children: /*#__PURE__*/_jsx(Container, {
      component: "main",
      maxWidth: "xs",
      children: /*#__PURE__*/_jsxs(Stack, {
        sx: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 4,
          gap: 1,
          border: '1px solid',
          borderColor: alpha(theme.palette.grey[400], 0.4),
          boxShadow: theme.shadows[4]
        },
        children: [branding?.logo, slots?.title ? /*#__PURE__*/_jsx(slots.title, {}) : /*#__PURE__*/_jsx(Typography, {
          variant: "h5",
          component: "h1",
          color: "textPrimary",
          sx: {
            textAlign: 'center',
            fontWeight: 600
          },
          children: typeof localeText.signInTitle === 'string' ? localeText.signInTitle : localeText.signInTitle(branding?.title)
        }), slots?.subtitle ? /*#__PURE__*/_jsx(slots.subtitle, {}) : /*#__PURE__*/_jsx(Typography, {
          variant: "body2",
          color: "textSecondary",
          gutterBottom: true,
          textAlign: "center",
          children: localeText?.signInSubtitle
        }), /*#__PURE__*/_jsxs(Box, {
          sx: {
            width: '100%'
          },
          children: [/*#__PURE__*/_jsxs(Stack, {
            spacing: 1,
            children: [error && isOauthProvider(selectedProviderId) ? /*#__PURE__*/_jsx(Alert, {
              severity: "error",
              children: error
            }) : null, Object.values(providers ?? {}).filter(provider => isOauthProvider(provider.id)).map(provider => {
              return /*#__PURE__*/_jsx("form", {
                onSubmit: async event => {
                  event.preventDefault();
                  setFormStatus({
                    error: '',
                    selectedProviderId: provider.id,
                    loading: true
                  });
                  const oauthResponse = await signIn?.(provider, undefined, callbackUrl);
                  setFormStatus(prev => ({
                    ...prev,
                    loading: oauthResponse?.error ? false : prev.loading,
                    error: oauthResponse?.error
                  }));
                },
                ...slotProps?.form,
                children: /*#__PURE__*/_jsx(Button, {
                  variant: "outlined",
                  type: "submit",
                  fullWidth: true,
                  size: "large",
                  disableElevation: true,
                  name: "provider",
                  color: "inherit",
                  loading: loading && selectedProviderId === provider.id,
                  value: provider.id,
                  startIcon: IconProviderMap.get(provider.id),
                  sx: {
                    textTransform: 'capitalize'
                  },
                  ...slotProps?.oAuthButton,
                  children: /*#__PURE__*/_jsx("span", {
                    children: localeText.providerSignInTitle(provider.name)
                  })
                }, provider.id)
              }, provider.id);
            })]
          }), Object.values(providers ?? {}).filter(provider => !isOauthProvider(provider.id)).map((provider, index) => {
            return /*#__PURE__*/_jsxs(React.Fragment, {
              children: [isPasskeyProvider(provider.id) ? /*#__PURE__*/_jsxs(React.Fragment, {
                children: [hasOauthProvider || index > 0 ? /*#__PURE__*/_jsx(Divider, {
                  sx: {
                    mt: 2,
                    mx: 0,
                    mb: 1
                  },
                  children: localeText.or
                }) : null, error && selectedProviderId === 'passkey' ? /*#__PURE__*/_jsx(Alert, {
                  sx: {
                    mt: 1,
                    mb: 2
                  },
                  severity: "error",
                  children: error
                }) : null, /*#__PURE__*/_jsxs(Box, {
                  component: "form",
                  onSubmit: async event => {
                    setFormStatus({
                      error: '',
                      selectedProviderId: provider.id,
                      loading: true
                    });
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const passkeyResponse = await signIn?.(provider, formData, callbackUrl);
                    setFormStatus(prev => ({
                      ...prev,
                      loading: false,
                      error: passkeyResponse?.error
                    }));
                  },
                  ...slotProps?.form,
                  children: [slots?.emailField ? /*#__PURE__*/_jsx(slots.emailField, {
                    ...slotProps?.emailField
                  }) : /*#__PURE__*/_jsx(TextField, {
                    ...getCommonTextFieldProps(theme, {
                      label: localeText.email,
                      placeholder: 'your@email.com',
                      id: 'email-passkey',
                      name: 'email',
                      type: 'email',
                      autoComplete: 'email-webauthn',
                      autoFocus: singleProvider,
                      sx: {
                        mt: 1
                      },
                      ...slotProps?.emailField
                    })
                  }), slots?.submitButton ? /*#__PURE__*/_jsx(slots.submitButton, {
                    ...slotProps?.submitButton
                  }) : /*#__PURE__*/_jsx(Button, {
                    type: "submit",
                    fullWidth: true,
                    size: "large",
                    variant: "outlined",
                    disableElevation: true,
                    startIcon: IconProviderMap.get(provider.id),
                    color: "inherit",
                    loading: loading && selectedProviderId === provider.id,
                    sx: {
                      mt: 3,
                      mb: 2,
                      textTransform: 'capitalize'
                    },
                    ...slotProps?.submitButton,
                    children: localeText.providerSignInTitle(provider.name || localeText.passkey)
                  })]
                })]
              }) : null, isEmailProvider(provider.id) ? /*#__PURE__*/_jsxs(React.Fragment, {
                children: [hasOauthProvider || index > 0 ? /*#__PURE__*/_jsx(Divider, {
                  sx: {
                    mt: 2,
                    mx: 0,
                    mb: 1
                  },
                  children: localeText.or
                }) : null, error && selectedProviderId === 'nodemailer' ? /*#__PURE__*/_jsx(Alert, {
                  sx: {
                    my: 1
                  },
                  severity: "error",
                  children: error
                }) : null, success && selectedProviderId === 'nodemailer' ? /*#__PURE__*/_jsx(Alert, {
                  sx: {
                    my: 1
                  },
                  severity: "success",
                  children: success
                }) : null, /*#__PURE__*/_jsxs(Box, {
                  component: "form",
                  onSubmit: async event => {
                    event.preventDefault();
                    setFormStatus({
                      error: '',
                      selectedProviderId: provider.id,
                      loading: true
                    });
                    const formData = new FormData(event.currentTarget);
                    const emailResponse = await signIn?.(provider, formData, callbackUrl);
                    setFormStatus(prev => ({
                      ...prev,
                      loading: false,
                      error: emailResponse?.error,
                      success: emailResponse?.success
                    }));
                  },
                  ...slotProps?.form,
                  children: [slots?.emailField ? /*#__PURE__*/_jsx(slots.emailField, {
                    ...slotProps?.emailField
                  }) : /*#__PURE__*/_jsx(TextField, {
                    ...getCommonTextFieldProps(theme, {
                      label: localeText.email,
                      placeholder: 'your@email.com',
                      name: 'email',
                      id: 'email-nodemailer',
                      type: 'email',
                      autoComplete: 'email-nodemailer',
                      autoFocus: singleProvider,
                      sx: {
                        mt: 1
                      },
                      ...slotProps?.emailField
                    })
                  }), slots?.submitButton ? /*#__PURE__*/_jsx(slots.submitButton, {
                    ...slotProps?.submitButton
                  }) : /*#__PURE__*/_jsx(Button, {
                    type: "submit",
                    fullWidth: true,
                    size: "large",
                    variant: "outlined",
                    disableElevation: true,
                    id: "submit-nodemailer",
                    color: "inherit",
                    loading: loading && selectedProviderId === provider.id,
                    sx: {
                      mt: 3,
                      mb: 2,
                      textTransform: 'capitalize'
                    },
                    ...slotProps?.submitButton,
                    children: localeText.providerSignInTitle((provider.name || localeText.email).toLocaleLowerCase())
                  })]
                })]
              }) : null, isCredentialsProvider(provider.id) ? /*#__PURE__*/_jsxs(React.Fragment, {
                children: [hasOauthProvider || index > 0 ? /*#__PURE__*/_jsx(Divider, {
                  sx: {
                    mt: 2,
                    mx: 0,
                    mb: 1
                  },
                  children: localeText.or
                }) : null, error && selectedProviderId === 'credentials' ? /*#__PURE__*/_jsx(Alert, {
                  sx: {
                    mt: 1,
                    mb: 2
                  },
                  severity: "error",
                  children: error
                }) : null, /*#__PURE__*/_jsxs(Box, {
                  component: "form",
                  onSubmit: async event => {
                    setFormStatus({
                      error: '',
                      selectedProviderId: provider.id,
                      loading: true
                    });
                    event.preventDefault();
                    const formData = new FormData(event.currentTarget);
                    const credentialsResponse = await signIn?.(provider, formData, callbackUrl);
                    setFormStatus(prev => ({
                      ...prev,
                      loading: false,
                      error: credentialsResponse?.error
                    }));
                  },
                  ...slotProps?.form,
                  children: [/*#__PURE__*/_jsxs(Stack, {
                    direction: "column",
                    spacing: 2,
                    marginTop: 1,
                    children: [slots?.emailField ? /*#__PURE__*/_jsx(slots.emailField, {
                      ...slotProps?.emailField
                    }) : /*#__PURE__*/_jsx(TextField, {
                      ...getCommonTextFieldProps(theme, {
                        label: localeText.email,
                        placeholder: 'your@email.com',
                        id: 'email',
                        name: 'email',
                        type: 'email',
                        autoComplete: 'email',
                        autoFocus: singleProvider,
                        ...slotProps?.emailField
                      })
                    }), slots?.passwordField ? /*#__PURE__*/_jsx(slots.passwordField, {
                      ...slotProps?.passwordField
                    }) : /*#__PURE__*/_jsx(TextField, {
                      ...getCommonTextFieldProps(theme, {
                        name: 'password',
                        type: 'password',
                        label: localeText.password,
                        id: 'password',
                        placeholder: '*****',
                        autoComplete: 'current-password',
                        ...slotProps?.passwordField
                      })
                    })]
                  }), slots?.forgotPasswordLink || slots?.rememberMe ? /*#__PURE__*/_jsxs(Stack, {
                    direction: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    spacing: 1,
                    mt: 2,
                    sx: {
                      justifyContent: 'space-between'
                    },
                    children: [slots?.rememberMe ? /*#__PURE__*/_jsx(slots.rememberMe, {
                      ...slotProps?.rememberMe
                    }) : null, slots?.forgotPasswordLink ? /*#__PURE__*/_jsx(slots.forgotPasswordLink, {
                      ...slotProps?.forgotPasswordLink
                    }) : null]
                  }) : null, slots?.submitButton ? /*#__PURE__*/_jsx(slots.submitButton, {
                    ...slotProps?.submitButton
                  }) : /*#__PURE__*/_jsx(Button, {
                    type: "submit",
                    fullWidth: true,
                    size: "large",
                    variant: "outlined",
                    disableElevation: true,
                    color: "inherit",
                    loading: loading && selectedProviderId === provider.id,
                    sx: {
                      mt: 3,
                      mb: 2,
                      textTransform: 'capitalize'
                    },
                    ...slotProps?.submitButton,
                    children: localeText.providerSignInTitle((provider.name || localeText.password).toLocaleLowerCase())
                  }), slots?.signUpLink ? /*#__PURE__*/_jsx(Box, {
                    sx: {
                      display: 'flex',
                      justifyContent: 'center'
                    },
                    children: slots?.signUpLink ? /*#__PURE__*/_jsx(slots.signUpLink, {
                      ...slotProps?.signUpLink
                    }) : null
                  }) : null]
                })]
              }) : null]
            }, provider.id);
          })]
        })]
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? SignInPage.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The labels for the account component.
   */
  localeText: PropTypes.object,
  /**
   * The list of authentication providers to display.
   * @default []
   */
  providers: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired
  })),
  /**
   * Callback fired when a user signs in.
   * @param {AuthProvider} provider The authentication provider.
   * @param {FormData} formData The form data if the provider id is 'credentials'.\
   * @param {string} callbackUrl The URL to redirect to after signing in.
   * @returns {void|Promise<AuthResponse>}
   * @default undefined
   */
  signIn: PropTypes.func,
  /**
   * The props used for each slot inside.
   * @default {}
   * @example { emailField: { autoFocus: false } }
   * @example { passwordField: { variant: 'outlined' } }
   * @example { emailField: { autoFocus: false }, passwordField: { variant: 'outlined' } }
   */
  slotProps: PropTypes.shape({
    emailField: PropTypes.object,
    forgotPasswordLink: PropTypes.object,
    form: PropTypes.object,
    oAuthButton: PropTypes.object,
    passwordField: PropTypes.object,
    rememberMe: PropTypes.object,
    signUpLink: PropTypes.object,
    submitButton: PropTypes.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   * @example { forgotPasswordLink: <Link href="/forgot-password">Forgot password?</Link> }
   * @example { signUpLink: <Link href="/sign-up">Sign up</Link> }
   */
  slots: PropTypes.shape({
    emailField: PropTypes.elementType,
    forgotPasswordLink: PropTypes.elementType,
    passwordField: PropTypes.elementType,
    rememberMe: PropTypes.elementType,
    signUpLink: PropTypes.elementType,
    submitButton: PropTypes.elementType,
    subtitle: PropTypes.elementType,
    title: PropTypes.elementType
  }),
  /**
   * The prop used to customize the styles on the `SignInPage` container
   */
  sx: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])), PropTypes.func, PropTypes.object])
} : void 0;
export { SignInPage };