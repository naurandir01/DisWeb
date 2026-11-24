"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignInPage = SignInPage;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Alert = _interopRequireDefault(require("@mui/material/Alert"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Box = _interopRequireDefault(require("@mui/material/Box"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _Container = _interopRequireDefault(require("@mui/material/Container"));
var _Divider = _interopRequireDefault(require("@mui/material/Divider"));
var _TextField = _interopRequireDefault(require("@mui/material/TextField"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _GitHub = _interopRequireDefault(require("@mui/icons-material/GitHub"));
var _Password = _interopRequireDefault(require("@mui/icons-material/Password"));
var _Fingerprint = _interopRequireDefault(require("@mui/icons-material/Fingerprint"));
var _Apple = _interopRequireDefault(require("@mui/icons-material/Apple"));
var _styles = require("@mui/material/styles");
var _Google = _interopRequireDefault(require("./icons/Google"));
var _Facebook = _interopRequireDefault(require("./icons/Facebook"));
var _Twitter = _interopRequireDefault(require("./icons/Twitter"));
var _Instagram = _interopRequireDefault(require("./icons/Instagram"));
var _TikTok = _interopRequireDefault(require("./icons/TikTok"));
var _LinkedIn = _interopRequireDefault(require("./icons/LinkedIn"));
var _Slack = _interopRequireDefault(require("./icons/Slack"));
var _Spotify = _interopRequireDefault(require("./icons/Spotify"));
var _Twitch = _interopRequireDefault(require("./icons/Twitch"));
var _Discord = _interopRequireDefault(require("./icons/Discord"));
var _Line = _interopRequireDefault(require("./icons/Line"));
var _Auth = _interopRequireDefault(require("./icons/Auth0"));
var _MicrosoftEntra = _interopRequireDefault(require("./icons/MicrosoftEntra"));
var _Cognito = _interopRequireDefault(require("./icons/Cognito"));
var _GitLab = _interopRequireDefault(require("./icons/GitLab"));
var _Keycloak = _interopRequireDefault(require("./icons/Keycloak"));
var _Okta = _interopRequireDefault(require("./icons/Okta"));
var _FusionAuth = _interopRequireDefault(require("./icons/FusionAuth"));
var _context = require("../shared/context");
var _LocalizationProvider = require("../AppProvider/LocalizationProvider");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
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
const IconProviderMap = new Map([['github', /*#__PURE__*/(0, _jsxRuntime.jsx)(_GitHub.default, {}, "github")], ['credentials', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Password.default, {}, "credentials")], ['google', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Google.default, {}, "google")], ['facebook', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Facebook.default, {}, "facebook")], ['passkey', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Fingerprint.default, {}, "passkey")], ['twitter', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Twitter.default, {}, "twitter")], ['apple', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Apple.default, {}, "apple")], ['instagram', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Instagram.default, {}, "instagram")], ['tiktok', /*#__PURE__*/(0, _jsxRuntime.jsx)(_TikTok.default, {}, "tiktok")], ['linkedin', /*#__PURE__*/(0, _jsxRuntime.jsx)(_LinkedIn.default, {}, "linkedin")], ['slack', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Slack.default, {}, "slack")], ['spotify', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Spotify.default, {}, "spotify")], ['twitch', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Twitch.default, {}, "twitch")], ['discord', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Discord.default, {}, "discord")], ['line', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Line.default, {}, "line")], ['auth0', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Auth.default, {}, "auth0")], ['microsoft-entra-id', /*#__PURE__*/(0, _jsxRuntime.jsx)(_MicrosoftEntra.default, {}, "microsoft-entra-id")], ['cognito', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Cognito.default, {}, "cognito")], ['gitlab', /*#__PURE__*/(0, _jsxRuntime.jsx)(_GitLab.default, {}, "gitlab")], ['keycloak', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Keycloak.default, {}, "keycloak")], ['okta', /*#__PURE__*/(0, _jsxRuntime.jsx)(_Okta.default, {}, "okta")], ['fusionauth', /*#__PURE__*/(0, _jsxRuntime.jsx)(_FusionAuth.default, {}, "fusionauth")]]);
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
  const theme = (0, _styles.useTheme)();
  const branding = React.useContext(_context.BrandingContext);
  const router = React.useContext(_context.RouterContext);
  const globalLocaleText = (0, _LocalizationProvider.useLocaleText)();
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
    sx: {
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      ...sx
    },
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Container.default, {
      component: "main",
      maxWidth: "xs",
      children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
        sx: {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          bgcolor: 'background.paper',
          borderRadius: 1,
          p: 4,
          gap: 1,
          border: '1px solid',
          borderColor: (0, _styles.alpha)(theme.palette.grey[400], 0.4),
          boxShadow: theme.shadows[4]
        },
        children: [branding?.logo, slots?.title ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.title, {}) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "h5",
          component: "h1",
          color: "textPrimary",
          sx: {
            textAlign: 'center',
            fontWeight: 600
          },
          children: typeof localeText.signInTitle === 'string' ? localeText.signInTitle : localeText.signInTitle(branding?.title)
        }), slots?.subtitle ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.subtitle, {}) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
          variant: "body2",
          color: "textSecondary",
          gutterBottom: true,
          textAlign: "center",
          children: localeText?.signInSubtitle
        }), /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
          sx: {
            width: '100%'
          },
          children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
            spacing: 1,
            children: [error && isOauthProvider(selectedProviderId) ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
              severity: "error",
              children: error
            }) : null, Object.values(providers ?? {}).filter(provider => isOauthProvider(provider.id)).map(provider => {
              return /*#__PURE__*/(0, _jsxRuntime.jsx)("form", {
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
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
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
                  children: /*#__PURE__*/(0, _jsxRuntime.jsx)("span", {
                    children: localeText.providerSignInTitle(provider.name)
                  })
                }, provider.id)
              }, provider.id);
            })]
          }), Object.values(providers ?? {}).filter(provider => !isOauthProvider(provider.id)).map((provider, index) => {
            return /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
              children: [isPasskeyProvider(provider.id) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
                children: [hasOauthProvider || index > 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
                  sx: {
                    mt: 2,
                    mx: 0,
                    mb: 1
                  },
                  children: localeText.or
                }) : null, error && selectedProviderId === 'passkey' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
                  sx: {
                    mt: 1,
                    mb: 2
                  },
                  severity: "error",
                  children: error
                }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
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
                  children: [slots?.emailField ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.emailField, {
                    ...slotProps?.emailField
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_TextField.default, {
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
                  }), slots?.submitButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.submitButton, {
                    ...slotProps?.submitButton
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
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
              }) : null, isEmailProvider(provider.id) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
                children: [hasOauthProvider || index > 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
                  sx: {
                    mt: 2,
                    mx: 0,
                    mb: 1
                  },
                  children: localeText.or
                }) : null, error && selectedProviderId === 'nodemailer' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
                  sx: {
                    my: 1
                  },
                  severity: "error",
                  children: error
                }) : null, success && selectedProviderId === 'nodemailer' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
                  sx: {
                    my: 1
                  },
                  severity: "success",
                  children: success
                }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
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
                  children: [slots?.emailField ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.emailField, {
                    ...slotProps?.emailField
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_TextField.default, {
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
                  }), slots?.submitButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.submitButton, {
                    ...slotProps?.submitButton
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
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
              }) : null, isCredentialsProvider(provider.id) ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
                children: [hasOauthProvider || index > 0 ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider.default, {
                  sx: {
                    mt: 2,
                    mx: 0,
                    mb: 1
                  },
                  children: localeText.or
                }) : null, error && selectedProviderId === 'credentials' ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Alert.default, {
                  sx: {
                    mt: 1,
                    mb: 2
                  },
                  severity: "error",
                  children: error
                }) : null, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Box.default, {
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
                  children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
                    direction: "column",
                    spacing: 2,
                    marginTop: 1,
                    children: [slots?.emailField ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.emailField, {
                      ...slotProps?.emailField
                    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_TextField.default, {
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
                    }), slots?.passwordField ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.passwordField, {
                      ...slotProps?.passwordField
                    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_TextField.default, {
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
                  }), slots?.forgotPasswordLink || slots?.rememberMe ? /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
                    direction: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                    spacing: 1,
                    mt: 2,
                    sx: {
                      justifyContent: 'space-between'
                    },
                    children: [slots?.rememberMe ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.rememberMe, {
                      ...slotProps?.rememberMe
                    }) : null, slots?.forgotPasswordLink ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.forgotPasswordLink, {
                      ...slotProps?.forgotPasswordLink
                    }) : null]
                  }) : null, slots?.submitButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.submitButton, {
                    ...slotProps?.submitButton
                  }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
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
                  }), slots?.signUpLink ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_Box.default, {
                    sx: {
                      display: 'flex',
                      justifyContent: 'center'
                    },
                    children: slots?.signUpLink ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.signUpLink, {
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
  localeText: _propTypes.default.object,
  /**
   * The list of authentication providers to display.
   * @default []
   */
  providers: _propTypes.default.arrayOf(_propTypes.default.shape({
    id: _propTypes.default.string.isRequired,
    name: _propTypes.default.string.isRequired
  })),
  /**
   * Callback fired when a user signs in.
   * @param {AuthProvider} provider The authentication provider.
   * @param {FormData} formData The form data if the provider id is 'credentials'.\
   * @param {string} callbackUrl The URL to redirect to after signing in.
   * @returns {void|Promise<AuthResponse>}
   * @default undefined
   */
  signIn: _propTypes.default.func,
  /**
   * The props used for each slot inside.
   * @default {}
   * @example { emailField: { autoFocus: false } }
   * @example { passwordField: { variant: 'outlined' } }
   * @example { emailField: { autoFocus: false }, passwordField: { variant: 'outlined' } }
   */
  slotProps: _propTypes.default.shape({
    emailField: _propTypes.default.object,
    forgotPasswordLink: _propTypes.default.object,
    form: _propTypes.default.object,
    oAuthButton: _propTypes.default.object,
    passwordField: _propTypes.default.object,
    rememberMe: _propTypes.default.object,
    signUpLink: _propTypes.default.object,
    submitButton: _propTypes.default.object
  }),
  /**
   * The components used for each slot inside.
   * @default {}
   * @example { forgotPasswordLink: <Link href="/forgot-password">Forgot password?</Link> }
   * @example { signUpLink: <Link href="/sign-up">Sign up</Link> }
   */
  slots: _propTypes.default.shape({
    emailField: _propTypes.default.elementType,
    forgotPasswordLink: _propTypes.default.elementType,
    passwordField: _propTypes.default.elementType,
    rememberMe: _propTypes.default.elementType,
    signUpLink: _propTypes.default.elementType,
    submitButton: _propTypes.default.elementType,
    subtitle: _propTypes.default.elementType,
    title: _propTypes.default.elementType
  }),
  /**
   * The prop used to customize the styles on the `SignInPage` container
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object])
} : void 0;