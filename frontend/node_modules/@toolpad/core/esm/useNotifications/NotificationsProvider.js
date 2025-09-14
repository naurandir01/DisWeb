'use client';

var _CloseIcon;
import * as React from 'react';
import { Alert, Badge, Button, IconButton, Snackbar, SnackbarContent } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNonNullableContext } from '@toolpad/utils/react';
import useSlotProps from '@mui/utils/useSlotProps';
import { NotificationsContext } from "./NotificationsContext.js";
import { useLocaleText } from "../AppProvider/LocalizationProvider.js";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
  const globalLocaleText = useLocaleText();
  const localeText = {
    ...defaultLocaleText,
    ...globalLocaleText
  };
  const {
    close
  } = useNonNullableContext(NotificationsContext);
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
  const action = /*#__PURE__*/_jsxs(React.Fragment, {
    children: [onAction ? /*#__PURE__*/_jsx(Button, {
      color: "inherit",
      size: "small",
      onClick: onAction,
      children: actionText ?? 'Action'
    }) : null, /*#__PURE__*/_jsx(IconButton, {
      size: "small",
      "aria-label": localeText?.close,
      title: localeText?.close,
      color: "inherit",
      onClick: handleClose,
      children: _CloseIcon || (_CloseIcon = /*#__PURE__*/_jsx(CloseIcon, {
        fontSize: "small"
      }))
    })]
  });
  const props = React.useContext(RootPropsContext);
  const SnackbarComponent = props?.slots?.snackbar ?? Snackbar;
  const snackbarSlotProps = useSlotProps({
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
  return /*#__PURE__*/_jsx(SnackbarComponent, {
    ...snackbarSlotProps,
    children: /*#__PURE__*/_jsx(Badge, {
      badgeContent: badge,
      color: "primary",
      sx: {
        width: '100%'
      },
      children: severity ? /*#__PURE__*/_jsx(Alert, {
        severity: severity,
        sx: {
          width: '100%'
        },
        action: action,
        children: message
      }) : /*#__PURE__*/_jsx(SnackbarContent, {
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
  return currentNotification ? /*#__PURE__*/_jsx(Notification, {
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
  return /*#__PURE__*/_jsx(RootPropsContext.Provider, {
    value: props,
    children: /*#__PURE__*/_jsxs(NotificationsContext.Provider, {
      value: contextValue,
      children: [children, /*#__PURE__*/_jsx(Notifications, {
        state: state
      })]
    })
  });
}
export { NotificationsProvider };