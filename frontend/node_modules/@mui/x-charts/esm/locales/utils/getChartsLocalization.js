import _extends from "@babel/runtime/helpers/esm/extends";
/**
 * Helper to pass translation to all charts thanks to the MUI theme.
 * @param chartsTranslations The translation object.
 * @returns an object to pass the translation by using the MUI theme default props
 */
export const getChartsLocalization = chartsTranslations => {
  return {
    components: {
      MuiChartsLocalizationProvider: {
        defaultProps: {
          localeText: _extends({}, chartsTranslations)
        }
      }
    }
  };
};