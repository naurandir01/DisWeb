"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.SignOutButton = SignOutButton;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Button = _interopRequireDefault(require("@mui/material/Button"));
var _Logout = _interopRequireDefault(require("@mui/icons-material/Logout"));
var _AppProvider = require("../AppProvider");
var _LocalizationProvider = require("../AppProvider/LocalizationProvider");
var _AccountLocaleContext = require("./AccountLocaleContext");
var _jsxRuntime = require("react/jsx-runtime");
var _LogoutIcon;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 *
 * API:
 *
 * - [SignOutButton API](https://mui.com/toolpad/core/api/sign-out-button)
 */
function SignOutButton(props) {
  const authentication = React.useContext(_AppProvider.AuthenticationContext);
  const globalLocaleText = (0, _LocalizationProvider.useLocaleText)();
  const accountLocaleText = React.useContext(_AccountLocaleContext.AccountLocaleContext);
  const localeText = {
    ...globalLocaleText,
    ...accountLocaleText
  };
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Button.default, {
    disabled: !authentication,
    variant: "outlined",
    size: "small",
    disableElevation: true,
    onClick: authentication?.signOut,
    sx: {
      textTransform: 'capitalize',
      fontWeight: 'normal',
      filter: 'opacity(0.9)',
      transition: 'filter 0.2s ease-in',
      '&:hover': {
        filter: 'opacity(1)'
      }
    },
    startIcon: _LogoutIcon || (_LogoutIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Logout.default, {})),
    ...props,
    children: localeText?.accountSignOutLabel
  });
}
process.env.NODE_ENV !== "production" ? SignOutButton.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The content of the component.
   */
  children: _propTypes.default.node
} : void 0;