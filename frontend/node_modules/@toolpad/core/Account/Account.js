"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Account = Account;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Popover = _interopRequireDefault(require("@mui/material/Popover"));
var _Divider2 = _interopRequireDefault(require("@mui/material/Divider"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _SignInButton = require("./SignInButton");
var _SignOutButton = require("./SignOutButton");
var _AccountPreview = require("./AccountPreview");
var _AccountPopoverHeader2 = require("./AccountPopoverHeader");
var _AccountPopoverFooter = require("./AccountPopoverFooter");
var _AppProvider = require("../AppProvider/AppProvider");
var _LocalizationProvider = require("../AppProvider/LocalizationProvider");
var _AccountLocaleContext = require("./AccountLocaleContext");
var _jsxRuntime = require("react/jsx-runtime");
var _AccountPopoverHeader, _Divider;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const defaultAccountLocaleText = {
  accountPreviewIconButtonLabel: 'Current User',
  accountPreviewTitle: 'Account',
  accountSignInLabel: 'Sign in',
  accountSignOutLabel: 'Sign out'
};

/**
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 * - [Dashboard Layout](https://mui.com/toolpad/core/react-dashboard-layout/)
 * - [Sign-in Page](https://mui.com/toolpad/core/react-sign-in-page/)
 *
 * API:
 *
 * - [Account API](https://mui.com/toolpad/core/api/account)
 */
function Account(props) {
  const {
    localeText: propsLocaleText
  } = props;
  const globalLocaleText = (0, _LocalizationProvider.useLocaleText)();
  const localeText = React.useMemo(() => ({
    ...defaultAccountLocaleText,
    ...globalLocaleText,
    ...propsLocaleText
  }), [globalLocaleText, propsLocaleText]);
  const {
    slots,
    slotProps
  } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const session = React.useContext(_AppProvider.SessionContext);
  const authentication = React.useContext(_AppProvider.AuthenticationContext);
  const open = Boolean(anchorEl);
  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  if (!authentication) {
    return null;
  }
  let accountContent = null;
  if (!session?.user) {
    accountContent = slots?.signInButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.signInButton, {
      onClick: authentication.signIn
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_SignInButton.SignInButton, {
      ...slotProps?.signInButton
    });
  } else {
    accountContent = /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
      children: [slots?.preview ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.preview, {
        handleClick: handleClick,
        open: open
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_AccountPreview.AccountPreview, {
        variant: "condensed",
        handleClick: handleClick,
        open: open,
        ...slotProps?.preview
      }), slots?.popover ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.popover, {
        open: open,
        onClick: handleClick,
        onClose: handleClose,
        ...slotProps?.popover
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Popover.default, {
        anchorEl: anchorEl,
        id: "account-menu",
        open: open,
        onClose: handleClose,
        onClick: handleClose,
        transformOrigin: {
          horizontal: 'right',
          vertical: 'top'
        },
        anchorOrigin: {
          horizontal: 'right',
          vertical: 'bottom'
        },
        ...slotProps?.popover,
        slotProps: {
          paper: {
            elevation: 0,
            sx: {
              overflow: 'visible',
              filter: theme => `drop-shadow(0px 2px 8px ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.10)' : 'rgba(0,0,0,0.32)'})`,
              mt: 1,
              '&::before': {
                content: '""',
                display: 'block',
                position: 'absolute',
                top: 0,
                right: 14,
                width: 10,
                height: 10,
                bgcolor: 'background.paper',
                transform: 'translateY(-50%) rotate(45deg)',
                zIndex: 0
              }
            }
          },
          ...slotProps?.popover?.slotProps
        },
        children: slots?.popoverContent ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.popoverContent, {
          ...slotProps?.popoverContent
        }) : /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
          direction: "column",
          ...slotProps?.popoverContent,
          children: [_AccountPopoverHeader || (_AccountPopoverHeader = /*#__PURE__*/(0, _jsxRuntime.jsx)(_AccountPopoverHeader2.AccountPopoverHeader, {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_AccountPreview.AccountPreview, {
              variant: "expanded"
            })
          })), _Divider || (_Divider = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Divider2.default, {})), /*#__PURE__*/(0, _jsxRuntime.jsx)(_AccountPopoverFooter.AccountPopoverFooter, {
            children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_SignOutButton.SignOutButton, {
              ...slotProps?.signOutButton
            })
          })]
        })
      })]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_AccountLocaleContext.AccountLocaleContext.Provider, {
    value: localeText,
    children: accountContent
  });
}
process.env.NODE_ENV !== "production" ? Account.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The labels for the account component.
   */
  localeText: _propTypes.default.object,
  /**
   * The props used for each slot inside.
   */
  slotProps: _propTypes.default.shape({
    popover: _propTypes.default.object,
    popoverContent: _propTypes.default.object,
    preview: _propTypes.default.shape({
      handleClick: _propTypes.default.func,
      open: _propTypes.default.bool,
      slotProps: _propTypes.default.shape({
        avatar: _propTypes.default.object,
        avatarIconButton: _propTypes.default.object,
        moreIconButton: _propTypes.default.object
      }),
      slots: _propTypes.default.shape({
        avatar: _propTypes.default.elementType,
        avatarIconButton: _propTypes.default.elementType,
        moreIconButton: _propTypes.default.elementType
      }),
      sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
      variant: _propTypes.default.oneOf(['condensed', 'expanded'])
    }),
    signInButton: _propTypes.default.object,
    signOutButton: _propTypes.default.object
  }),
  /**
   * The components used for each slot inside.
   */
  slots: _propTypes.default.shape({
    popover: _propTypes.default.elementType,
    popoverContent: _propTypes.default.elementType,
    preview: _propTypes.default.elementType,
    signInButton: _propTypes.default.elementType,
    signOutButton: _propTypes.default.elementType
  })
} : void 0;