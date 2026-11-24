import * as React from 'react';
import { SessionContext } from "../AppProvider/index.js";

/**
 * Hook to access the current Toolpad Core session.
 * @returns The current session object or null if no session is available.
 */
export function useSession() {
  const session = React.useContext(SessionContext);
  return session;
}