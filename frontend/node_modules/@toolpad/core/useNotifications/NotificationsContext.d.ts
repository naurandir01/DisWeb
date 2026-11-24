import * as React from 'react';
import type { ShowNotification, CloseNotification } from "./useNotifications.js";
/**
 * @ignore - internal component.
 */
export interface NotificationsContextValue {
  show: ShowNotification;
  close: CloseNotification;
}
export declare const NotificationsContext: React.Context<NotificationsContextValue | null>;