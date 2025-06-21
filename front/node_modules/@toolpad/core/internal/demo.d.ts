import * as React from 'react';
import { Router } from "../AppProvider/index.js";
interface DemoProviderProps {
  /**
   * The window where the application is rendered.
   * @default window
   */
  window?: Window;
  children: React.ReactNode;
}
export declare function DemoProvider({
  window,
  children
}: DemoProviderProps): React.JSX.Element;
/**
 * Hook to create a router for demos.
 * @returns An in-memory router To be used in demos demos.
 */
export declare function useDemoRouter(initialUrl?: string): Router;
export {};