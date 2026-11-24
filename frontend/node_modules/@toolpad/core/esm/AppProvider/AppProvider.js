'use client';

import * as React from 'react';
import PropTypes from 'prop-types';
import { createTheme } from '@mui/material/styles';
import { NotificationsProvider } from "../useNotifications/index.js";
import { DialogsProvider } from "../useDialogs/index.js";
import { BrandingContext, NavigationContext, RouterContext, WindowContext } from "../shared/context.js";
import { AppThemeProvider } from "./AppThemeProvider.js";
import { LocalizationProvider } from "./LocalizationProvider.js";

/**
 * Abstract router used by Toolpad components.
 */
import { jsx as _jsx } from "react/jsx-runtime";
export const AuthenticationContext = /*#__PURE__*/React.createContext(null);
export const SessionContext = /*#__PURE__*/React.createContext(null);
function createDefaultTheme() {
  return createTheme({
    cssVariables: {
      colorSchemeSelector: 'data-toolpad-color-scheme'
    },
    colorSchemes: {
      dark: true
    }
  });
}

/**
 *
 * Demos:
 *
 * - [App Provider](https://mui.com/toolpad/core/react-app-provider/)
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 *
 * API:
 *
 * - [AppProvider API](https://mui.com/toolpad/core/api/app-provider)
 */
function AppProvider(props) {
  const {
    children,
    theme = createDefaultTheme(),
    branding = null,
    navigation = [],
    localeText,
    router = null,
    authentication = null,
    session = null,
    window: appWindow,
    nonce
  } = props;
  return /*#__PURE__*/_jsx(WindowContext.Provider, {
    value: appWindow,
    children: /*#__PURE__*/_jsx(AuthenticationContext.Provider, {
      value: authentication,
      children: /*#__PURE__*/_jsx(SessionContext.Provider, {
        value: session,
        children: /*#__PURE__*/_jsx(RouterContext.Provider, {
          value: router,
          children: /*#__PURE__*/_jsx(AppThemeProvider, {
            theme: theme,
            window: appWindow,
            nonce: nonce,
            children: /*#__PURE__*/_jsx(LocalizationProvider, {
              localeText: localeText,
              children: /*#__PURE__*/_jsx(NotificationsProvider, {
                children: /*#__PURE__*/_jsx(DialogsProvider, {
                  children: /*#__PURE__*/_jsx(BrandingContext.Provider, {
                    value: branding,
                    children: /*#__PURE__*/_jsx(NavigationContext.Provider, {
                      value: navigation,
                      children: children
                    })
                  })
                })
              })
            })
          })
        })
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? AppProvider.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * Authentication methods.
   * @default null
   */
  authentication: PropTypes.shape({
    signIn: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired
  }),
  /**
   * Branding options for the app.
   * @default null
   */
  branding: PropTypes.shape({
    homeUrl: PropTypes.string,
    logo: PropTypes.node,
    title: PropTypes.string
  }),
  /**
   * The content of the app provider.
   */
  children: PropTypes.node,
  /**
   * Locale text for components
   */
  localeText: PropTypes.object,
  /**
   * Navigation definition for the app. [Find out more](https://mui.com/toolpad/core/react-app-provider/#navigation).
   * @default []
   */
  navigation: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.shape({
    action: PropTypes.node,
    children: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.object, PropTypes.shape({
      kind: PropTypes.oneOf(['header']).isRequired,
      title: PropTypes.string.isRequired
    }), PropTypes.shape({
      kind: PropTypes.oneOf(['divider']).isRequired
    })]).isRequired),
    icon: PropTypes.node,
    kind: PropTypes.oneOf(['page']),
    pattern: PropTypes.string,
    segment: PropTypes.string,
    title: PropTypes.string
  }), PropTypes.shape({
    kind: PropTypes.oneOf(['header']).isRequired,
    title: PropTypes.string.isRequired
  }), PropTypes.shape({
    kind: PropTypes.oneOf(['divider']).isRequired
  })]).isRequired),
  /**
   * The nonce to be used for inline scripts.
   */
  nonce: PropTypes.string,
  /**
   * Router implementation used inside Toolpad components.
   * @default null
   */
  router: PropTypes.shape({
    Link: PropTypes.elementType,
    navigate: PropTypes.func.isRequired,
    pathname: PropTypes.string.isRequired,
    searchParams: PropTypes.instanceOf(URLSearchParams).isRequired
  }),
  /**
   * Session info about the current user.
   * @default null
   */
  session: PropTypes.shape({
    user: PropTypes.shape({
      email: PropTypes.string,
      id: PropTypes.string,
      image: PropTypes.string,
      name: PropTypes.string
    })
  }),
  /**
   * [Theme or themes](https://mui.com/toolpad/core/react-app-provider/#theming) to be used by the app in light/dark mode. A [CSS variables theme](https://mui.com/material-ui/customization/css-theme-variables/overview/) is recommended.
   * @default createDefaultTheme()
   */
  theme: PropTypes.object,
  /**
   * The window where the application is rendered.
   * This is needed when rendering the app inside an iframe, for example.
   * @default window
   */
  window: PropTypes.object
} : void 0;
export { AppProvider };