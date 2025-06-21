"use strict";
'use client';

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault").default;
var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard").default;
Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.ChartsLocalizationContext = void 0;
exports.ChartsLocalizationProvider = ChartsLocalizationProvider;
var _extends2 = _interopRequireDefault(require("@babel/runtime/helpers/extends"));
var _objectWithoutPropertiesLoose2 = _interopRequireDefault(require("@babel/runtime/helpers/objectWithoutPropertiesLoose"));
var React = _interopRequireWildcard(require("react"));
var _propTypes = _interopRequireDefault(require("prop-types"));
var _styles = require("@mui/material/styles");
var _enUS = require("../locales/enUS");
var _jsxRuntime = require("react/jsx-runtime");
const _excluded = ["localeText"];
const ChartsLocalizationContext = exports.ChartsLocalizationContext = /*#__PURE__*/React.createContext(null);
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
    other = (0, _objectWithoutPropertiesLoose2.default)(inProps, _excluded);
  const {
    localeText: parentLocaleText
  } = React.useContext(ChartsLocalizationContext) ?? {
    localeText: undefined
  };
  const props = (0, _styles.useThemeProps)({
    // We don't want to pass the `localeText` prop to the theme, that way it will always return the theme value,
    // We will then merge this theme value with our value manually
    props: other,
    name: 'MuiChartsLocalizationProvider'
  });
  const {
    children,
    localeText: themeLocaleText
  } = props;
  const localeText = React.useMemo(() => (0, _extends2.default)({}, _enUS.DEFAULT_LOCALE, themeLocaleText, parentLocaleText, inLocaleText), [themeLocaleText, parentLocaleText, inLocaleText]);
  const contextValue = React.useMemo(() => {
    return {
      localeText
    };
  }, [localeText]);
  return /*#__PURE__*/(0, _jsxRuntime.jsx)(ChartsLocalizationContext.Provider, {
    value: contextValue,
    children: children
  });
}
process.env.NODE_ENV !== "production" ? ChartsLocalizationProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: _propTypes.default.node,
  /**
   * Localized text for chart components.
   */
  localeText: _propTypes.default.object
} : void 0;