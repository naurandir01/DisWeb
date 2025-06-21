"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.AccountPreview = AccountPreview;
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _Avatar = _interopRequireDefault(require("@mui/material/Avatar"));
var _Typography = _interopRequireDefault(require("@mui/material/Typography"));
var _Tooltip = _interopRequireDefault(require("@mui/material/Tooltip"));
var _Stack = _interopRequireDefault(require("@mui/material/Stack"));
var _IconButton = _interopRequireDefault(require("@mui/material/IconButton"));
var _MoreVert = _interopRequireDefault(require("@mui/icons-material/MoreVert"));
var _AppProvider = require("../AppProvider");
var _LocalizationProvider = require("../AppProvider/LocalizationProvider");
var _AccountLocaleContext = require("./AccountLocaleContext");
var _jsxRuntime = require("react/jsx-runtime");
var _MoreVertIcon;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
/**
 * The AccountPreview component displays user account information.
 *
 * Demos:
 *
 * - [Account](https://mui.com/toolpad/core/react-account/)
 *
 * API:
 *
 * - [AccountPreview API](https://mui.com/toolpad/core/api/account-preview)
 */
function AccountPreview(props) {
  const {
    slots,
    variant = 'condensed',
    slotProps,
    open,
    handleClick,
    sx
  } = props;
  const session = React.useContext(_AppProvider.SessionContext);
  const globalLocaleText = (0, _LocalizationProvider.useLocaleText)();
  const accountLocaleText = React.useContext(_AccountLocaleContext.AccountLocaleContext);
  const localeText = {
    ...globalLocaleText,
    ...accountLocaleText
  };
  if (!session || !session.user) {
    return null;
  }
  const avatarContent = slots?.avatar ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.avatar, {}) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Avatar.default, {
    src: session.user?.image || '',
    alt: session.user?.name || session.user?.email || '',
    sx: {
      height: variant === 'expanded' ? 48 : 32,
      width: variant === 'expanded' ? 48 : 32
    },
    ...slotProps?.avatar
  });
  if (variant === 'expanded') {
    return /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
      direction: "row",
      justifyContent: "space-between",
      sx: {
        py: 1,
        px: 2,
        gap: 2,
        ...sx
      },
      children: [/*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
        direction: "row",
        justifyContent: "flex-start",
        spacing: 2,
        overflow: "hidden",
        children: [avatarContent, /*#__PURE__*/(0, _jsxRuntime.jsxs)(_Stack.default, {
          direction: "column",
          justifyContent: "space-evenly",
          overflow: "hidden",
          children: [/*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "body2",
            fontWeight: "bolder",
            noWrap: true,
            children: session.user?.name
          }), /*#__PURE__*/(0, _jsxRuntime.jsx)(_Typography.default, {
            variant: "caption",
            noWrap: true,
            children: session.user?.email
          })]
        })]
      }), handleClick && (slots?.moreIconButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.moreIconButton, {}) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        size: "small",
        onClick: handleClick,
        ...slotProps?.moreIconButton,
        sx: {
          alignSelf: 'center',
          ...slotProps?.moreIconButton?.sx
        },
        children: _MoreVertIcon || (_MoreVertIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_MoreVert.default, {
          fontSize: "small"
        }))
      }))]
    });
  }
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(_Tooltip.default, {
    title: session.user.name ?? accountLocaleText?.accountPreviewTitle,
    children: slots?.avatarIconButton ? /*#__PURE__*/(0, _jsxRuntime.jsx)(slots.avatarIconButton, {
      ...slotProps?.avatarIconButton
    }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_Stack.default, {
      sx: {
        py: 0.5,
        ...sx
      },
      children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_IconButton.default, {
        onClick: handleClick,
        "aria-label": localeText?.accountPreviewIconButtonLabel,
        size: "small",
        "aria-controls": open ? 'account-menu' : undefined,
        "aria-haspopup": "true",
        "aria-expanded": open ? 'true' : undefined,
        ...slotProps?.avatarIconButton,
        sx: {
          width: 'fit-content',
          margin: '0 auto',
          ...slotProps?.avatarIconButton?.sx
        },
        children: avatarContent
      })
    })
  });
}
process.env.NODE_ENV !== "production" ? AccountPreview.propTypes /* remove-proptypes */ = {
  // ┌────────────────────────────── Warning ──────────────────────────────┐
  // │ These PropTypes are generated from the TypeScript type definitions. │
  // │ To update them, edit the TypeScript types and run `pnpm proptypes`. │
  // └─────────────────────────────────────────────────────────────────────┘
  /**
   * The handler used when the preview is expanded
   */
  handleClick: _propTypes.default.func,
  /**
   * The state of the Account popover
   * @default false
   */
  open: _propTypes.default.bool,
  /**
   * The props used for each slot inside.
   */
  slotProps: _propTypes.default.shape({
    avatar: _propTypes.default.object,
    avatarIconButton: _propTypes.default.object,
    moreIconButton: _propTypes.default.object
  }),
  /**
   * The components used for each slot inside.
   */
  slots: _propTypes.default.shape({
    avatar: _propTypes.default.elementType,
    avatarIconButton: _propTypes.default.elementType,
    moreIconButton: _propTypes.default.elementType
  }),
  /**
   * The prop used to customize the styling of the preview
   */
  sx: _propTypes.default.oneOfType([_propTypes.default.arrayOf(_propTypes.default.oneOfType([_propTypes.default.func, _propTypes.default.object, _propTypes.default.bool])), _propTypes.default.func, _propTypes.default.object]),
  /**
   * The type of account details to display.
   * @property {'condensed'} condensed - Shows only the user's avatar.
   * @property {'expanded'} expanded - Displays the user's avatar, name, and email if available.
   * @default 'condensed'
   */
  variant: _propTypes.default.oneOf(['condensed', 'expanded'])
} : void 0;