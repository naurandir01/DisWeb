import * as React from 'react';
import type { AppTheme } from "./AppProvider.js";
interface AppThemeProviderProps {
  children: React.ReactNode;
  theme: AppTheme;
  window?: Window;
  nonce?: string;
}
/**
 * @ignore - internal component.
 */
declare function AppThemeProvider(props: AppThemeProviderProps): React.JSX.Element;
export { AppThemeProvider };