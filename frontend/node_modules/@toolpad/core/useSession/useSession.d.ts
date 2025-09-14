import { Session } from "../AppProvider/index.js";
/**
 * Hook to access the current Toolpad Core session.
 * @returns The current session object or null if no session is available.
 */
export declare function useSession<T extends Session = Session>(): T | null;