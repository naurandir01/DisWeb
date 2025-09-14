import * as React from 'react';
import type { ChartsLocaleText } from "../locales/utils/chartsLocaleTextApi.js";
export interface ChartsLocalizationContextValue {
  localeText: ChartsLocaleText;
}
export declare const ChartsLocalizationContext: React.Context<ChartsLocalizationContextValue | null>;
export interface ChartsLocalizationProviderProps {
  children?: React.ReactNode;
  /**
   * Localized text for chart components.
   */
  localeText?: Partial<ChartsLocaleText>;
}
/**
 * Demos:
 *
 * - [localization](https://mui.com/x/react-charts/localization/)
 *
 * API:
 *
 * - [ChartsLocalizationProvider API](https://mui.com/x/api/charts/charts-localization-provider/)
 */
declare function ChartsLocalizationProvider(inProps: ChartsLocalizationProviderProps): React.JSX.Element;
declare namespace ChartsLocalizationProvider {
  var propTypes: any;
}
export { ChartsLocalizationProvider };