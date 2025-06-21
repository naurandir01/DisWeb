"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NotificationsProvider = NotificationsProvider;
var React = _interopRequireWildcard(require("react"));
var _material = require("@mui/material");
var _Close = _interopRequireDefault(require("@mui/icons-material/Close"));
var _react2 = require("@toolpad/utils/react");
var _useSlotProps = _interopRequireDefault(require("@mui/utils/useSlotProps"));
var _NotificationsContext = require("./NotificationsContext");
var _LocalizationProvider = require("../AppProvider/LocalizationProvider");
var _jsxRuntime = require("react/jsx-runtime");
var _CloseIcon;
function _interopRequireWildcard(e, t) { if ("function" == typeof WeakMap) var r = new WeakMap(), n = new WeakMap(); return (_interopRequireWildcard = function (e, t) { if (!t && e && e.__esModule) return e; var o, i, f = { __proto__: null, default: e }; if (null === e || "object" != typeof e && "function" != typeof e) return f; if (o = t ? n : r) { if (o.has(e)) return o.get(e); o.set(e, f); } for (const t in e) "default" !== t && {}.hasOwnProperty.call(e, t) && ((i = (o = Object.defineProperty) && Object.getOwnPropertyDescriptor(e, t)) && (i.get || i.set) ? o(f, t, i) : f[t] = e[t]); return f; })(e, t); }
const RootPropsContext = /*#__PURE__*/React.createContext(null);
const defaultLocaleText = {
  close: 'Close'
};
function Notification({
  notificationKey,
  open,
  message,
  options,
  badge
}) {
  const globalLocaleText = (0, _LocalizationProvider.useLocaleText)();
  const localeText = {
    ...defaultLocaleText,
    ...globalLocaleText
  };
  const {
    close
  } = (0, _react2.useNonNullableContext)(_NotificationsContext.NotificationsContext);
  const {
    severity,
    actionText,
    onAction,
    autoHideDuration
  } = options;
  const handleClose = React.useCallback((event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    close(notificationKey);
  }, [notificationKey, close]);
  const action = /*#__PURE__*/(0, _jsxRuntime.jsxs)(React.Fragment, {
    children: [onAction ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Button, {
      color: "inherit",
      size: "small",
      onClick: onAction,
      children: actionText ?? 'Action'
    }) : null, /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.IconButton, {
      size: "small",
      "aria-label": localeText?.close,
      title: localeText?.close,
      color: "inherit",
      onClick: handleClose,
      children: _CloseIcon || (_CloseIcon = /*#__PURE__*/(0, _jsxRuntime.jsx)(_Close.default, {
        fontSize: "small"
      }))
    })]
  });
  const props = React.useContext(RootPropsContext);
  const SnackbarComponent = props?.slots?.snackbar ?? _material.Snackbar;
  const snackbarSlotProps = (0, _useSlotProps.default)({
    elementType: SnackbarComponent,
    ownerState: props,
    externalSlotProps: props?.slotProps?.snackbar,
    additionalProps: {
      open,
      autoHideDuration,
      onClose: handleClose,
      action
    }
  });
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(SnackbarComponent, {
    ...snackbarSlotProps,
    children: /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Badge, {
      badgeContent: badge,
      color: "primary",
      sx: {
        width: '100%'
      },
      children: severity ? /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.Alert, {
        severity: severity,
        sx: {
          width: '100%'
        },
        action: action,
        children: message
      }) : /*#__PURE__*/(0, _jsxRuntime.jsx)(_material.SnackbarContent, {
        message: message,
        action: action
      })
    })
  }, notificationKey);
}
function Notifications({
  state
}) {
  const currentNotification = state.queue[0] ?? null;
  return currentNotification ? /*#__PURE__*/(0, _jsxRuntime.jsx)(Notification, {
    ...currentNotification,
    badge: state.queue.length > 1 ? String(state.queue.length) : null
  }) : null;
}
let nextId = 0;
const generateId = () => {
  const id = nextId;
  nextId += 1;
  return id;
};

/**
 * Provider for Notifications. The subtree of this component can use the `useNotifications` hook to
 * access the notifications API. The notifications are shown in the same order they are requested.
 *
 * Demos:
 *
 * - [Sign-in Page](https://mui.com/toolpad/core/react-sign-in-page/)
 * - [useNotifications](https://mui.com/toolpad/core/react-use-notifications/)
 *
 * API:
 *
 * - [NotificationsProvider API](https://mui.com/toolpad/core/api/notifications-provider)
 */
function NotificationsProvider(props) {
  const {
    children
  } = props;
  const [state, setState] = React.useState({
    queue: []
  });
  const show = React.useCallback((message, options = {}) => {
    const notificationKey = options.key ?? `::toolpad-internal::notification::${generateId()}`;
    setState(prev => {
      if (prev.queue.some(n => n.notificationKey === notificationKey)) {
        // deduplicate by key
        return prev;
      }
      return {
        ...prev,
        queue: [...prev.queue, {
          message,
          options,
          notificationKey,
          open: true
        }]
      };
    });
    return notificationKey;
  }, []);
  const close = React.useCallback(key => {
    setState(prev => ({
      ...prev,
      queue: prev.queue.filter(n => n.notificationKey !== key)
    }));
  }, []);
  const contextValue = React.useMemo(() => ({
    show,
    close
  }), [show, close]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(RootPropsContext.Provider, {
    value: props,
    children: /*#__PURE__*/(0, _jsxRuntime.jsxs)(_NotificationsContext.NotificationsContext.Provider, {
      value: contextValue,
      children: [children, /*#__PURE__*/(0, _jsxRuntime.jsx)(Notifications, {
        state: state
      })]
    })
  });
}