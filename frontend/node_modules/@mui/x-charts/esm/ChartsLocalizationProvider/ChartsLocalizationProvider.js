'use client';

import _extends from "@babel/runtime/helpers/esm/extends";
import _objectWithoutPropertiesLoose from "@babel/runtime/helpers/esm/objectWithoutPropertiesLoose";
const _excluded = ["localeText"];
import * as React from 'react';
import PropTypes from 'prop-types';
import { useThemeProps } from '@mui/material/styles';
import { DEFAULT_LOCALE } from "../locales/enUS.js";
import { jsx as _jsx } from "react/jsx-runtime";
export const ChartsLocalizationContext = /*#__PURE__*/React.createContext(null);
if (process.env.NODE_ENV !== "production") ChartsLocalizationContext.displayName = "ChartsLocalizationContext";
/**
 * Demos:
 *
 * - [localization](https://mui.com/x/react-charts/localization/)
 *
 * API:
 *
 * - [ChartsLocalizationProvider API](https://mui.com/x/api/charts/charts-localization-provider/)
 */
function ChartsLocalizationProvider(inProps) {
  const {
      localeText: inLocaleText
    } = inProps,
    other = _objectWithoutPropertiesLoose(inProps, _excluded);
  const {
    localeText: parentLocaleText
  } = React.useContext(ChartsLocalizationContext) ?? {
    localeText: undefined
  };
  const props = useThemeProps({
    // We don't want to pass the `localeText` prop to the theme, that way it will always return the theme value,
    // We will then merge this theme value with our value manually
    props: other,
    name: 'MuiChartsLocalizationProvider'
  });
  const {
    children,
    localeText: themeLocaleText
  } = props;
  const localeText = React.useMemo(() => _extends({}, DEFAULT_LOCALE, themeLocaleText, parentLocaleText, inLocaleText), [themeLocaleText, parentLocaleText, inLocaleText]);
  const contextValue = React.useMemo(() => {
    return {
      localeText
    };
  }, [localeText]);
  return /*#__PURE__*/_jsx(ChartsLocalizationContext.Provider, {
    value: contextValue,
    children: children
  });
}
process.env.NODE_ENV !== "production" ? ChartsLocalizationProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * Localized text for chart components.
   */
  localeText: PropTypes.object
} : void 0;
export { ChartsLocalizationProvider };