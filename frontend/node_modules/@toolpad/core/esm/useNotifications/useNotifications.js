import * as React from 'react';
import { NotificationsContext } from "./NotificationsContext.js";
const serverNotifications = {
  show: () => {
    throw new Error('Not supported on server side');
  },
  close: () => {
    throw new Error('Not supported on server side');
  }
};
export function useNotifications() {
  const context = React.useContext(NotificationsContext);
  if (context) {
    return context;
  }
  return serverNotifications;
}