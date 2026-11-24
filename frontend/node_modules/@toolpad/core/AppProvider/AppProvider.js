"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AppProvider = AppProvider;
exports.SessionContext = exports.AuthenticationContext = void 0;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _useNotifications = require("../useNotifications");
var _useDialogs = require("../useDialogs");
var _context = require("../shared/context");
var _AppThemeProvider = require("./AppThemeProvider");
var _LocalizationProvider = require("./LocalizationProvider");
var _jsxRuntime = require("react/jsx-runtime");
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * Abstract router used by Toolpad components.
 */

const AuthenticationContext = exports.AuthenticationContext = /*#__PURE__*/React.createContext(null);
const SessionContext = exports.SessionContext = /*#__PURE__*/React.createContext(null);
function createDefaultTheme() {
  return (0, _styles.createTheme)({
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
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.WindowContext.Provider, {
    value: appWindow,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(AuthenticationContext.Provider, {
      value: authentication,
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(SessionContext.Provider, {
        value: session,
        children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.RouterContext.Provider, {
          value: router,
          children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_AppThemeProvider.AppThemeProvider, {
            theme: theme,
            window: appWindow,
            nonce: nonce,
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_LocalizationProvider.LocalizationProvider, {
              localeText: localeText,
              children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_useNotifications.NotificationsProvider, {
                children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_useDialogs.DialogsProvider, {
                  children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.BrandingContext.Provider, {
                    value: branding,
                    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_context.NavigationContext.Provider, {
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
  authentication: _propTypes.default.shape({
    signIn: _propTypes.default.func.isRequired,
    signOut: _propTypes.default.func.isRequired
  }),
  /**
   * Branding options for the app.
   * @default null
   */
  branding: _propTypes.default.shape({
    homeUrl: _propTypes.default.string,
    logo: _propTypes.default.node,
    title: _propTypes.default.string
  }),
  /**
   * The content of the app provider.
   */
  children: _propTypes.default.node,
  /**
   * Locale text for components
   */
  localeText: _propTypes.default.object,
  /**
   * Navigation definition for the app. [Find out more](https://mui.com/toolpad/core/react-app-provider/#navigation).
   * @default []
   */
  navigation: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.shape({
    action: _propTypes.default.node,
    children: _propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.object, _propTypes.default.shape({
      kind: _propTypes.default.oneOf(['header']).isRequired,
      title: _propTypes.default.string.isRequired
    }), _propTypes.default.shape({
      kind: _propTypes.default.oneOf(['divider']).isRequired
    })]).isRequired),
    icon: _propTypes.default.node,
    kind: _propTypes.default.oneOf(['page']),
    pattern: _propTypes.default.string,
    segment: _propTypes.default.string,
    title: _propTypes.default.string
  }), _propTypes.default.shape({
    kind: _propTypes.default.oneOf(['header']).isRequired,
    title: _propTypes.default.string.isRequired
  }), _propTypes.default.shape({
    kind: _propTypes.default.oneOf(['divider']).isRequired
  })]).isRequired),
  /**
   * The nonce to be used for inline scripts.
   */
  nonce: _propTypes.default.string,
  /**
   * Router implementation used inside Toolpad components.
   * @default null
   */
  router: _propTypes.default.shape({
    Link: _propTypes.default.elementType,
    navigate: _propTypes.default.func.isRequired,
    pathname: _propTypes.default.string.isRequired,
    searchParams: _propTypes.default.instanceOf(URLSearchParams).isRequired
  }),
  /**
   * Session info about the current user.
   * @default null
   */
  session: _propTypes.default.shape({
    user: _propTypes.default.shape({
      email: _propTypes.default.string,
      id: _propTypes.default.string,
      image: _propTypes.default.string,
      name: _propTypes.default.string
    })
  }),
  /**
   * [Theme or themes](https://mui.com/toolpad/core/react-app-provider/#theming) to be used by the app in light/dark mode. A [CSS variables theme](https://mui.com/material-ui/customization/css-theme-variables/overview/) is recommended.
   * @default createDefaultTheme()
   */
  theme: _propTypes.default.object,
  /**
   * The window where the application is rendered.
   * This is needed when rendering the app inside an iframe, for example.
   * @default window
   */
  window: _propTypes.default.object
} : void 0;